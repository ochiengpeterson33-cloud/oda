import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null; // Typed loosely for MVP
  signOut: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  signOut: async () => {},
  loading: true,
  error: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let subscription: any = null;

    const initAuth = async () => {
      if (!isSupabaseConfigured()) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
        }

        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          if (mounted) setLoading(false);
        }
      } catch (err: any) {
        console.error("Supabase getSession error:", err);
        if (mounted) {
          setError(err.message || "Failed to connect to authentication service.");
          setLoading(false);
        }
      }

      try {
        const { data } = supabase.auth.onAuthStateChange((_event, currentSession) => {
          if (mounted) {
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
          }
          if (currentSession?.user) {
            fetchProfile(currentSession.user.id);
          } else {
            if (mounted) {
              setProfile(null);
              setLoading(false);
            }
          }
        });
        subscription = data.subscription;
      } catch (err) {
        console.error("Supabase onAuthStateChange error:", err);
      }
    };

    initAuth();

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    if (!isSupabaseConfigured()) return;
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error) {
        console.warn("Supabase fetchProfile error (this is common if profiles table is missing or RLS is blocking):", error);
      } else if (data) {
        setProfile(data);
      }
    } catch (err: any) {
      console.error("Supabase fetchProfile network error:", err);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, signOut, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
