import { NextResponse } from 'next/server';
import { getDashDataCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request, { params }) {
  try {
    const userRole = request.headers.get('x-user-role');
    if (userRole !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const collection = await getDashDataCollection();
    const body = await request.json();
    
    const updated = await collection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: body }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const userRole = request.headers.get('x-user-role');
    if (userRole !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const collection = await getDashDataCollection();
    await collection.deleteOne({ _id: new ObjectId(params.id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}