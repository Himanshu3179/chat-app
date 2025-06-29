import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

interface ButtonProps extends ComponentPropsWithoutRef<typeof motion.button> {
    children: ReactNode;
}

const Button = ({ children, ...props }: ButtonProps) => {
    return (
        <motion.button
            className="w-full px-4 py-2 rounded-lg font-semibold text-white
                 bg-slate-800 hover:bg-slate-900
                 dark:bg-slate-700 dark:hover:bg-slate-800
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500
                 transition-colors duration-300 disabled:opacity-50"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;
