import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  conversationId: {
    type: String, // could be "user1_user2" sorted
    required: true,
    index: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  attachments: [{
    filename: String,
    url: String,
    type: String,
  }],
  read: {
    type: Boolean,
    default: false,
  },
  moderationStatus: {
    type: String,
    enum: ['clean', 'flagged', 'escalated'],
    default: 'clean',
    index: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
