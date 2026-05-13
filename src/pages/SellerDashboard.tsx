import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  BarChart3, 
  Package, 
  MessageSquare, 
  Settings, 
  Store, 
  Plus, 
  TrendingUp,
  Clock,
  CheckCircle2,
  X,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const mockChartData = [
  { name: 'Jan', views: 400, inquiries: 24 },
  { name: 'Feb', views: 300, inquiries: 13 },
  { name: 'Mar', views: 500, inquiries: 38 },
  { name: 'Apr', views: 800, inquiries: 43 },
  { name: 'May', views: 600, inquiries: 28 },
  { name: 'Jun', views: 900, inquiries: 55 },
];

export const DashboardLayout = ({ children, role, links, title }: { children: React.ReactNode, role: 'seller' | 'buyer' | 'admin', links: {name: string, icon: React.ReactNode, active: boolean, onClick?: () => void}[], title: string }) => {
  const { profile } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-earth-gray-light flex flex-col md:flex-row">
      {/* Mobile Header for Sidebar Toggle */}
      <div className="md:hidden flex items-center justify-between p-4 bg-surface border-b border-earth-sand/30">
        <p className="text-sm text-earth-gray-dark uppercase tracking-widest font-bold">{title}</p>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-earth-brown rounded-md hover:bg-earth-beige">
          {isMobileMenuOpen ? <X size={20} /> : <div className="space-y-1"><div className="w-5 h-0.5 bg-current"></div><div className="w-5 h-0.5 bg-current"></div><div className="w-5 h-0.5 bg-current"></div></div>}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-surface border-r border-earth-sand/30 md:min-h-screen flex-shrink-0 z-10`}>
        <div className="p-4 md:p-6">
          <p className="hidden md:block text-[10px] text-earth-gray-dark uppercase tracking-widest mb-4 px-2">{title}</p>
          <nav className="space-y-1">
            {links.map((link, idx) => (
              <button
                key={idx}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm text-left ${
                  link.active 
                    ? 'bg-earth-beige text-earth-olive' 
                    : 'text-earth-gray-dark hover:bg-earth-beige/50'
                }`}
                onClick={() => {
                  if (link.onClick) link.onClick();
                  setIsMobileMenuOpen(false);
                }}
              >
                {link.icon}
                {link.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-auto relative">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export const SellerDashboardView = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { user, profile } = useAuth();
  const [productsCount, setProductsCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchProducts = async () => {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', user.id);
      
      setProductsCount(count || 0);
    };
    fetchProducts();

    const subscription = supabase
      .channel('seller:products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products', filter: `company_id=eq.${user.id}` }, () => {
        fetchProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  const sellerLinks = [
    { name: 'Overview', icon: <BarChart3 size={20} />, active: true },
    { name: 'Products', icon: <Package size={20} />, active: false },
    { name: 'Inquiries', icon: <MessageSquare size={20} />, active: false },
    { name: 'Company Profile', icon: <Store size={20} />, active: false },
    { name: 'Settings', icon: <Settings size={20} />, active: false },
  ];

  return (
    <DashboardLayout role="seller" title="Seller Portal" links={sellerLinks}>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-earth-brown">Welcome back, {profile?.company_name || profile?.first_name || 'Supplier'}</h1>
          <p className="text-earth-gray-dark">Here's what's happening with your products today.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-earth-olive hover:bg-earth-olive-dark text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm flex items-center gap-2 text-sm"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Active Listings" value={productsCount.toString()} icon={<Package className="text-earth-olive" size={24} />} trend="Updated via Realtime" />
        <StatCard title="Total Views" value="0" icon={<TrendingUp className="text-earth-terracotta" size={24} />} trend="Feature coming soon" />
        <StatCard title="New Inquiries" value="0" icon={<MessageSquare className="text-earth-sand" size={24} />} trend="No pending replies" highlight={true} />
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
            <p className="text-sm text-earth-gray-dark py-4 text-center">No recent messages.</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <AddProductModal 
            onClose={() => setIsAddModalOpen(false)} 
            userId={user?.id}
            companyName={profile?.company_name || `${profile?.first_name || 'My'} Company`}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

const AddProductModal = ({ onClose, userId, companyName }: { onClose: () => void, userId?: string, companyName?: string }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Raw Materials',
    price_range: '',
    min_order: 100,
    description: '',
    image: 'https://images.unsplash.com/photo-1587884784915-d419dd1ac5ee?auto=format&fit=crop&q=80&w=800'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError("You must be logged in to add a product.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from('products').insert([
        {
          title: formData.title,
          category: formData.category,
          price_range: formData.price_range,
          min_order: Number(formData.min_order),
          description: formData.description,
          image: formData.image,
          company_id: userId,
          company_name: companyName,
          is_featured: false
        }
      ]);

      if (insertError) throw insertError;
      
      onClose();
    } catch (err: any) {
      console.error("Error adding product:", err);
      setError(err.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-earth-brown/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface rounded-2xl shadow-xl border border-earth-sand shadow-black/10 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center p-6 border-b border-earth-sand/50">
          <h2 className="text-xl font-bold text-earth-brown">Add New Product</h2>
          <button onClick={onClose} className="p-1 hover:bg-earth-beige rounded-full text-earth-gray-dark transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}
          
          <form id="add-product-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-earth-gray-dark mb-1">Product Title</label>
              <Input 
                required 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Industrial Steel Sheets" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-earth-gray-dark mb-1">Category</label>
                <select 
                  className="w-full px-4 py-2 border border-earth-sand rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-earth-olive/50 focus:border-earth-olive transition-colors text-earth-brown"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option>Raw Materials</option>
                  <option>Machinery & Equipment</option>
                  <option>Packaging Solutions</option>
                  <option>Electronics Components</option>
                  <option>Textiles & Apparel</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-earth-gray-dark mb-1">Min. Order Qty</label>
                <Input 
                  type="number" 
                  required 
                  min="1"
                  value={formData.min_order}
                  onChange={e => setFormData({...formData, min_order: parseInt(e.target.value) || 1})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-gray-dark mb-1">Price Range</label>
              <Input 
                required 
                placeholder="e.g. KES 300 - 500 / kg" 
                value={formData.price_range}
                onChange={e => setFormData({...formData, price_range: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-gray-dark mb-1">Description</label>
              <textarea 
                required
                className="w-full px-4 py-2 border border-earth-sand rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-earth-olive/50 focus:border-earth-olive transition-colors text-earth-brown min-h-[100px]"
                placeholder="Describe your product..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-earth-gray-dark mb-1">Image URL</label>
              <Input 
                required 
                placeholder="https://..." 
                value={formData.image}
                onChange={e => setFormData({...formData, image: e.target.value})}
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-earth-sand/50 bg-earth-beige/20 flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            form="add-product-form"
            type="submit" 
            disabled={loading}
            className="bg-earth-olive hover:bg-earth-olive-dark text-white min-w-[120px]"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Add Product'}
          </Button>
        </div>
      </motion.div>
    </div>
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
