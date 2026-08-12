// lib/db/chats.js
import { getChatsCollection } from '../mongodb';
import { getUserById } from './users';
import { ObjectId } from 'mongodb';

/**
 * Get or create chat room between admin and user
 * @param {string} userId - User ID
 * @param {string} adminId - Admin ID
 * @returns {Promise<Object>}
 */
export async function getOrCreateChatRoom(userId, adminId) {
  try {
    const chatsCollection = await getChatsCollection();
    
    // Check if room exists
    let room = await chatsCollection.findOne({
      'participants.userId': { $all: [userId, adminId] }
    });
    
    // If no room exists, create one
    if (!room) {
      const user = await getUserById(userId);
      const admin = await getUserById(adminId);
      
      const newRoom = {
        participants: [
          { userId, role: 'user', name: user?.name || 'User' },
          { userId: adminId, role: 'admin', name: admin?.name || 'Admin' }
        ],
        messages: [],
        lastMessage: null,
        unreadCount: {
          [userId]: 0,
          [adminId]: 0
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await chatsCollection.insertOne(newRoom);
      room = { ...newRoom, _id: result.insertedId };
    }
    
    return room;
  } catch (error) {
    console.error('Error getting/creating chat room:', error);
    throw error;
  }
}

/**
 * Add message to chat room
 * @param {string} roomId - Room ID
 * @param {Object} messageData - Message data
 * @returns {Promise<Object|null>}
 */
export async function addMessage(roomId, messageData) {
  try {
    const chatsCollection = await getChatsCollection();
    const newMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      ...messageData,
      timestamp: new Date(),
      read: false
    };
    
    // Get room to update unread counts
    const room = await chatsCollection.findOne({ _id: new ObjectId(roomId) });
    if (!room) return null;
    
    // Update unread count for other participants
    const unreadCount = { ...room.unreadCount };
    const senderId = messageData.senderId;
    
    room.participants.forEach(p => {
      if (p.userId !== senderId) {
        unreadCount[p.userId] = (unreadCount[p.userId] || 0) + 1;
      }
    });
    
    const result = await chatsCollection.updateOne(
      { _id: new ObjectId(roomId) },
      { 
        $push: { messages: newMessage },
        $set: { 
          lastMessage: {
            text: messageData.message,
            timestamp: new Date(),
            senderId: messageData.senderId
          },
          unreadCount: unreadCount,
          updatedAt: new Date()
        }
      }
    );
    
    return result.modifiedCount > 0 ? newMessage : null;
  } catch (error) {
    console.error('Error adding message:', error);
    throw error;
  }
}

/**
 * Get messages for a room
 * @param {string} roomId - Room ID
 * @param {number} limit - Maximum number of messages
 * @returns {Promise<Array>}
 */
export async function getRoomMessages(roomId, limit = 50) {
  try {
    const chatsCollection = await getChatsCollection();
    const room = await chatsCollection.findOne({ _id: new ObjectId(roomId) });
    return room?.messages?.slice(-limit) || [];
  } catch (error) {
    console.error('Error getting room messages:', error);
    return [];
  }
}

/**
 * Mark messages as read for a user
 * @param {string} roomId - Room ID
 * @param {string} userId - User ID
 * @returns {Promise<boolean>}
 */
export async function markMessagesAsRead(roomId, userId) {
  try {
    const chatsCollection = await getChatsCollection();
    
    // Reset unread count for this user
    const result = await chatsCollection.updateOne(
      { _id: new ObjectId(roomId) },
      { 
        $set: { [`unreadCount.${userId}`]: 0 },
        $set: { 
          'messages.$[elem].read': true,
          updatedAt: new Date()
        }
      },
      {
        arrayFilters: [{ 'elem.senderId': { $ne: userId } }]
      }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return false;
  }
}

/**
 * Get all chat rooms for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>}
 */
export async function getUserChatRooms(userId) {
  try {
    const chatsCollection = await getChatsCollection();
    const rooms = await chatsCollection
      .find({ 'participants.userId': userId })
      .sort({ updatedAt: -1 })
      .toArray();
    return rooms;
  } catch (error) {
    console.error('Error getting user chat rooms:', error);
    return [];
  }
}

/**
 * Get unread message count for a user
 * @param {string} userId - User ID
 * @returns {Promise<number>}
 */
export async function getUnreadCount(userId) {
  try {
    const chatsCollection = await getChatsCollection();
    const rooms = await chatsCollection
      .find({ 'participants.userId': userId })
      .toArray();
    
    let totalUnread = 0;
    rooms.forEach(room => {
      totalUnread += room.unreadCount?.[userId] || 0;
    });
    
    return totalUnread;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
}

/**
 * Delete a chat room
 * @param {string} roomId - Room ID
 * @returns {Promise<boolean>}
 */
export async function deleteChatRoom(roomId) {
  try {
    const chatsCollection = await getChatsCollection();
    const result = await chatsCollection.deleteOne({ _id: new ObjectId(roomId) });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting chat room:', error);
    throw error;
  }
}