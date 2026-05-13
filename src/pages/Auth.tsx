import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Building2, Mail, Lock, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';

export const AuthUI = ({ isLogin = false }: { isLogin?: boolean }) => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'seller' ? 'seller' : 'buyer';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>(defaultRole as 'buyer' | 'seller');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { session, error: contextError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (session) {
      // Mock routing based on role if actual profile not yet loaded
      // In a real app, this waits for profile
      navigate('/dashboard/buyer');
    }
  }, [session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setError("Please configure Supabase to continue.");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              company_name: companyName,
              role: role,
            }
          }
        });
        if (error) throw error;
        // The trigger will handle adding to profile table, but just in case:
        if (data.user) {
            setError("Success! Please check your email to verify your account.");
        }
      }
    } catch (err: any) {
      console.error("Auth Exception:", err);
      if (err.message && err.message.includes('Failed to fetch')) {
         setError("Network error: Could not connect to Supabase. This could be due to adblockers (like Brave Shields), invalid Supabase URL, or network issues.");
      } else {
         setError(err.message || 'An error occurred during authentication.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!isSupabaseConfigured()) {
       setError("Supabase is not configured.");
       return;
    }
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-earth-beige">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-surface p-8 rounded-2xl shadow-sm border border-earth-sand/30"
      >
        <div className="text-center mb-8">
           <div className="bg-earth-olive text-white p-3 rounded-xl inline-block mb-4 shadow-sm">
             <Building2 size={28} />
           </div>
          <h2 className="text-3xl font-bold text-earth-brown mb-2">
            {isLogin ? 'Welcome back' : 'Join Oda Market'}
          </h2>
          <p className="text-earth-gray-dark">
            {isLogin ? 'Enter your details to access your account' : 'Create an account to start sourcing and selling'}
          </p>
        </div>

        {!isLogin && (
          <div className="flex bg-[#F5F0E6]/50 p-1 rounded-full mb-8">
            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`flex-1 py-2 text-sm font-medium border border-transparent rounded-full transition-all ${
                role === 'buyer' ? 'bg-surface text-earth-brown shadow-sm border-earth-sand/50' : 'text-earth-gray-dark hover:text-earth-brown'
              }`}
            >
              Sign up as Buyer
            </button>
            <button
              type="button"
              onClick={() => setRole('seller')}
              className={`flex-1 py-2 text-sm font-medium border border-transparent rounded-full transition-all ${
                role === 'seller' ? 'bg-surface text-earth-brown shadow-sm border-earth-sand/50' : 'text-earth-gray-dark hover:text-earth-brown'
              }`}
            >
              Sign up as Seller
            </button>
          </div>
        )}

        {contextError && (
          <div className="mb-6 bg-earth-terracotta/10 border border-earth-terracotta/20 text-earth-terracotta text-sm rounded-xl p-4">
            {contextError.includes('Failed to fetch') ? "Network error: Could not connect to Supabase. This could be due to adblockers (like Brave Shields), invalid Supabase URL, or network issues." : contextError}
          </div>
        )}

        {error && (
          <div className={`mb-6 text-sm rounded-xl p-4 border ${error.startsWith('Success!') ? 'bg-green-50/50 border-green-200 text-green-700' : 'bg-earth-terracotta/10 border-earth-terracotta/20 text-earth-terracotta'}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          )}
          
          {!isLogin && (
            <Input
              label="Company Name"
              icon={<Building2 size={18} />}
              placeholder="Acme Corp"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          )}

          <Input
            label="Work Email"
            icon={<Mail size={18} />}
            type="email"
            placeholder="john@acmecorp.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <div>
            <Input
              label="Password"
              icon={<Lock size={18} />}
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {isLogin && (
              <div className="text-right mt-2">
                <a href="#" className="text-sm font-medium text-earth-olive hover:text-earth-olive-dark">
                  Forgot password?
                </a>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg" isLoading={loading}>
            {isLogin ? 'Log in' : 'Create Account'}
          </Button>
          
          <div className="relative py-4">
             <div className="absolute inset-0 flex items-center">
               <div className="w-full border-t border-earth-sand"></div>
             </div>
             <div className="relative flex justify-center text-sm">
               <span className="px-2 bg-surface text-earth-gray-dark">Or continue with</span>
             </div>
          </div>
          
           <Button type="button" variant="outline" className="w-full" size="md" onClick={handleGoogleLogin}>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
          </Button>

        </form>
        
        <div className="mt-8 text-center text-sm text-earth-gray-dark">
          {isLogin ? (
             <p>Don't have an account? <button onClick={() => navigate('/register')} className="font-medium text-earth-olive hover:text-earth-olive-dark">Sign up</button></p>
          ) : (
            <p>Already have an account? <button onClick={() => navigate('/login')} className="font-medium text-earth-olive hover:text-earth-olive-dark">Log in</button></p>
          )}
        </div>
      </motion.div>
    </div>
  );
};
