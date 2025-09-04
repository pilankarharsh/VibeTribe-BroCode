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
  checkOnboardingStatus: () => boolean;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isOnboarded: false,
      isLoading: true, // start with splash

      setAuth: (user, token) => {
        const isOnboarded = user?.displayName && user?.dob && user?.gender ? true : false;
        set({ user, token, isOnboarded });
        setAuthToken(token);
      },

      clearAuth: () => {
        set({ user: null, token: null, isOnboarded: false });
        setAuthToken(null);
      },

      setOnboarded: (value) => set({ isOnboarded: value }),
      setLoading: (value) => set({ isLoading: value }),
      
      checkOnboardingStatus: (): boolean => {
        const state = useAuthStore.getState();
        return state.user?.displayName && state.user?.dob && state.user?.gender ? true : false;
      },
      
      updateUser: (user: User) => {
        const isOnboarded = user?.displayName && user?.dob && user?.gender ? true : false;
        set({ user, isOnboarded });
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setAuthToken(state.token);
        }
        // Recalculate onboarding status after rehydration
        if (state?.user) {
          const isOnboarded = state.user?.displayName && state.user?.dob && state.user?.gender ? true : false;
          useAuthStore.setState({ isOnboarded, isLoading: false });
        } else {
          useAuthStore.setState({ isLoading: false });
        }
      },
    }
  )
);
