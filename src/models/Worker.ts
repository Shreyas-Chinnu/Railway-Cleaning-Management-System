import mongoose from "mongoose";

const WorkerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ["Cleaner", "Inspector", "Supervisor"], required: true },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  tasksCompleted: { type: Number, default: 0 },
});

const Worker = mongoose.models.Worker || mongoose.model("Worker", WorkerSchema);

export default Worker;
