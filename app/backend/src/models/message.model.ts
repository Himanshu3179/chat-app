import mongoose, { Schema, model, Document } from 'mongoose';
import { IUser } from './user.model';
import { IChatroom } from './chatroom.model';

// Interface for the Message document
export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId | IUser;
  content: string;
  chatroom: mongoose.Types.ObjectId | IChatroom;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Creates a reference to the User model
    required: true,
  },
  content: {
    type: String,
    trim: true,
    required: true,
  },
  chatroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chatroom', // Creates a reference to the Chatroom model
    required: true,
  }
}, {
  timestamps: true
});

const Message = model<IMessage>('Message', messageSchema);
export default Message;
