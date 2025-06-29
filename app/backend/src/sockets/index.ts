import { Server, Socket } from 'socket.io';
import Message from '../models/message.model';
import Chatroom from '../models/chatroom.model';
import { IUser } from '../models/user.model';
import logger from '../utils/logger';

export const initializeSocketIO = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        logger.info(`🔌 New client connected: ${socket.id}`);

        socket.on('setup', (userData: IUser) => {
            if (!userData || !userData._id) {
                logger.error('Invalid user data for setup from socket:', socket.id);
                return;
            }
            socket.join(userData._id.toString());
            logger.info(`User ${userData._id} has set up their personal room.`);
        });

        socket.on('join chat', (roomId: string) => {
            socket.join(roomId);
            logger.info(`User ${socket.id} joined room: ${roomId}`);
        });

        // --- UPDATED TYPING HANDLER ---
        socket.on('typing', ({ roomId, senderId }) => {
            if (!roomId || !senderId) return;
            // Broadcast to everyone in the room except the sender
            socket.to(roomId).emit('typing', roomId);
        });

        // --- UPDATED STOP TYPING HANDLER ---
        socket.on('stop typing', ({ roomId, senderId }) => {
            if (!roomId || !senderId) return;
             // Broadcast to everyone in the room except the sender
            socket.to(roomId).emit('stop typing', roomId);
        });
        
        socket.on('new message', async (newMessageReceived) => {
            const { senderId, content, chatroom: chatroomId } = newMessageReceived;

            if (!senderId || !content || !chatroomId) {
                logger.warn('Validation FAILED: Received incomplete message data.', { data: newMessageReceived });
                return;
            }

            try {
                const message = await Message.create({
                    sender: senderId,
                    content: content,
                    chatroom: chatroomId,
                });
                
                const populatedMessage = await Message.findById(message._id)
                    .populate('sender', 'username email _id')
                    .populate({
                        path: 'chatroom',
                        populate: {
                            path: 'participants',
                            select: 'username email _id'
                        }
                    });

                if (!populatedMessage) {
                    logger.error(`CRITICAL ERROR: Populating message returned null for message ID: ${message._id}`);
                    return;
                }

                await Chatroom.findByIdAndUpdate(chatroomId, { lastMessage: populatedMessage._id });

                const chat = populatedMessage.chatroom as any;
                
                chat.participants.forEach((participant: IUser) => {
                    if (participant._id.toString() !== senderId.toString()) {
                        io.to(participant._id.toString()).emit('message received', populatedMessage);
                    }
                });

            } catch (error) {
                logger.error("Error in 'new message' handler:", { error, data: newMessageReceived });
            }
        });

        socket.on('disconnect', () => {
            logger.info(`👋 Client disconnected: ${socket.id}`);
        });
    });
};