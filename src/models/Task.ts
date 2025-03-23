import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  assignedTo: mongoose.Schema.Types.ObjectId;
  status: "Pending" | "In Progress" | "Completed";
  createdBy: mongoose.Schema.Types.ObjectId;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Task = mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);
export default Task;
