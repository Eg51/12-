import { NextResponse } from 'next/server';
import { markMessagesAsRead } from '@/lib/db/chats';
import { verifyToken, extractToken } from '@/lib/security';

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

    const userId = decoded.id || decoded.userId;
    const body = await request.json();
    const { roomId } = body;

    if (!roomId) {
      return NextResponse.json(
        { success: false, error: 'Room ID required' },
        { status: 400 }
      );
    }

    // 🟢 Triggers the 1-minute auto-delete timer on the backend
    await markMessagesAsRead(roomId, userId);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}