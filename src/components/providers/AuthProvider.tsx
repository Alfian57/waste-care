'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { ensureProfileExists, clearProfileCache } from '@/lib/expService';
import { clearCampaignsCache } from '@/hooks/useCampaigns';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuthContext = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register', '/auth/callback'];
  const isPublicRoute = publicRoutes.some(route => pathname?.startsWith(route));

  useEffect(() => {
    // Get initial session with retry
    const getInitialSession = async () => {
      let retries = 2;
      
      while (retries > 0) {
        try {
          // Add timeout for session retrieval
          const sessionPromise = supabase.auth.getSession();
          const timeoutPromise = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Session timeout')), 5000)
          );
          
          const { data: { session }, error } = await Promise.race([
            sessionPromise,
            timeoutPromise
          ]) as any;
          
          if (error) {
            console.error('[AUTH] Session error:', error);
            throw error;
          }
          
          setUser(session?.user ?? null);
          
          // Ensure profile exists when user is authenticated
          if (session?.user) {
            try {
              await ensureProfileExists(session.user.id);
            } catch (profileError) {
              console.error('[AUTH] Profile creation failed:', profileError);
              // Don't block auth flow if profile creation fails
            }
          }
          
          // Redirect logic after getting session
          if (!session?.user && !isPublicRoute) {
            // Not logged in and trying to access protected route
            router.push('/login');
          } else if (session?.user && (pathname === '/login' || pathname === '/register')) {
            // Logged in and trying to access auth pages
            router.push('/dashboard');
          }
          
          // Success - break retry loop
          break;
        } catch (error) {
          console.error(`[AUTH] Error getting session (${retries} retries left):`, error);
          retries--;
          
          if (retries === 0) {
            // All retries failed
            console.error('[AUTH] Failed to get session after retries');
            setUser(null);
            
            // Redirect to login if not on public route
            if (!isPublicRoute) {
              router.push('/login');
            }
          } else {
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);

        // Ensure profile exists when user signs in
        if (session?.user && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
          await ensureProfileExists(session.user.id);
        }

        // Handle auth state changes
        if (event === 'SIGNED_OUT') {
          // Clear all caches on logout
          clearProfileCache();
          clearCampaignsCache();
          router.push('/login');
        } else if (event === 'SIGNED_IN' && isPublicRoute) {
          router.push('/dashboard');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, isPublicRoute, router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
