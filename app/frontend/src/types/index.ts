// Matches the User model on the backend
export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string; // Add the creation date
}

// Matches the Chatroom model on the backend
export interface Chatroom {
  _id: string;
  name: string;
  isGroupChat: boolean;
  participants: User[];
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

// Matches the Message model on the backend
export interface Message {
  _id: string;
  sender: User;
  content: string;
  chatroom: string;
  createdAt: string;
  updatedAt:string;
}