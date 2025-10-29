'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { API_URL, ROUTES } from '@/lib/constants';
import { AuthResponse } from '@/types';

export function useAuth(requireAuth = false, allowedRoles?: string[]) {
  const router = useRouter();
  const [isIntialized,setIsIntialized] = useState(false);

  const { user, profile, isLoading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    async function checkAuth() {

      try {
        const response = await fetch(`${API_URL}/auth/profile`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data: AuthResponse = await response.json();
          setUser(data.data.user, data.data.profile)
          if (allowedRoles && !allowedRoles.includes(data.data.user.role)) {
            router.push(ROUTES.HOME);
          }
        } else {
          setUser(null, null);
          if (requireAuth) {
            router.push(ROUTES.LOGIN);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null, null);
        if (requireAuth) {
          router.push(ROUTES.LOGIN);
        }
      }
    }
    if(!isIntialized){
      checkAuth();
      setIsIntialized(true);
    }
    
  }, [requireAuth, allowedRoles, router, setUser, setLoading,isIntialized]);

  return { user, profile, isLoading };
}