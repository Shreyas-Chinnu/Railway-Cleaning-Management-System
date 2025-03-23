import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/models/Task";

export async function GET() {
  await connectDB();
  
  const tasks = await Task.find().populate("assignedTo", "name");

  return NextResponse.json(tasks);
}
