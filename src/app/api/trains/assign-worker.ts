import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Train from '@/models/Train';
import Worker from '@/models/Worker';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { trainId, workerId } = await request.json();

    // Check if train and worker exist
    const train = await Train.findById(trainId);
    const worker = await Worker.findById(workerId);

    if (!train || !worker) {
      return NextResponse.json({ error: 'Train or Worker not found' }, { status: 404 });
    }

    // Assign worker to train
    train.assignedWorkers.push(worker);
    await train.save();

    return NextResponse.json({ message: 'Worker assigned successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error assigning worker:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
