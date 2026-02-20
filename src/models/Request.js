import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: [true, 'Please provide a topic'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  budget: {
    type: Number,
    required: [true, 'Please provide a budget'],
  },
  location: {
    type: String,
    required: [true, 'Please provide a meeting place'],
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['open', 'accepted', 'completed', 'cancelled'],
    default: 'open',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Request || mongoose.model('Request', RequestSchema);
