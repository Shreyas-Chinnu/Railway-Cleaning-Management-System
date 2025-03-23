import { NextResponse } from 'next/server';
import  connectToDatabase  from '@/lib/db';
import Train from '@/models/Train';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface JWTPayload {
  email: string;
  role: string;
  iat: number;
  exp: number;
}

interface CleaningTask {
  _id: string;
  taskName: string;
  status: 'pending' | 'completed';
  completedAt?: Date;
  completedBy?: string;
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    // Get worker's email from token
    const token = (await cookies()).get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verify(token, JWT_SECRET) as JWTPayload;
    const workerEmail = decoded.email;

    // Get trains assigned to this worker
    const trains = await Train.find({
      'assignedWorkers.email': workerEmail,
      cleaningStatus: { $ne: 'completed' } // Only get pending or in-progress trains
    }).select('trainNumber trainName platform cleaningTasks cleaningStatus')
      .sort({ arrivalTime: 1 });

    return NextResponse.json(trains);
  } catch (error) {
    console.error('Error fetching worker trains:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update cleaning status
export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    
    const token = (await cookies()).get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verify(token, JWT_SECRET) as JWTPayload;
    const workerEmail = decoded.email;

    const { trainId, taskId, status } = await request.json();

    // Verify the train is assigned to this worker
    const train = await Train.findOne({
      _id: trainId,
      'assignedWorkers.email': workerEmail
    });

    if (!train) {
      return NextResponse.json(
        { message: 'Train not found or not assigned to you' },
        { status: 404 }
      );
    }

    // Update the specific task status
    const taskIndex = train.cleaningTasks.findIndex((task: CleaningTask) => task._id.toString() === taskId);
    if (taskIndex === -1) {
      return NextResponse.json(
        { message: 'Task not found' },
        { status: 404 }
      );
    }

    train.cleaningTasks[taskIndex].status = status;
    train.cleaningTasks[taskIndex].completedAt = new Date();
    train.cleaningTasks[taskIndex].completedBy = workerEmail;

    // Update overall cleaning status based on tasks
    const allTasksCompleted = train.cleaningTasks.every((task: CleaningTask) => task.status === 'completed');
    train.cleaningStatus = allTasksCompleted ? 'completed' : 'in-progress';
    
    if (allTasksCompleted) {
      train.cleaningEndTime = new Date();
    }

    await train.save();

    return NextResponse.json({
      message: 'Task updated successfully',
      train: {
        trainNumber: train.trainNumber,
        trainName: train.trainName,
        platform: train.platform,
        cleaningTasks: train.cleaningTasks,
        cleaningStatus: train.cleaningStatus
      }
    });
  } catch (error) {
    console.error('Error updating cleaning status:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 