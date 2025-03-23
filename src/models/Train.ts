import mongoose from 'mongoose';

const TrainSchema = new mongoose.Schema({
  trainNumber: { type: String, required: true },
  trainName: { type: String, required: true },
  assignedWorkerEmail: { type: String, required: true }, // ✅ Ensure this field exists
});

const Train = mongoose.models.Train || mongoose.model('Train', TrainSchema);

export default Train;
