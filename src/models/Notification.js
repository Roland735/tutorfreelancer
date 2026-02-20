import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['New Application', 'Application Accepted', 'New Message', 'Payment Received', 'Review Received', 'System'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
  read: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
