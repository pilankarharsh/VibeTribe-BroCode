import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireOnboarding?: boolean;
}

export default function AuthWrapper({ 
  children, 
  requireAuth = true, 
  requireOnboarding = true 
}: AuthWrapperProps) {
  const router = useRouter();
  const { user, token, isOnboarded, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && (!token || !user)) {
        // Not logged in but auth required, redirect to login
        router.push('/login');
        return;
      }

      if (requireOnboarding && token && user && !isOnboarded) {
        // Logged in but not onboarded, redirect to onboarding
        router.push('/onboarding');
        return;
      }
    }
  }, [token, user, isOnboarded, isLoading, router, requireAuth, requireOnboarding]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Show content if all checks pass
  if (requireAuth && (!token || !user)) {
    return null; // Will redirect
  }

  if (requireOnboarding && token && user && !isOnboarded) {
    return null; // Will redirect to onboarding
  }

  return <>{children}</>;
}
