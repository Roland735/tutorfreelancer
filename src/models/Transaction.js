import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  payer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  platformFee: {
    type: Number,
    required: true,
  },
  netPayout: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending',
    index: true,
  },
  stripeTransactionId: {
    type: String,
    unique: true,
    sparse: true,
  },
  method: {
    type: String,
    enum: ['Credit Card', 'PayPal', 'Stripe'],
    default: 'Stripe',
  },
}, {
  timestamps: true,
});

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
