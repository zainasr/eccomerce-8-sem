'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {toast } from 'sonner';
import { API_URL, ROUTES } from '@/lib/constants';
import { Mail } from 'lucide-react';

const resendSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ResendForm = z.infer<typeof resendSchema>;

export default function ResendVerificationPage() {
 
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendForm>({
    resolver: zodResolver(resendSchema),
  });

  const onSubmit = async (data: ResendForm) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setEmailSent(true);
        toast("Email sent",{
          
          description: 'Verification email has been sent',
        });
      } else {
        const error = await response.json();
        toast("Failed",{
          
          description: error.message || 'Could not send verification email',
         
        });
      }
    } catch (error) {
      toast("Error",{
        description: error.message ||'Something went wrong',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="text-center py-12">
              <Mail className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
              <p className="text-muted-foreground mb-6">
                We&apps;ve sent a new verification link to your email address.
              </p>
              <Link href={ROUTES.LOGIN}>
                <Button>Go to Login</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Resend Verification Email</CardTitle>
            <CardDescription>
              Enter your email address and we&apps;ll send you a new verification link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Resend Verification Email'}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <Link href={ROUTES.LOGIN} className="text-primary hover:underline">
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}