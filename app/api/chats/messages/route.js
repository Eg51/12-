import { NextResponse } from 'next/server';
import { getRoomMessages, addMessage } from '@/lib/db/chats';
import { verifyToken, extractToken } from '@/lib/security';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractToken(authHeader);
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!roomId) {
      return NextResponse.json(
        { success: false, error: 'Room ID required' },
        { status: 400 }
      );
    }

    const messages = await getRoomMessages(roomId, limit);
    
    const userId = decoded.id || decoded.userId;
    // Note: We are intentionally NOT marking messages as read here 
    // to keep it simple. The [roomId]/route.js already handles that.

    return NextResponse.json({
      success: true,
      data: messages,
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractToken(authHeader);
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { roomId, message, type = 'text', attachmentUrl } = body;

    if (!roomId || !message) {
      return NextResponse.json(
        { success: false, error: 'Room ID and message are required' },
        { status: 400 }
      );
    }

    const userId = decoded.id || decoded.userId;
    const senderName = decoded.name || 'User';
    const senderRole = decoded.role === 'admin' || decoded.isAdmin ? 'admin' : 'user';

    const newMessage = await addMessage(roomId, {
      senderId: userId,
      senderName,
      senderRole,
      message,
      type,
      attachmentUrl: attachmentUrl || null,
    });

    if (!newMessage) {
      return NextResponse.json(
        { success: false, error: 'Failed to send message' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage,
    });

  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}