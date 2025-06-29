import { motion } from 'framer-motion';

const TypingIndicator = () => {
  return (
    <motion.div
      className="flex items-start"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white/50 dark:bg-black/20 rounded-bl-none">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400"
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default TypingIndicator;