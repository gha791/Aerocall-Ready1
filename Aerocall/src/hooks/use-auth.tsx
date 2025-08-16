
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import AppLayout from '@/app/app-layout';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ['/login', '/signup', '/forgot-password'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logOut = async () => {
    await auth.signOut();
    // Use fetch with the full URL for server-side calls from the client
    await fetch('/api/auth/session', { method: 'DELETE' });
    router.push('/login');
  };
  
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user && !isPublicRoute) {
    // This is handled by middleware, but as a client-side fallback, we can show a loader
    // while the middleware redirects.
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  // If it's a public route, just render the children without the main app layout.
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // If we are here, it's a protected route and the user is logged in.
  // So we can wrap the children with the main application layout.
  return (
    <AuthContext.Provider value={{ user, loading, logOut }}>
        <AppLayout>{children}</AppLayout>
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider on a protected route.');
  }
  return context;
};
