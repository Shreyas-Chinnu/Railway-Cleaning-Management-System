import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import Train from '@/models/Train';

// Get all workers and their assignments
export async function GET() {
  try {
    await connectToDatabase();
    
    // Get all workers
    const workers = await User.find({ role: 'worker' }).select('name email status currentAssignment');

    // Get current assignments
    const activeTrains = await Train.find({
      cleaningStatus: { $ne: 'completed' }
    }).select('trainNumber trainName assignedWorkers');

    // Map workers with their assignments
    const workersWithAssignments = workers.map(worker => {
      const assignments = activeTrains.filter(train => 
        train.assignedWorkers.some(w => w.email === worker.email)
      ).map(train => ({
        trainNumber: train.trainNumber,
        trainName: train.trainName
      }));

      return {
        _id: worker._id,
        name: worker.name,
        email: worker.email,
        status: worker.status || 'available',
        currentAssignments: assignments
      };
    });

    return NextResponse.json(workersWithAssignments);
  } catch (error) {
    console.error('Error fetching workers:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Assign worker to train
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const { workerId, trainId } = await request.json();

    // Get worker details
    const worker = await User.findById(workerId);
    if (!worker) {
      return NextResponse.json(
        { message: 'Worker not found' },
        { status: 404 }
      );
    }

    // Get train details
    const train = await Train.findById(trainId);
    if (!train) {
      return NextResponse.json(
        { message: 'Train not found' },
        { status: 404 }
      );
    }

    // Check if worker is already assigned to this train
    if (train.assignedWorkers.some(w => w.email === worker.email)) {
      return NextResponse.json(
        { message: 'Worker already assigned to this train' },
        { status: 400 }
      );
    }

    // Add worker to train
    train.assignedWorkers.push({
      _id: worker._id,
      name: worker.name,
      email: worker.email
    });

    // Update worker status
    worker.status = 'assigned';
    worker.currentAssignment = trainId;

    // Save both documents
    await Promise.all([train.save(), worker.save()]);

    return NextResponse.json({
      message: 'Worker assigned successfully',
      worker: {
        _id: worker._id,
        name: worker.name,
        email: worker.email,
        status: worker.status
      }
    });
  } catch (error) {
    console.error('Error assigning worker:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Remove worker assignment
export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    
    const { workerId, trainId } = await request.json();

    // Get worker and train
    const [worker, train] = await Promise.all([
      User.findById(workerId),
      Train.findById(trainId)
    ]);

    if (!worker || !train) {
      return NextResponse.json(
        { message: 'Worker or train not found' },
        { status: 404 }
      );
    }

    // Remove worker from train
    train.assignedWorkers = train.assignedWorkers.filter(
      w => w.email !== worker.email
    );

    // Update worker status
    worker.status = 'available';
    worker.currentAssignment = null;

    // Save both documents
    await Promise.all([train.save(), worker.save()]);

    return NextResponse.json({
      message: 'Worker assignment removed successfully'
    });
  } catch (error) {
    console.error('Error removing worker assignment:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 