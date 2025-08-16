import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export function useAuthGuard() {
  const router = useRouter();
  const { user, token, isOnboarded, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (!token || !user) {
        // Not logged in, redirect to login
        router.push('/login');
      } else if (!isOnboarded) {
        // Logged in but not onboarded, redirect to onboarding
        router.push('/onboarding');
      }
      // If logged in and onboarded, stay on current page
    }
  }, [token, user, isOnboarded, isLoading, router]);

  return {
    isAuthenticated: !!token && !!user,
    isOnboarded,
    isLoading,
    user
  };
}

export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuthGuard();
  return { isAuthenticated, isLoading };
}

export function useRequireOnboarding() {
  const { isAuthenticated, isOnboarded, isLoading } = useAuthGuard();
  return { isAuthenticated, isOnboarded, isLoading };
}
