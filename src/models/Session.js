import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled', 'Disputed'],
    default: 'Scheduled',
    index: true,
  },
  type: {
    type: String,
    enum: ['Online', 'In-Person'],
    default: 'Online',
  },
  meetingLink: {
    type: String,
  },
  payment: {
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['Pending', 'Paid', 'Refunded'], default: 'Pending' },
  },
  notes: {
    type: String,
  },
  recordingLink: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Session || mongoose.model('Session', SessionSchema);
