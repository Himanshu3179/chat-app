import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { socket } from '../lib/socket';
import { useAuthStore } from '../store/auth.store';

interface SocketContextType {
  socket: typeof socket | null;
  isConnected: boolean; // Add connection status state
}

// Update the default context value
const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false });

// Custom hook remains the same
export const useSocket = () => {
  return useContext(SocketContext);
};

// The provider component with updated logic
export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const { user } = useAuthStore();

  useEffect(() => {
    // These functions will be called by the socket's own events
    const onConnect = () => {
      setIsConnected(true);
      console.log(`[SocketProvider] ✅ Socket connected. Emitting 'setup' for user ${user?._id}`);
      // It's crucial to emit setup *after* connection is confirmed
      if (user) {
        socket.emit('setup', user);
      }
    };

    const onDisconnect = () => {
      setIsConnected(false);
      console.log('[SocketProvider] ❌ Socket disconnected.');
    };

    // Attach the event listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    // Manage connection based on auth state
    if (user) {
        if (!socket.connected) {
            socket.connect();
        }
    } else {
        if (socket.connected) {
            socket.disconnect();
        }
    }
    
    // Cleanup function to prevent memory leaks
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [user]); // Rerun this effect only when the user logs in or out

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};