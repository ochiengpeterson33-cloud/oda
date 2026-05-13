-- Supabase SQL Schema for Oda Marketplace

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Profiles Table (extends auth.users)
-- This table stores user data like role and company name
create table public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  email text not null,
  first_name text,
  last_name text,
  company_name text,
  role text check (role in ('buyer', 'seller', 'admin')) default 'buyer',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security for profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- 2. Trigger to automatically create a profile after signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name, company_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'company_name',
    coalesce(new.raw_user_meta_data->>'role', 'buyer')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 3. Categories Table
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.categories enable row level security;
create policy "Categories are viewable by everyone." on public.categories for select using (true);
create policy "Admins can insert categories." on public.categories for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);


-- 4. Products Table
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  supplier_id uuid references public.profiles(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  description text,
  price_range text, -- e.g. "KES 325 - 520 / kg"
  min_order integer default 1,
  image_url text,
  is_featured boolean default false,
  status text check (status in ('draft', 'active', 'archived')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.products enable row level security;
create policy "Active products are viewable by everyone" on public.products for select using (status = 'active');
create policy "Sellers can view their own products" on public.products for select using (auth.uid() = supplier_id);
create policy "Sellers can insert their own products" on public.products for insert with check (auth.uid() = supplier_id);
create policy "Sellers can update their own products" on public.products for update using (auth.uid() = supplier_id);
create policy "Sellers can delete their own products" on public.products for delete using (auth.uid() = supplier_id);


-- 5. Inquiries Table (Messaging between buyers and sellers)
create table public.inquiries (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete set null,
  buyer_id uuid references public.profiles(id) on delete cascade not null,
  seller_id uuid references public.profiles(id) on delete cascade not null,
  message text not null,
  status text check (status in ('pending', 'replied', 'closed')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.inquiries enable row level security;
create policy "Users can view their own inquiries" on public.inquiries for select using (auth.uid() = buyer_id or auth.uid() = seller_id);
create policy "Buyers can insert inquiries" on public.inquiries for insert with check (auth.uid() = buyer_id);
create policy "Sellers can update inquiries" on public.inquiries for update using (auth.uid() = seller_id);


-- 6. Saved Products Table
create table public.saved_products (
  id uuid default uuid_generate_v4() primary key,
  buyer_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(buyer_id, product_id)
);

alter table public.saved_products enable row level security;
create policy "Buyers can view their saved products" on public.saved_products for select using (auth.uid() = buyer_id);
create policy "Buyers can save products" on public.saved_products for insert with check (auth.uid() = buyer_id);
create policy "Buyers can remove saved products" on public.saved_products for delete using (auth.uid() = buyer_id);


-- Set up Storage for product images
insert into storage.buckets (id, name, public) values ('products', 'products', true);
create policy "Product images are publicly accessible." on storage.objects for select using (bucket_id = 'products');
create policy "Sellers can upload product images." on storage.objects for insert with check (
  bucket_id = 'products' and exists (select 1 from public.profiles where id = auth.uid() and role = 'seller')
);
create policy "Sellers can update their own product images." on storage.objects for update using (
  bucket_id = 'products' and auth.uid() = owner
);
create policy "Sellers can delete their own product images." on storage.objects for delete using (
  bucket_id = 'products' and auth.uid() = owner
);
