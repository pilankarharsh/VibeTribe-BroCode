"use client";

import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

export default function DebugPage() {
  const router = useRouter();
  const { user, token, isOnboarded, isLoading, setLoading, clearAuth } = useAuthStore();

  const handleClearAuth = () => {
    clearAuth();
    router.push('/splash');
  };

  const handleGoHome = () => {
    router.push('/home');
  };

  const handleGoOnboarding = () => {
    router.push('/onboarding');
  };

  const handleSetNotLoading = () => {
    setLoading(false);
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <h1>Debug Auth State</h1>
      
      <div style={{ background: '#f5f5f5', padding: 15, marginBottom: 20, borderRadius: 5 }}>
        <h3>Current State:</h3>
        <p><strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : 'null'}</p>
        <p><strong>User ID:</strong> {user?._id || 'null'}</p>
        <p><strong>Username:</strong> {user?.username || 'null'}</p>
        <p><strong>Email:</strong> {user?.email || 'null'}</p>
        <p><strong>Display Name:</strong> {user?.displayName || 'null'}</p>
        <p><strong>DOB:</strong> {user?.dob || 'null'}</p>
        <p><strong>Gender:</strong> {user?.gender || 'null'}</p>
        <p><strong>Is Onboarded:</strong> {isOnboarded ? 'true' : 'false'}</p>
        <p><strong>Is Loading:</strong> {isLoading ? 'true' : 'false'}</p>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button onClick={handleGoHome} style={{ padding: '8px 16px' }}>
          Go to Home
        </button>
        <button onClick={handleGoOnboarding} style={{ padding: '8px 16px' }}>
          Go to Onboarding
        </button>
        <button onClick={() => router.push('/login')} style={{ padding: '8px 16px' }}>
          Go to Login
        </button>
        <button onClick={() => router.push('/splash')} style={{ padding: '8px 16px' }}>
          Test Splash
        </button>
        <button onClick={handleSetNotLoading} style={{ padding: '8px 16px' }}>
          Set Not Loading
        </button>
        <button onClick={handleClearAuth} style={{ padding: '8px 16px', background: 'red', color: 'white' }}>
          Clear Auth & Restart
        </button>
      </div>

      <div style={{ marginTop: 20, background: '#e8f4f8', padding: 15, borderRadius: 5 }}>
        <h3>Raw User Object:</h3>
        <pre style={{ fontSize: 12, overflow: 'auto' }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  );
}
