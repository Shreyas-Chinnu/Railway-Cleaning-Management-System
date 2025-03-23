import { initializeSocket } from "@/lib/socket";
import Task from "@/models/Task";
import { connectDB } from "@/lib/db";

export async function sendTaskReminders() {
  await connectDB();
  const io = initializeSocket();

  const pendingTasks = await Task.find({ status: "Pending" }).populate("assignedTo");

  pendingTasks.forEach((task) => {
    io.emit(`notify-${task.assignedTo._id}`, { message: `Reminder: Task "${task.title}" is still pending!` });
  });
}
