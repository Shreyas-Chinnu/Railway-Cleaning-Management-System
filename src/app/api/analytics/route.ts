import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/models/Task";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const dateFilter: any = {};
  if (startDate && endDate) {
    dateFilter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const totalTasks = await Task.countDocuments(dateFilter);
  const pendingTasks = await Task.countDocuments({ ...dateFilter, status: "Pending" });
  const completedTasks = await Task.countDocuments({ ...dateFilter, status: "Completed" });

  const workerPerformance = await Task.aggregate([
    { $match: { ...dateFilter, status: "Completed" } },
    { $group: { _id: "$assignedTo", completedTasks: { $sum: 1 } } },
    { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "worker" } },
    { $unwind: "$worker" },
    { $project: { name: "$worker.name", completedTasks: 1 } },
  ]);

  return NextResponse.json({ totalTasks, pendingTasks, completedTasks, workerPerformance });
}

