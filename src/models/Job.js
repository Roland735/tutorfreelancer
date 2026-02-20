import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a job title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a job description'],
    minlength: 50,
  },
  subject: {
    type: String,
    required: true,
    index: true,
  },
  category: {
    type: String,
    required: true,
  },
  academicLevel: {
    type: String,
    enum: ['High School', 'Undergraduate', 'Graduate', 'PhD'],
    default: 'Undergraduate',
  },
  budget: {
    type: {
      type: String,
      enum: ['Hourly', 'Fixed'],
      required: true,
    },
    min: { type: Number, required: true },
    max: { type: Number },
  },
  sessionType: {
    type: String,
    enum: ['Online', 'In-Person', 'Both'],
    default: 'Online',
  },
  duration: {
    type: String, // e.g., "2 hours", "Weekly for 1 month"
    required: true,
  },
  urgency: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Immediate'],
    default: 'Medium',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  applicants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    coverLetter: String,
    bidAmount: Number,
    appliedAt: { type: Date, default: Date.now },
  }],
  status: {
    type: String,
    enum: ['Open', 'In-Progress', 'Completed', 'Cancelled'],
    default: 'Open',
    index: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  deadline: {
    type: Date,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Job || mongoose.model('Job', JobSchema);
