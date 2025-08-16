
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setIsSubmitted(true);
    } catch (error: any) {
      let friendlyError = "An unexpected error occurred. Please try again.";
      if (error.code === 'auth/user-not-found') {
        // For security, we don't reveal if the user exists. The submitted state will handle the UI.
        setIsSubmitted(true);
        return;
      }
      setError(friendlyError);
      toast({
        variant: "destructive",
        title: "Request Failed",
        description: friendlyError,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="mb-4">
                 <svg xmlns="http://www.w.org/2000/svg" viewBox="0 0 24 24" className="w-12 h-12 mx-auto fill-primary">
                    <path d="M16.5 12.5C16.5 13.3284 15.8284 14 15 14H9C8.17157 14 7.5 13.3284 7.5 12.5V12.5C7.5 11.6716 8.17157 11 9 11H15C15.8284 11 16.5 11.6716 16.5 12.5V12.5Z"></path>
                    <path d="M6 17.5C6 19.433 7.567 21 9.5 21H14.5C16.433 21 18 19.433 18 17.5V13H6V17.5Z"></path>
                    <path d="M18 11V6.5C18 4.567 16.433 3 14.5 3H9.5C7.567 3 6 4.567 6 6.5V11H18Z"></path>
                </svg>
            </div>
          <CardTitle className="font-headline text-3xl">Forgot Password</CardTitle>
          <CardDescription>
            {isSubmitted 
              ? "Check your email for a reset link." 
              : "Enter your email and we'll send you a link to reset your password."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="text-center space-y-4">
                <Mail className="mx-auto h-12 w-12 text-green-500" />
                <p className="text-muted-foreground">
                    If an account with that email exists, a password reset link has been sent. Please check your inbox and spam folder.
                </p>
                <Button asChild variant="outline" className="w-full">
                    <Link href="/login">
                        <ArrowLeft className="mr-2" />
                        Back to Log In
                    </Link>
                </Button>
            </div>
          ) : (
            <form onSubmit={handleResetRequest} className="space-y-4">
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
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : <Mail className="mr-2" />}
                Send Reset Email
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
