import { create } from 'zustand';
import { AuthUser } from '../types/types';

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated' | 'unavailable';

interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  setAuthenticated: (user: AuthUser) => void;
  setUnauthenticated: () => void;
  setUnavailable: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  status: 'checking',
  user: null,
  setAuthenticated: (user) => set({ status: 'authenticated', user }),
  setUnauthenticated: () => set({ status: 'unauthenticated', user: null }),
  setUnavailable: () => set({ status: 'unavailable', user: null }),
}));
