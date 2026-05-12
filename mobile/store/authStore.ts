import * as Sentry from '@sentry/react-native';
import { create } from 'zustand';
import type { User } from '@/types';
import * as authService from '@/services/auth.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
  loadAuth(): Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (email, password) => {
    const { user, token } = await authService.login(email, password);
    set({ user, token, isAuthenticated: true });
    Sentry.setUser({ id: user.id, username: user.username });
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, token: null, isAuthenticated: false });
    Sentry.setUser(null);
  },

  loadAuth: async () => {
    const result = await authService.getCurrentUser();
    if (result) {
      set({ user: result.user, token: result.token, isAuthenticated: true });
      Sentry.setUser({ id: result.user.id, username: result.user.username });
    }
  },
}));
