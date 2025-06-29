import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { motion } from 'framer-motion';

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className='p-2 rounded-full bg-white/30 dark:bg-black/30 text-gray-800 dark:text-gray-200
                 hover:bg-white/50 dark:hover:bg-black/50 transition-colors
                 absolute top-4 right-4 z-50'
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </motion.button>
  );
};

export default ThemeToggleButton;
