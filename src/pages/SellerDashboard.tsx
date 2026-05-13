import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { 
  BarChart3, 
  Package, 
  MessageSquare, 
  Settings, 
  Store, 
  Plus, 
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { name: 'Jan', views: 400, inquiries: 24 },
  { name: 'Feb', views: 300, inquiries: 13 },
  { name: 'Mar', views: 500, inquiries: 38 },
  { name: 'Apr', views: 800, inquiries: 43 },
  { name: 'May', views: 600, inquiries: 28 },
  { name: 'Jun', views: 900, inquiries: 55 },
];

export const DashboardLayout = ({ children, role }: { children: React.ReactNode, role: 'seller' | 'buyer' | 'admin' }) => {
  const { profile } = useAuth();
  const userName = profile?.first_name || 'User';

  const sellerLinks = [
    { name: 'Overview', icon: <BarChart3 size={20} />, active: true },
    { name: 'Products', icon: <Package size={20} />, active: false },
    { name: 'Inquiries', icon: <MessageSquare size={20} />, active: false },
    { name: 'Company Profile', icon: <Store size={20} />, active: false },
    { name: 'Settings', icon: <Settings size={20} />, active: false },
  ];

  return (
    <div className="min-h-screen bg-earth-gray-light flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-surface border-r border-earth-sand/30 md:min-h-screen flex-shrink-0">
        <div className="p-6">
          <p className="text-[10px] text-earth-gray-dark uppercase tracking-widest mb-4 px-2 tracking-widest">Seller Portal</p>
          <nav className="space-y-1">
            {sellerLinks.map((link, idx) => (
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
          {children}
        </div>
      </div>
    </div>
  );
};

export const SellerDashboardView = () => {
  return (
    <DashboardLayout role="seller">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-earth-brown">Welcome back, Supplier</h1>
          <p className="text-earth-gray-dark">Here's what's happening with your products today.</p>
        </div>
        <button className="bg-earth-olive hover:bg-earth-olive-dark text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm flex items-center gap-2 text-sm">
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Active Listings" value="12" icon={<Package className="text-earth-olive" size={24} />} trend="+2 this month" />
        <StatCard title="Total Views" value="3,500" icon={<TrendingUp className="text-earth-terracotta" size={24} />} trend="+15% vs last month" />
        <StatCard title="New Inquiries" value="8" icon={<MessageSquare className="text-earth-sand" size={24} />} trend="3 need replies" highlight={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-surface p-6 rounded-2xl border border-earth-sand/30 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-earth-brown">Performance Analytics</h2>
            <p className="text-sm text-earth-gray-dark">Product views and inquiries over time</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#556B2F" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#556B2F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5d6be" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #D8C3A5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: '#3E2C23', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="views" stroke="#556B2F" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Inquiries List */}
        <div className="bg-surface p-6 rounded-2xl border border-earth-sand/30 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-earth-brown">Recent Inquiries</h2>
            <button className="text-sm text-earth-olive font-medium">View All</button>
          </div>
          
          <div className="space-y-4 flex-grow">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl bg-earth-beige/50 border border-earth-sand/50">
                <div className="w-10 h-10 rounded-full bg-earth-sand flex items-center justify-center text-earth-brown font-bold flex-shrink-0">
                  {['J', 'S', 'M'][i-1]}
                </div>
                <div>
                  <h4 className="font-semibold text-earth-brown text-sm">{['John Doe', 'Sarah Smith', 'Mike Johnson'][i-1]}</h4>
                  <p className="text-xs text-earth-gray-dark mb-2">Interested in Industrial Grade Steel...</p>
                  <div className="flex items-center gap-1 text-xs font-medium text-earth-terracotta">
                    <Clock size={12} /> Pending Reply
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const StatCard = ({ title, value, icon, trend, highlight = false }: { title: string, value: string, icon: React.ReactNode, trend: string, highlight?: boolean }) => (
  <div className={`p-6 rounded-2xl border ${highlight ? 'border-earth-terracotta bg-earth-terracotta/5' : 'border-earth-sand/30 bg-surface'} shadow-sm`}>
    <div className="flex justify-between items-start mb-4">
      <div className="bg-surface p-3 rounded-2xl shadow-sm">
        {icon}
      </div>
      {highlight && (
        <span className="flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-earth-terracotta opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-earth-terracotta"></span>
        </span>
      )}
    </div>
    <h3 className="text-earth-gray-dark text-sm font-medium mb-1">{title}</h3>
    <p className="text-3xl font-bold text-earth-brown mb-2">{value}</p>
    <p className="text-xs font-medium text-earth-olive">{trend}</p>
  </div>
);
