import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '../common/Modal';
import { type User } from '../../types';
import apiClient from '../../lib/axios';
import { useChatStore } from '../../store/chat.store';
import { X } from 'lucide-react';
interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// API function to fetch ALL users
const fetchAllUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get('/users');
  return data;
};

// API function to create a new chat
const createChat = async (userId: string) => {
  const { data } = await apiClient.post('/chats', { userId });
  return data;
}

// Helper to format the date nicely
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
}

const NewChatModal = ({ isOpen, onClose }: NewChatModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { setSelectedChat } = useChatStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Add the event listener only when the modal is open
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    // Cleanup function to remove the listener when the modal closes or component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]); // Rerun the effect if isOpen or onClose changes


  const { data: allUsers, isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchAllUsers,
    enabled: isOpen,
    staleTime: 1000 * 60 * 5,
  });

  const filteredUsers = useMemo(() => {
    if (!allUsers) return [];
    if (!searchTerm.trim()) return allUsers;

    const lowercasedTerm = searchTerm.toLowerCase();
    return allUsers.filter(user =>
      user.username.toLowerCase().includes(lowercasedTerm) ||
      user.email.toLowerCase().includes(lowercasedTerm)
    );
  }, [allUsers, searchTerm]);

  const { mutate: startChat } = useMutation({
    mutationFn: createChat,
    onSuccess: (newChat) => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      setSelectedChat(newChat);
      onClose();
    }
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Start a New Chat">
      <div className="flex flex-col space-y-4">
        {/* --- THIS IS THE FIX --- */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-black/20 
                       border-2 border-transparent 
                       text-gray-800 dark:text-gray-200
                       focus:outline-none pr-10" 
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer p-2  
                hover:bg-white/10 rounded-full
              "
              aria-label="Clear search"
              tabIndex={0}
            >
              <X size={18} />
            </button>
          )}
        </div>
        <hr className="border-t border-gray-200 dark:border-gray-800" />
        <div className="h-64 overflow-y-auto space-y-2 pr-2">
          {isLoading && <p className='text-center text-gray-600 dark:text-gray-400'>Loading users...</p>}

          {filteredUsers.length === 0 && !isLoading && (
            <p className='text-center text-gray-600 dark:text-gray-400'>No users found.</p>
          )}

          {filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => startChat(user._id)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer transition-colors"
            >
              <div className='w-10 h-10 rounded-full bg-blue-400 flex-shrink-0 flex items-center justify-center font-bold text-white'>
                {user.username[0].toUpperCase()}
              </div>
              <div className="flex-grow">
                <p className='font-semibold text-gray-800 dark:text-gray-200'>{user.username}</p>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{user.email}</p>
              </div>
              <div className='text-xs text-gray-500 dark:text-gray-400 text-right'>
                Joined {formatDate(user.createdAt)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default NewChatModal;