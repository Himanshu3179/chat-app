import mongoose, { Schema, model, Document } from 'mongoose';
import { IUser } from './user.model';
import { IMessage } from './message.model';

// Interface for the Chatroom document
export interface IChatroom extends Document {
  name: string;
  isGroupChat: boolean;
  participants: (mongoose.Types.ObjectId | IUser)[];
  lastMessage?: mongoose.Types.ObjectId | IMessage;
  createdAt: Date;
  updatedAt: Date;
}

const chatroomSchema = new Schema<IChatroom>({
  name: {
    type: String,
    trim: true,
  },
  isGroupChat: {
    type: Boolean,
    default: false,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Creates a reference to the User model
    required: true,
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message', // Reference to the last message sent in this room
  },
}, {
  timestamps: true
});

const Chatroom = model<IChatroom>('Chatroom', chatroomSchema);
export default Chatroom;
