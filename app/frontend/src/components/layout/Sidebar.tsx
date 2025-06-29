import { useState } from 'react';
import { LogOut, PlusCircle } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { useChatStore } from '../../store/chat.store';
import { type Chatroom } from '../../types';
import NewChatModal from '../chat/NewChatModal';

interface SidebarProps {
    chats: Chatroom[] | undefined;
    isLoading: boolean;
}

const Sidebar = ({ chats, isLoading }: SidebarProps) => {
    const { user, logout } = useAuthStore();
    const { setSelectedChat, selectedChat } = useChatStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <aside className='w-full md:w-1/3 lg:w-1/4 h-full p-4 flex flex-col
                             bg-white/40 dark:bg-black/20 
                             border-r border-gray-300/50 dark:border-white/10'>
                
                {/* Header */}
                <header className='flex justify-between items-center mb-4'>
                    <div className='flex items-center gap-2'>
                        <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold'>
                            {user?.username?.[0].toUpperCase()}
                        </div>
                        <span className='font-semibold text-gray-800 dark:text-gray-200'>{user?.username}</span>
                    </div>
                    <button onClick={logout} className='p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 transition-colors'>
                        <LogOut size={20} />
                    </button>
                </header>

                {/* Search and New Chat */}
                <div className='flex items-center gap-2 mb-4'>
                    <input type="text" placeholder="Search chats..." className="flex-grow px-3 py-2 rounded-lg bg-white/50 dark:bg-black/20 border-2 border-transparent focus:border-blue-500 focus:outline-none text-gray-800 dark:text-gray-200" />
                    <button onClick={() => setIsModalOpen(true)} className='p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 transition-colors
                        focus:outline-none
                    '>
                        <PlusCircle size={22} />
                    </button>
                </div>

                {/* Chat List */}
                <div className='flex-grow overflow-y-auto -mr-2 pr-2'>
                    {isLoading && <p>Loading...</p>}
                    <ul className='space-y-1'>
                        {chats?.map((chat) => {
                            const otherParticipant = chat.participants.find(p => p._id !== user?._id);
                            const isSelected = selectedChat?._id === chat._id;

                            return (
                                <li key={chat._id} 
                                    onClick={() => setSelectedChat(chat)}
                                    className={`p-3 rounded-lg cursor-pointer transition-colors
                                                ${isSelected 
                                                    ? 'bg-blue-500/80 text-white' 
                                                    : 'hover:bg-black/10 dark:hover:bg-white/10'}`
                                    }>
                                    <p className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                                        {otherParticipant?.username || 'Group Chat'}
                                    </p>
                                    <p className={`text-sm truncate ${isSelected ? 'text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}>
                                        {chat.lastMessage?.content || "No messages yet"}
                                    </p>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </aside>
            <NewChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}

export default Sidebar;
