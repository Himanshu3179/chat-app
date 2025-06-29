import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/auth.store';
import { type Message as MessageType } from '../../types';

interface MessageProps {
  message: MessageType;
}

const Message = ({ message }: MessageProps) => {
  const { user } = useAuthStore();
  const isMe = message.sender._id === user?._id;

  return (
    <motion.div
      className={`flex items-end gap-2 my-2 ${isMe ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {!isMe && (
        <div className='w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center font-bold text-sm text-gray-800 dark:text-gray-200'>
          {message.sender.username[0].toUpperCase()}
        </div>
      )}
      <div
        // --- THEME FIX: Replaced blue with a neutral dark gray ---
        className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${
          isMe
            ? 'bg-gray-800 dark:bg-slate-700 text-white rounded-br-none'
            : 'bg-white/50 dark:bg-black/20 text-gray-800 dark:text-gray-200 rounded-bl-none'
        }`}
      >
        <p>{message.content}</p>
      </div>
    </motion.div>
  );
};

export default Message;