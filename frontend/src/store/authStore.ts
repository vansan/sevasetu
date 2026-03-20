import { create } from 'zustand';
import api from '@/lib/api';
import { User, AuthResponse } from '@/types';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (data: any) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isInitialized: false,

  login: async (data) => {
    set({ isLoading: true });
    try {
      const res = await api.post<AuthResponse>('/auth/login', data);
      localStorage.setItem('token', res.data.token);
      set({ user: res.data.user, token: res.data.token, isLoading: false });
      toast.success(res.data.message);
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
      set({ isLoading: false });
      return false;
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      const res = await api.post<AuthResponse>('/auth/register', data);
      localStorage.setItem('token', res.data.token);
      set({ user: res.data.user, token: res.data.token, isLoading: false });
      toast.success(res.data.message);
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
      set({ isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
    toast.success('Logged out successfully');
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isInitialized: true });
      return;
    }

    try {
      const res = await api.get<User>('/auth/me');
      set({ user: res.data, isInitialized: true });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, isInitialized: true });
    }
  },
}));
