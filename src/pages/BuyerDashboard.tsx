import React from 'react';
import { DashboardLayout } from './SellerDashboard';
import { Heart, MessageSquare, Clock, FileText, Settings, Search } from 'lucide-react';
import { MOCK_PRODUCTS } from '../lib/mockData';
import { Link } from 'react-router-dom';

export const BuyerDashboardView = () => {
  const buyerLinks = [
    { name: 'Dashboard', icon: <Search size={20} />, active: true },
    { name: 'Saved Products', icon: <Heart size={20} />, active: false },
    { name: 'My Inquiries', icon: <MessageSquare size={20} />, active: false },
    { name: 'Quotations', icon: <FileText size={20} />, active: false },
    { name: 'Settings', icon: <Settings size={20} />, active: false },
  ];

  return (
    <div className="min-h-screen bg-earth-gray-light flex flex-col md:flex-row">
      {/* Sidebar specific to Buyer */}
      <div className="w-full md:w-64 bg-surface border-r border-earth-sand/30 md:min-h-screen flex-shrink-0">
        <div className="p-6">
          <p className="text-[10px] text-earth-gray-dark uppercase tracking-widest mb-4 px-2">Buyer Portal</p>
          <nav className="space-y-1">
            {buyerLinks.map((link, idx) => (
              <button
                key={idx}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm text-left ${
                  link.active 
                    ? 'bg-earth-beige text-earth-olive' 
                    : 'text-earth-gray-dark hover:bg-earth-beige/50'
                }`}
              >
                {link.icon}
                {link.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
       <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-earth-brown">Procurement Dashboard</h1>
            <p className="text-earth-gray-dark">Track your inquiries and discover new suppliers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-surface p-6 rounded-2xl border border-earth-sand/30 shadow-sm">
              <h3 className="text-[10px] uppercase tracking-widest text-earth-gray-dark font-medium mb-1">Active Inquiries</h3>
              <p className="text-3xl font-bold text-earth-brown mb-2">4</p>
              <p className="text-xs font-medium text-earth-olive">2 waiting for response</p>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-earth-sand/30 shadow-sm">
              <h3 className="text-[10px] uppercase tracking-widest text-earth-gray-dark font-medium mb-1">Saved Items</h3>
              <p className="text-3xl font-bold text-earth-brown mb-2">12</p>
              <Link to="/marketplace" className="text-xs font-medium text-earth-terracotta hover:underline">Explore marketplace</Link>
            </div>
             <div className="bg-surface p-6 rounded-2xl border border-earth-sand/30 shadow-sm">
              <h3 className="text-[10px] uppercase tracking-widest text-earth-gray-dark font-medium mb-1">Total Spent YTD</h3>
              <p className="text-3xl font-bold text-earth-brown mb-2">KES 5.5M</p>
              <p className="text-xs font-medium text-earth-gray-dark">Across 3 suppliers</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-earth-brown mb-4">Recently Saved Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {MOCK_PRODUCTS.slice(0, 3).map((product) => (
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
                   <button className="mt-auto w-full py-2 bg-earth-olive/10 text-earth-olive font-medium rounded-lg text-sm hover:bg-earth-olive hover:text-white transition-colors">
                     Send Inquiry
                   </button>
                </div>
              </div>
            ))}
          </div>
          
           <div className="bg-surface p-6 rounded-2xl border border-earth-sand/30 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-earth-brown">Message Updates</h2>
            </div>
            
            <div className="space-y-3">
              {[
                { s: 'TechPack Solutions', p: 'Automated Packaging Conveyor', d: '2 hours ago', status: 'Replied' },
                { s: 'MetalWorks Global', p: 'Stainless Steel Sheets Pricing', d: '1 day ago', status: 'Pending' }
              ].map((msg, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-earth-sand/30 hover:bg-earth-beige/50 transition-colors cursor-pointer gap-4">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-earth-olive/10 text-earth-olive flex items-center justify-center flex-shrink-0">
                       <MessageSquare size={18} />
                     </div>
                     <div>
                       <h4 className="font-semibold text-earth-brown text-sm">{msg.s}</h4>
                       <p className="text-xs text-earth-gray-dark">Re: {msg.p}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 ml-14 sm:ml-0">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${msg.status === 'Replied' ? 'bg-earth-olive/10 text-earth-olive' : 'bg-earth-sand text-earth-brown'}`}>
                      {msg.status}
                    </span>
                    <span className="text-xs text-earth-gray-dark flex items-center gap-1">
                      <Clock size={12} /> {msg.d}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
