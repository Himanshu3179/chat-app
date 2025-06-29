import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/axios';
import { type Chatroom, type Message as MessageType, type User } from '../types';
import Sidebar from '../components/layout/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';
import { useSocket } from '../context/SocketContext';
import { useChatStore } from '../store/chat.store';

// We need to adjust the MessageType to expect a populated chatroom object
// as that's what the backend sends now.
interface RealtimeMessage extends Omit<MessageType, 'chatroom'> {
  chatroom: { _id: string; participants: User[] };
}

const fetchUserChats = async (): Promise<Chatroom[]> => {
  const { data } = await apiClient.get('/chats');
  return data;
};

const ChatPage = () => {
  const { data: chats, isLoading, isError } = useQuery<Chatroom[]>({
    queryKey: ['chats'],
    queryFn: fetchUserChats,
    refetchOnWindowFocus: false,
  });

  const queryClient = useQueryClient();
  const { socket, isConnected } = useSocket(); // Get the new isConnected state
  const { setTypingStatus } = useChatStore();

  useEffect(() => {
    // --- THIS IS THE FIX ---
    // Now, we only attach listeners if the socket exists AND is connected.
    if (!socket || !isConnected) return;

    const handleMessageReceived = (newMessage: RealtimeMessage) => {
      const chatroomId = newMessage.chatroom._id;
      queryClient.setQueryData(['messages', chatroomId], (oldData: MessageType[] | undefined) => {
        const finalMessage = { ...newMessage, chatroom: chatroomId };
        return oldData ? [...oldData, finalMessage] : [finalMessage];
      });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    };

    const handleTyping = (chatroomId: string) => {
      setTypingStatus(chatroomId, true);
    };

    const handleStopTyping = (chatroomId: string) => {
      setTypingStatus(chatroomId, false);
    };

    socket.on('message received', handleMessageReceived);
    socket.on('typing', handleTyping);
    socket.on('stop typing', handleStopTyping);

    return () => {
      socket.off('message received', handleMessageReceived);
      socket.off('typing', handleTyping);
      socket.off('stop typing', handleStopTyping);
    };
  }, [socket, isConnected, queryClient, setTypingStatus]); // Add isConnected to dependency array

  if (isError) {
    return <div>Error loading chats. Please try again.</div>;
  }

  return (
    <div className='w-full h-full flex'>
      <Sidebar chats={chats} isLoading={isLoading} />
      <ChatWindow />
    </div>
  );
};

export default ChatPage;