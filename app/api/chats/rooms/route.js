// app/api/chats/rooms/route.js
import { NextResponse } from 'next/server';
import { getUserChatRooms, getOrCreateChatRoom } from '@/lib/db/chats';
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

    const userId = decoded.id || decoded.userId;
    const rooms = await getUserChatRooms(userId);

    return NextResponse.json({
      success: true,
      data: rooms.map(room => ({
        ...room,
        id: room._id.toString(),
        _id: undefined,
      })),
    });

  } catch (error) {
    console.error('Error fetching chat rooms:', error);
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

    const userId = decoded.id || decoded.userId;
    const body = await request.json();
    const { targetUserId } = body;

    if (!targetUserId) {
      return NextResponse.json(
        { success: false, error: 'Target user ID required' },
        { status: 400 }
      );
    }

    const isAdmin = decoded.role === 'admin' || decoded.isAdmin;
    const adminId = isAdmin ? userId : null;
    const userParticipantId = isAdmin ? targetUserId : userId;

    const room = await getOrCreateChatRoom(userParticipantId, adminId || targetUserId);

    return NextResponse.json({
      success: true,
      data: {
        ...room,
        id: room._id.toString(),
        _id: undefined,
      },
    });

  } catch (error) {
    console.error('Error creating chat room:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}