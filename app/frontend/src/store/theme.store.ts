import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeState = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

// We use zustand/middleware/persist to save the user's theme choice in localStorage.
// This way, their preference is remembered when they revisit the app.
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark', // Default theme
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
    }),
    {
      name: 'chat-app-theme-storage', // Name for the localStorage key
    }
  )
);
