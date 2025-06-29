import { Request, Response } from 'express';
import Chatroom from '../models/chatroom.model';
import Message from '../models/message.model';
import User from '../models/user.model';
import mongoose from 'mongoose';

/**
 * @desc    Create or access a one-on-one chat
 * @route   POST /api/chats
 * @access  Protected
 */
export const accessOrCreateChat = async (req: Request, res: Response) => {
    const { userId } = req.body; // The ID of the user to chat with

    if (!userId) {
        return res.status(400).json({ message: 'UserId param not sent with request' });
    }

    // Check if a chat with this user already exists
    let existingChat = await Chatroom.findOne({
        isGroupChat: false,
        $and: [
            { participants: { $elemMatch: { $eq: req.user?._id } } },
            { participants: { $elemMatch: { $eq: userId } } },
        ],
    }).populate('participants', '-password').populate('lastMessage');

    if (existingChat) {
        return res.status(200).json(existingChat);
    } 
    
    // If no chat exists, create a new one
    const chatData = {
        name: 'sender', // Not really used for 1-on-1 chats
        isGroupChat: false,
        participants: [req.user?._id, userId],
    };

    try {
        const createdChat = await Chatroom.create(chatData);
        const fullChat = await Chatroom.findOne({ _id: createdChat._id })
            .populate('participants', '-password');
            
        return res.status(201).json(fullChat);
    } catch (error) {
        console.error("Error creating chat:", error);
        return res.status(500).json({ message: 'Server error while creating chat' });
    }
};

/**
 * @desc    Fetch all chats for a user
 * @route   GET /api/chats
 * @access  Protected
 */
export const fetchUserChats = async (req: Request, res: Response) => {
    try {
        const chats = await Chatroom.find({ participants: { $elemMatch: { $eq: req.user?._id } } })
            .populate('participants', '-password')
            .populate('lastMessage')
            .sort({ updatedAt: -1 }); // Sort by most recently updated

        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


/**
 * @desc    Get all messages for a single chat
 * @route   GET /api/chats/:chatId/messages
 * @access  Protected
 */
export const getChatMessages = async (req: Request, res: Response) => {
    try {
        const messages = await Message.find({ chatroom: req.params.chatId })
            .populate('sender', 'username email') // Populate sender's name and email
            .populate('chatroom'); // Populate chatroom details

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
