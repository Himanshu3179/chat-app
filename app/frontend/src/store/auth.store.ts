import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the shape of your user and authentication state
interface User {
  _id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage', // Key for localStorage
    }
  )
);
