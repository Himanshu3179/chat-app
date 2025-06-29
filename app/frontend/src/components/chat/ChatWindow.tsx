import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Send, MessageSquareText } from 'lucide-react'; // Import a new icon
import { type FormEvent, useEffect, useRef } from 'react';
import { useChatStore } from '../../store/chat.store';
import apiClient from '../../lib/axios';
import { type Message as MessageType, type User } from '../../types';
import Message from './Message';
import { useSocket } from '../../context/SocketContext';
import { useAuthStore } from '../../store/auth.store';
import TypingIndicator from './TypingIndicator';

const fetchMessages = async (chatId: string): Promise<MessageType[]> => {
  const { data } = await apiClient.get(`/chats/${chatId}/messages`);
  return data;
};

const ChatWindow = () => {
  const { selectedChat, typingStatus } = useChatStore();
  const { socket } = useSocket();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isTyping = selectedChat ? typingStatus[selectedChat._id] : false;

  const { data: messages, isLoading } = useQuery<MessageType[]>({
    queryKey: ['messages', selectedChat?._id],
    queryFn: () => fetchMessages(selectedChat!._id),
    enabled: !!selectedChat,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (socket && selectedChat) {
        socket.emit('join chat', selectedChat._id);
    }
  }, [socket, selectedChat]);


  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const content = e.currentTarget.message.value;
    if (!content.trim() || !socket || !selectedChat || !user) return;

    socket.emit('stop typing', { roomId: selectedChat._id, senderId: user._id });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    const messageData = {
      senderId: user._id,
      content,
      chatroom: selectedChat._id,
    };
    socket.emit('new message', messageData);

    queryClient.setQueryData(['messages', selectedChat._id], (oldData: MessageType[] | undefined) => {
      const optimisticSender: User = {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: new Date().toISOString(),
      };

      const optimisticMessage: MessageType = {
        sender: optimisticSender,
        content: messageData.content,
        chatroom: messageData.chatroom,
        _id: Math.random().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return oldData ? [...oldData, optimisticMessage] : [optimisticMessage];
    });

    e.currentTarget.reset();
  };

  const handleTypingChange = () => {
    if (!socket || !selectedChat || !user) return;
    socket.emit('typing', { roomId: selectedChat._id, senderId: user._id });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop typing', { roomId: selectedChat._id, senderId: user._id });
    }, 2000);
  };

  if (!selectedChat) {
    return (
      <div className='flex-grow h-full flex items-center justify-center'>
        <div className='text-center text-gray-700 dark:text-gray-300'>
          <h1 className='text-2xl font-semibold'>Select a chat to start messaging</h1>
        </div>
      </div>
    );
  }

  const otherParticipant = selectedChat.participants.find((p) => p._id !== user?._id);

  return (
    <main className='flex-grow h-full flex flex-col'>
      <header className='p-4 border-b border-gray-300/50 dark:border-white/10'>
        <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-200'>{otherParticipant?.username || 'Chat'}</h2>
      </header>

      {/* --- THIS IS THE FIX --- */}
      <div className='flex-grow p-4 overflow-y-auto flex flex-col'>
        {isLoading && <p className='text-center text-gray-400'>Loading messages...</p>}
        
        {!isLoading && messages?.length === 0 && (
            <div className="flex-grow flex flex-col items-center justify-center gap-2 text-center">
                <MessageSquareText size={48} className="text-gray-400 dark:text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No messages yet</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Be the first to say something!</p>
            </div>
        )}
        
        {messages?.map((msg) => (
          <Message key={msg._id} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={messageEndRef} />
      </div>

      <footer className='p-4'>
        <form onSubmit={handleSendMessage} className='flex items-center gap-2'>
          <input
            name='message'
            type='text'
            placeholder='Type a message...'
            className='flex-grow px-4 py-2 rounded-full bg-white/50 dark:bg-black/20 border-2 border-transparent focus:border-blue-500 focus:outline-none text-gray-800 dark:text-gray-200'
            autoComplete='off'
            onChange={handleTypingChange}
          />
          <button type='submit' className='p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors'>
            <Send size={20} />
          </button>
        </form>
      </footer>
    </main>
  );
};

export default ChatWindow;