import { io, Socket } from "socket.io-client";

// Create a socket instance with autoConnect set to false.
// We will manually connect and disconnect based on user auth state.
export const socket: Socket = io({
  autoConnect: false,
});
