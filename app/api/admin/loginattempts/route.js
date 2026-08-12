import { NextResponse } from 'next/server';
import { getLoginAttemptsCollection } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const userRole = request.headers.get('x-user-role');
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const collection = await getLoginAttemptsCollection();
    const data = await collection.find({}).sort({ lastAttempt: -1 }).toArray();

    return NextResponse.json({ data });
  } catch (error) {
    console.error('LoginAttempts Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}