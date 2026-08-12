// app/api/chats/messages/route.js
import { NextResponse } from 'next/server';
import { getRoomMessages, markMessagesAsRead } from '@/lib/db/chats';
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
    await markMessagesAsRead(roomId, userId);

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