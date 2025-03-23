import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'worker'],
    required: true,
  },
  phone: {
    type: String,
  },
  assignedTrains: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Train',
  }],
  tasksCompleted: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'available',
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Add indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
