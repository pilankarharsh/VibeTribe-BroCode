import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { setAuthToken } from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isOnboarded: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setOnboarded: (value: boolean) => void;
  setLoading: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isOnboarded: false,
      isLoading: true, // start with splash

      setAuth: (user, token) => {
        set({ user, token });
        setAuthToken(token);
      },

      clearAuth: () => {
        set({ user: null, token: null, isOnboarded: false });
        setAuthToken(null);
      },

      setOnboarded: (value) => set({ isOnboarded: value }),
      setLoading: (value) => set({ isLoading: value }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setAuthToken(state.token);
        }
      },
    }
  )
);
