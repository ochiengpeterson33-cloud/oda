import React, { useState, useEffect } from 'react';
import { DashboardLayout } from './SellerDashboard';
import { Heart, MessageSquare, Clock, FileText, Settings, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

export const BuyerDashboardView = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('Dashboard');

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const { data } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);
        setProducts(data || []);
      } catch (err) {
        console.error("Error fetching recommended products:", err);
      }
    };
    
    if (supabase) {
      fetchLatest();

      const subscription = supabase
        .channel('buyer:products')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
          fetchLatest();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, []);

  const buyerLinks = [
    { name: 'Dashboard', icon: <Search size={20} />, active: activeTab === 'Dashboard', onClick: () => setActiveTab('Dashboard') },
    { name: 'Saved Products', icon: <Heart size={20} />, active: activeTab === 'Saved Products', onClick: () => setActiveTab('Saved Products') },
    { name: 'My Inquiries', icon: <MessageSquare size={20} />, active: activeTab === 'My Inquiries', onClick: () => setActiveTab('My Inquiries') },
    { name: 'Quotations', icon: <FileText size={20} />, active: activeTab === 'Quotations', onClick: () => setActiveTab('Quotations') },
    { name: 'Settings', icon: <Settings size={20} />, active: activeTab === 'Settings', onClick: () => setActiveTab('Settings') },
  ];

  return (
    <DashboardLayout role="buyer" title="Buyer Portal" links={buyerLinks}>
      {activeTab === 'Dashboard' && (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-earth-brown">Procurement Dashboard</h1>
            <p className="text-earth-gray-dark">Track your inquiries and discover new suppliers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-surface p-6 rounded-2xl border border-earth-sand/30 shadow-sm">
              <h3 className="text-[10px] uppercase tracking-widest text-earth-gray-dark font-medium mb-1">Active Inquiries</h3>
              <p className="text-3xl font-bold text-earth-brown mb-2">0</p>
              <p className="text-xs font-medium text-earth-olive">0 waiting for response</p>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-earth-sand/30 shadow-sm">
              <h3 className="text-[10px] uppercase tracking-widest text-earth-gray-dark font-medium mb-1">Saved Items</h3>
              <p className="text-3xl font-bold text-earth-brown mb-2">0</p>
              <Link to="/marketplace" className="text-xs font-medium text-earth-terracotta hover:underline">Explore marketplace</Link>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-earth-sand/30 shadow-sm">
              <h3 className="text-[10px] uppercase tracking-widest text-earth-gray-dark font-medium mb-1">Total Spent YTD</h3>
              <p className="text-3xl font-bold text-earth-brown mb-2">KES 0</p>
              <p className="text-xs font-medium text-earth-gray-dark">Across 0 suppliers</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-earth-brown mb-4">Recently Added Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {products.length > 0 ? products.map((product) => (
              <div key={product.id} className="bg-surface rounded-2xl overflow-hidden border border-earth-sand/30 flex flex-col">
                <div className="relative aspect-video">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                  <button className="absolute top-2 right-2 p-2 bg-surface rounded-full text-earth-terracotta shadow-sm hover:scale-105 transition-transform">
                    <Heart size={16} fill="currentColor" />
                  </button>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h4 className="font-bold text-earth-brown text-sm mb-1 line-clamp-1">{product.title}</h4>
                  <p className="text-xs text-earth-gray-dark mb-3">{product.company_name}</p>
                  <Link to={`/products/${product.id}`} className="mt-auto w-full text-center block py-2 bg-earth-olive/10 text-earth-olive font-medium rounded-lg text-sm hover:bg-earth-olive hover:text-white transition-colors">
                    View Details
                  </Link>
                </div>
              </div>
            )) : (
              <div className="col-span-3 bg-surface p-8 text-center rounded-2xl border border-earth-sand/30 border-dashed">
                <p className="text-earth-gray-dark">No products available. Switch to a seller account to add some!</p>
              </div>
            )}
          </div>
          
          <div className="bg-surface p-6 rounded-2xl border border-earth-sand/30 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-earth-brown">Message Updates</h2>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-earth-gray-dark py-4 text-center">No recent messages.</p>
            </div>
          </div>
        </>
      )}

      {activeTab === 'Saved Products' && (
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-earth-brown mb-2">Saved Products</h1>
          <p className="text-earth-gray-dark mb-6">Products you have wishlisted for later.</p>
          <div className="bg-surface p-8 text-center rounded-2xl border border-earth-sand/30 border-dashed">
            <Heart size={48} className="mx-auto text-earth-sand mb-4" />
            <h3 className="text-lg font-bold text-earth-brown mb-2">No saved products yet</h3>
            <p className="text-earth-gray-dark mb-4">When you favorite products in the marketplace, they will appear here.</p>
            <Link to="/marketplace" className="inline-block px-6 py-2 bg-earth-olive text-white rounded-xl font-medium hover:bg-earth-olive-dark transition-colors">Browse Marketplace</Link>
          </div>
        </div>
      )}

      {activeTab === 'My Inquiries' && (
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-earth-brown mb-2">My Inquiries</h1>
          <p className="text-earth-gray-dark mb-6">Track your conversations with suppliers.</p>
          <div className="bg-surface p-8 text-center rounded-2xl border border-earth-sand/30 border-dashed">
            <MessageSquare size={48} className="mx-auto text-earth-sand mb-4" />
            <h3 className="text-lg font-bold text-earth-brown mb-2">No active inquiries</h3>
            <p className="text-earth-gray-dark mb-4">Start reaching out to suppliers to see your messages here.</p>
            <Link to="/marketplace" className="inline-block px-6 py-2 bg-earth-olive text-white rounded-xl font-medium hover:bg-earth-olive-dark transition-colors">Find Suppliers</Link>
          </div>
        </div>
      )}

      {activeTab === 'Quotations' && (
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-earth-brown mb-2">Quotations</h1>
          <p className="text-earth-gray-dark mb-6">Manage specific price quotes requested from suppliers.</p>
          <div className="bg-surface p-8 text-center rounded-2xl border border-earth-sand/30 border-dashed">
            <FileText size={48} className="mx-auto text-earth-sand mb-4" />
            <h3 className="text-lg font-bold text-earth-brown mb-2">No quotations</h3>
            <p className="text-earth-gray-dark">You haven't requested any custom quotations yet.</p>
          </div>
        </div>
      )}

      {activeTab === 'Settings' && (
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-earth-brown mb-2">Account Settings</h1>
          <p className="text-earth-gray-dark mb-6">Manage your buyer profile and preferences.</p>
          <div className="bg-surface p-6 rounded-2xl border border-earth-sand/30 shadow-sm max-w-2xl">
            <h3 className="font-bold text-earth-brown mb-4 border-b border-earth-sand/50 pb-2">Profile Information</h3>
            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-earth-gray-dark mb-1">Coming Soon</label>
                  <p className="text-sm">Account settings are being built and will be available in the next update.</p>
               </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
