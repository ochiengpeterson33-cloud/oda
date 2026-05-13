import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Search, Filter, SlidersHorizontal, Package, Building2, ExternalLink, Loader2 } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

const DEFAULT_CATEGORIES = [
  { id: '1', name: 'Raw Materials' },
  { id: '2', name: 'Machinery & Equipment' },
  { id: '3', name: 'Packaging Solutions' },
  { id: '4', name: 'Electronics Components' },
  { id: '5', name: 'Textiles & Apparel' },
];

export const MarketplacePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      setError("System setup incomplete: Missing Supabase configuration.");
      return;
    }

    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          if (error.code === '42P01') { // relation does not exist
             setError("Initial Setup Required: The 'products' table does not exist in your Supabase database yet. Please create it first to start adding products.");
          } else {
             setError(error.message);
          }
           throw error;
        }
        
        setProducts(data || []);
      } catch (err: any) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Set up realtime subscription
    const subscription = supabase
      .channel('public:products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, payload => {
        if (payload.eventType === 'INSERT') {
          setProducts(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
           setProducts(prev => prev.map(p => p.id === payload.new.id ? payload.new : p));
        } else if (payload.eventType === 'DELETE') {
           setProducts(prev => prev.filter(p => p.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const filteredProducts = products.filter((product) => {
    const titleMatch = product.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const companyMatch = product.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = titleMatch || companyMatch;
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-earth-beige/30 pb-20">
      {/* Header */}
      <div className="bg-surface border-b border-earth-sand/30 pt-8 pb-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-earth-brown mb-2">Marketplace</h1>
          <p className="text-earth-gray-dark mb-8">Discover premium products from verified suppliers globally.</p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Input 
                placeholder="Search products, suppliers, or keywords..." 
                icon={<Search size={20} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-earth-gray-light border-transparent focus:bg-surface"
              />
            </div>
            <Button variant="outline" className="md:w-auto" onClick={() => setIsFilterOpen(!isFilterOpen)}>
              <SlidersHorizontal size={18} className="mr-2" />
              Filters
            </Button>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-6 mt-6 border-t border-earth-sand grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-earth-brown mb-3">Categories</h3>
                    <div className="space-y-2">
                       <button 
                          onClick={() => setSelectedCategory(null)}
                          className={`block text-sm transition-colors ${selectedCategory === null ? 'text-earth-olive font-medium' : 'text-earth-gray-dark hover:text-earth-brown'}`}
                        >
                          All Categories
                        </button>
                      {DEFAULT_CATEGORIES.map(cat => (
                        <button 
                          key={cat.id} 
                          onClick={() => setSelectedCategory(cat.name)}
                          className={`block text-sm transition-colors ${selectedCategory === cat.name ? 'text-earth-olive font-medium' : 'text-earth-gray-dark hover:text-earth-brown'}`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex justify-between items-center mb-6">
          <p className="text-earth-gray-dark font-medium">
            Showing <span className="text-earth-brown font-bold">{filteredProducts.length}</span> products
          </p>
          <div className="flex gap-2">
             <select className="bg-transparent border border-earth-sand rounded-lg px-3 py-1.5 text-sm text-earth-brown focus:outline-none focus:ring-1 focus:ring-earth-olive">
               <option>Most Relevant</option>
               <option>Price: Low to High</option>
               <option>Price: High to Low</option>
               <option>Newest Arrivals</option>
             </select>
          </div>
        </div>

        {error ? (
          <div className="bg-earth-terracotta/10 border border-earth-terracotta/20 text-earth-terracotta text-sm rounded-xl p-4 mb-6">
            {error}
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center py-20">
             <Loader2 size={32} className="animate-spin text-earth-olive" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-surface rounded-2xl p-16 text-center border border-earth-sand/30 border-dashed mt-8">
            <Package size={48} className="mx-auto text-earth-sand mb-4" />
            <h3 className="text-xl font-bold text-earth-brown mb-2">No products found</h3>
            <p className="text-earth-gray-dark">Try adjusting your search terms or filters.</p>
            <Button variant="outline" className="mt-6" onClick={() => { setSearchTerm(''); setSelectedCategory(null); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-surface rounded-2xl overflow-hidden border border-earth-sand/30 shadow-sm group flex flex-col h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-earth-gray-light">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.is_featured && (
          <div className="absolute top-3 right-3 bg-surface text-earth-olive text-xs font-bold px-2 py-1 rounded-md shadow-sm">
            Featured
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
            <p className="text-xs font-medium text-earth-terracotta mb-2">{product.category}</p>
            <h3 className="text-lg font-bold text-earth-brown leading-tight mb-2 line-clamp-2">
            {product.title}
            </h3>
            
            <div className="flex items-center gap-2 mb-4 text-sm text-earth-gray-dark">
            <Building2 size={16} className="text-earth-sand" />
            <span className="truncate">{product.company_name}</span>
            </div>
            
            <div className="space-y-1 mb-6">
            <div className="flex justify-between text-sm">
                <span className="text-earth-gray-dark">Price</span>
                <span className="font-semibold text-earth-brown">{product.price_range}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-earth-gray-dark">Min. Order</span>
                <span className="font-medium text-earth-brown">{product.min_order} units</span>
            </div>
            </div>
        </div>

        <Link 
          to={`/products/${product.id}`}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-earth-beige text-earth-brown font-medium rounded-xl hover:bg-earth-sand transition-colors mt-auto"
        >
          View Details
          <ExternalLink size={16} />
        </Link>
      </div>
    </motion.div>
  );
};
