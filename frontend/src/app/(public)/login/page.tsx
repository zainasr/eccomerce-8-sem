'use client';



import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "sonner"
import { useAuthStore } from '@/store/auth.store';
import { API_URL, ROUTES } from '@/lib/constants';
import { AuthResponse } from '@/types';
import { Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result: AuthResponse = await response.json();
        setUser(result.data.user, result.data.profile);

        toast("Welcome back!", {
          description: "You have successfully logged in",
        });
        router.push(result.data.user.role === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.DASHBOARD);
      } else {
        const error = await response.json();
        toast("Login Failed", {
          description: error.message || 'Invalid credentials',
        });
      }
    } catch (error) {
      toast.error("Error Occurred", {
        description: error.message || 'Something went wrong',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-md mx-auto">
        <Card className="shadow-xl border-border/50">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription className="text-base">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('identifier')}
                  className="h-11"
                />
                {errors.identifier && (
                  <p className="text-sm text-red-600 mt-1">{errors.identifier.message}</p>
                )}
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register('password')}
                  autoComplete="current-password"
                  className="pr-12 h-11"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-10 p-1 text-slate-500 hover:text-primary focus:outline-none transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full h-11 shadow-md hover:shadow-lg transition-shadow" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border/50 text-center text-sm space-y-3">
              <p className="text-muted-foreground">
                <Link href="/forgot-password" className="text-primary hover:underline">
                  Forgot password?
                </Link>
              </p>
              <p className="text-muted-foreground">
                Didn&apos;t receive the verification email?{' '}
                <Link href="/resend-verification" className="text-primary hover:underline">
                  Resend verification
                </Link>
              </p>
              <p className="text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href={ROUTES.REGISTER} className="text-primary hover:underline">
                  Register
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}