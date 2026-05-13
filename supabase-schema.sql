-- Supabase Schema for Oda B2B Marketplace

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Enums
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'admin');
CREATE TYPE inquiry_status AS ENUM ('pending', 'replied', 'closed', 'accepted', 'rejected');

-- 3. Create Users extension table (ties to Auth)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  company_name TEXT,
  role user_role DEFAULT 'buyer',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Companies Table
CREATE TABLE public.companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  industry TEXT,
  year_founded INTEGER,
  employee_count_range TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Categories Table
CREATE TABLE public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Products/Services Table
CREATE TABLE public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  min_order_quantity INTEGER DEFAULT 1,
  price_range TEXT,
  image_urls TEXT[],
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create Inquiries Table
CREATE TABLE public.inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  quantity_required INTEGER,
  status inquiry_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create Favorites Table
CREATE TABLE public.favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 9. Setup Row Level Security (RLS)

-- Profiles: Users can read all profiles, but only update their own.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Companies: Anyone can view, only owners can update.
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Companies are viewable by everyone" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Sellers can manage their company" ON public.companies FOR ALL USING (auth.uid() = owner_id);

-- Products: Anyone can view, only company owners can update.
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Company owners can insert products" ON public.products FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT owner_id FROM public.companies WHERE id = company_id)
);
CREATE POLICY "Company owners can update products" ON public.products FOR UPDATE USING (
  auth.uid() IN (SELECT owner_id FROM public.companies WHERE id = company_id)
);
CREATE POLICY "Company owners can delete products" ON public.products FOR DELETE USING (
  auth.uid() IN (SELECT owner_id FROM public.companies WHERE id = company_id)
);

-- Inquiries: Buyers can see their inquiries, sellers can see inquiries to them.
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buyers can view their inquiries" ON public.inquiries FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Sellers can view received inquiries" ON public.inquiries FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "Buyers can insert inquiries" ON public.inquiries FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Sellers can update inquiry status" ON public.inquiries FOR UPDATE USING (auth.uid() = seller_id);

-- Favorites: Users can manage their own favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- 10. Admin Functions (Bypass RLS)
-- Assume admins checking could be done via a function that checks profile role.
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Add admin bypass policies
CREATE POLICY "Admins have full access to profiles" ON public.profiles FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to companies" ON public.companies FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to products" ON public.products FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to inquiries" ON public.inquiries FOR ALL USING (is_admin());
