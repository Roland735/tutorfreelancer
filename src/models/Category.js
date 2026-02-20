import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  icon: {
    type: String, // React Icon name or SVG
    required: true,
  },
  themeColor: {
    type: String, // hex code
    default: '#10b981',
  },
  subjects: [{
    type: String,
    trim: true,
  }],
  activeJobs: {
    type: Number,
    default: 0,
  },
  activeTutors: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
