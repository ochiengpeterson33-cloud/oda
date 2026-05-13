import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { LogOut, User, Menu, X, Building2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-surface sticky top-0 z-50 border-b border-earth-sand/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-earth-olive text-white p-2 rounded-lg">
                <Building2 size={24} />
              </div>
              <span className="text-2xl font-bold tracking-tighter text-earth-brown">oda<span className="text-earth-terracotta">.</span></span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/marketplace" className="text-earth-gray-dark hover:text-earth-olive transition-colors font-medium">Marketplace</Link>
            <Link to="/suppliers" className="text-earth-gray-dark hover:text-earth-olive transition-colors font-medium">Suppliers</Link>
            
            {user ? (
              <div className="flex items-center space-x-4 ml-4 border-l border-earth-sand pl-6">
                <Link 
                  to={profile?.role === 'seller' ? '/dashboard/seller' : profile?.role === 'admin' ? '/admin' : '/dashboard/buyer'}
                  className="text-earth-gray-dark hover:text-earth-brown font-medium flex items-center gap-2"
                >
                  <User size={18} />
                  Dashboard
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="text-earth-terracotta hover:text-earth-terracotta-dark transition-colors flex items-center gap-1 font-medium"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4 ml-4 border-l border-earth-sand pl-6">
                <Link to="/login" className="text-earth-gray-dark hover:text-earth-brown font-medium transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="bg-earth-olive text-white rounded-lg text-sm font-medium shadow-lg shadow-earth-olive/20 px-5 py-2.5 transition-all">
                  Join Oda
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-earth-gray-dark hover:text-earth-brown p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-surface border-t border-earth-gray-light overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
              <Link to="/marketplace" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 text-earth-brown font-medium hover:bg-earth-sand-light rounded-md">Marketplace</Link>
              <Link to="/suppliers" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 text-earth-brown font-medium hover:bg-earth-sand-light rounded-md">Suppliers</Link>
              
              {user ? (
                <>
                  <Link 
                    to={profile?.role === 'seller' ? '/dashboard/seller' : profile?.role === 'admin' ? '/admin' : '/dashboard/buyer'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-3 text-earth-brown font-medium hover:bg-earth-sand-light rounded-md"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}
                    className="block w-full text-left px-3 py-3 text-earth-terracotta font-medium hover:bg-red-50 rounded-md"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="pt-4 flex flex-col gap-3">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-3 border border-earth-olive text-earth-olive rounded-full font-medium">Log in</Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-3 bg-earth-olive text-white rounded-full font-medium">Join Oda</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
