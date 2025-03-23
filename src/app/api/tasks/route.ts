import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import { initializeSocket } from "@/lib/socket";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "supervisor") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const { title, description, assignedTo } = await req.json();
  const newTask = new Task({ title, description, assignedTo, createdBy: session.user.email,status: "Pending" });

  await newTask.save();

  const io = initializeSocket();
  io.emit('notify-${assignedTo}', { message: 'New Task Assigned: ${title'});
  return NextResponse.json({ message: "Task created successfully" }, { status: 201 });
}
