
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Login failed');
      }
    } catch (error: any) {
      setError(error.message);
      console.error('Login failed:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-12 h-12 mx-auto fill-primary">
                    <path d="M16.5 12.5C16.5 13.3284 15.8284 14 15 14H9C8.17157 14 7.5 13.3284 7.5 12.5V12.5C7.5 11.6716 8.17157 11 9 11H15C15.8284 11 16.5 11.6716 16.5 12.5V12.5Z"></path>
                    <path d="M6 17.5C6 19.433 7.567 21 9.5 21H14.5C16.433 21 18 19.433 18 17.5V13H6V17.5Z"></path>
                    <path d="M18 11V6.5C18 4.567 16.433 3 14.5 3H9.5C7.567 3 6 4.567 6 6.5V11H18Z"></path>
                </svg>
            </div>
          <CardTitle className="font-headline text-3xl">AEROCALL</CardTitle>
          <CardDescription>Welcome back! Please log in to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : <LogIn className="mr-2" />}
              Log In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/signup" className="font-semibold text-primary hover:underline">
                    Sign up
                </Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
