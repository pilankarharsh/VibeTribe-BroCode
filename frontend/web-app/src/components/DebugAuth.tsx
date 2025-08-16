"use client";

import { useAuthStore } from '@/stores/authStore';

export default function DebugAuth() {
  const { user, token, isOnboarded, isLoading } = useAuthStore();

  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: 10, 
      right: 10, 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: 10, 
      borderRadius: 5,
      fontSize: 12,
      zIndex: 9999,
      maxWidth: 300
    }}>
      <h4>Auth Debug</h4>
      <p><strong>Token:</strong> {token ? 'Present' : 'None'}</p>
      <p><strong>User ID:</strong> {user?._id || 'None'}</p>
      <p><strong>Username:</strong> {user?.username || 'None'}</p>
      <p><strong>Display Name:</strong> {user?.displayName || 'None'}</p>
      <p><strong>DOB:</strong> {user?.dob || 'None'}</p>
      <p><strong>Gender:</strong> {user?.gender || 'None'}</p>
      <p><strong>Is Onboarded:</strong> {isOnboarded ? 'Yes' : 'No'}</p>
      <p><strong>Is Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
      
      <button 
        onClick={() => console.log('Full user object:', user)}
        style={{ background: 'blue', color: 'white', padding: 5, marginTop: 5 }}
      >
        Log User to Console
      </button>
    </div>
  );
}
