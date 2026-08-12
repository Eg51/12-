import { NextResponse } from 'next/server';
import { getLoginAttemptsCollection } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const userRole = request.headers.get('x-user-role');
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { email } = body;

    const collection = await getLoginAttemptsCollection();
    
    // Reset attempts and remove lock
    await collection.updateOne(
      { email },
      { $set: { attempts: 0, lockedUntil: null } }
    );

    return NextResponse.json({ success: true, message: `User ${email} unlocked.` });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to unlock' }, { status: 500 });
  }
}