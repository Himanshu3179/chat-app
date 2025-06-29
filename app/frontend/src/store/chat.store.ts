import { create } from 'zustand';
import { type Chatroom } from '../types';

interface ChatState {
  selectedChat: Chatroom | null;
  typingStatus: Record<string, boolean>; // Maps chatroomId -> true/false
  setSelectedChat: (chat: Chatroom | null) => void;
  setTypingStatus: (chatroomId: string, isTyping: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  selectedChat: null,
  typingStatus: {},
  setSelectedChat: (chat) => set({ selectedChat: chat }),
  setTypingStatus: (chatroomId, isTyping) =>
    set((state) => ({
      typingStatus: {
        ...state.typingStatus,
        [chatroomId]: isTyping,
      },
    })),
}));