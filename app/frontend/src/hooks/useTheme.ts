import { useEffect } from 'react';
import { useThemeStore } from '../store/theme.store';

export const useTheme = () => {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

  }, [theme]);

  return { theme, toggleTheme };
};
