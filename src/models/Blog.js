import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  author: {
    name: { type: String, required: true },
    avatar: { type: String },
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  readTime: {
    type: Number, // in minutes
    default: 5,
  },
  tags: [String],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published',
    index: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
