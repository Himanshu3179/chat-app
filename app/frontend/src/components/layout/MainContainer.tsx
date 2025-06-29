import { motion } from 'framer-motion';

interface MainContainerProps {
  children: React.ReactNode;
}

const MainContainer = ({ children }: MainContainerProps) => {
  return (
    <motion.div
      className="w-[95vw] h-[90vh] max-w-6xl mx-auto my-auto
                 rounded-3xl shadow-2xl
                 bg-gray-100/40 dark:bg-black/20
                 backdrop-blur-xl
                 border border-gray-300/50 dark:border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default MainContainer;
