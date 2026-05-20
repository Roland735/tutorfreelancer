import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true,
    unique: true,
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000,
  },
  tags: [{
    type: String, // e.g., "Patient", "Punctual", "Expert"
  }],
  helpfulVotes: {
    type: Number,
    default: 0,
  },
  moderationStatus: {
    type: String,
    enum: ['approved', 'flagged', 'hidden'],
    default: 'approved',
    index: true,
  },
  moderationReason: {
    type: String,
    default: '',
    trim: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
