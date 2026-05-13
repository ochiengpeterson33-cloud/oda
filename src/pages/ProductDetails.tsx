import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../lib/mockData';
import { Building2, MapPin, ShieldCheck, Star, Truck, ChevronLeft, Heart, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const ProductDetails = () => {
  const { id } = useParams();
  const product = MOCK_PRODUCTS.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold text-earth-brown mb-4">Product not found</h2>
        <Link to="/marketplace" className="text-earth-olive hover:underline">Return to Marketplace</Link>
      </div>
    );
  }

  return (
    <div className="bg-earth-beige/20 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link to="/marketplace" className="inline-flex items-center text-sm font-medium text-earth-gray-dark hover:text-earth-brown mb-6 transition-colors">
          <ChevronLeft size={16} className="mr-1" /> Back to search
        </Link>

        <div className="bg-surface rounded-2xl overflow-hidden shadow-sm border border-earth-sand/30 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2">
             {/* Left: Images */}
             <div className="bg-earth-gray-light aspect-[4/3] md:aspect-auto md:h-[600px] relative">
               <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
               {product.is_featured && (
                  <div className="absolute top-4 left-4 bg-surface text-earth-olive text-xs font-bold px-3 py-1.5 rounded-md shadow-sm">
                    Featured Product
                  </div>
                )}
             </div>

             {/* Right: Details */}
             <div className="p-8 md:p-12 flex flex-col">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-earth-terracotta bg-earth-terracotta/10 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <button className="text-earth-gray-dark hover:text-earth-terracotta transition-colors">
                    <Heart size={24} />
                  </button>
                </div>
                
                <h1 className="text-3xl font-bold text-earth-brown mb-4 leading-tight">{product.title}</h1>
                
                <div className="flex items-center gap-4 mb-8 text-sm border-b border-earth-sand/30 pb-8">
                  <div className="flex items-center gap-1 text-earth-olive font-medium">
                    <Star size={16} fill="currentColor" />
                    <span>4.8 (24 reviews)</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-earth-sand"></div>
                  <div className="text-earth-gray-dark">150+ Sold</div>
                </div>

                <div className="mb-8">
                  <p className="text-earth-gray-dark text-sm mb-1">Wholesale Price</p>
                  <p className="text-4xl font-bold text-earth-brown mb-2">{product.price_range}</p>
                  <p className="text-sm text-earth-gray-dark">Minimum Order: <span className="font-semibold text-earth-brown">{product.min_order} units</span></p>
                </div>

                <div className="prose prose-sm text-earth-gray-dark mb-8">
                  <p>{product.description}</p>
                  <ul>
                    <li>Industry standard compliance</li>
                    <li>Sourced sustainably</li>
                    <li>Global shipping available</li>
                  </ul>
                </div>

                <div className="mt-auto flex flex-col gap-3 border-t border-earth-sand/30 pt-8">
                  <Button size="lg" className="w-full flex items-center justify-center gap-2">
                    <MessageSquare size={20} />
                    Contact Supplier
                  </Button>
                  <Button variant="outline" size="lg" className="w-full bg-surface">
                    Request Formal Quotation
                  </Button>
                </div>
             </div>
          </div>
        </div>

        {/* Supplier Profile Row */}
        <div className="bg-surface rounded-2xl p-8 border border-earth-sand/30 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-earth-olive/10 text-earth-olive rounded-2xl flex items-center justify-center">
              <Building2 size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-earth-brown">{product.company_name}</h3>
                <ShieldCheck size={18} className="text-earth-olive" />
              </div>
              <div className="flex items-center gap-4 text-sm text-earth-gray-dark">
                <span className="flex items-center gap-1"><MapPin size={14} /> Global</span>
                <span className="flex items-center gap-1"><Truck size={14} /> Ships in 7 Days</span>
              </div>
            </div>
          </div>
          <Button variant="secondary" className="w-full md:w-auto">View Supplier Profile</Button>
        </div>

      </div>
    </div>
  );
};
