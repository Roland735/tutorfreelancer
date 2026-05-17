import mongoose from 'mongoose';

const TutorProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  subjects: [{
    name: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' }
  }],
  hourlyRate: {
    type: Number,
    required: true,
    min: 5,
  },
  sessionType: {
    type: String,
    enum: ['Online', 'In-Person', 'Both'],
    default: 'Online',
  },
  academicLevel: {
    type: String,
    default: '',
  },
  yearsOfExperience: {
    type: Number,
    default: 0,
    min: 0,
  },
  shortBio: {
    type: String,
    default: '',
    maxlength: 1000,
  },
  verificationStatus: {
    type: String,
    enum: ['not_submitted', 'pending', 'verified'],
    default: 'not_submitted',
  },
  verificationDocumentName: {
    type: String,
    default: '',
  },
  availability: {
    monday: [{ start: String, end: String }],
    tuesday: [{ start: String, end: String }],
    wednesday: [{ start: String, end: String }],
    thursday: [{ start: String, end: String }],
    friday: [{ start: String, end: String }],
    saturday: [{ start: String, end: String }],
    sunday: [{ start: String, end: String }],
  },
  stats: {
    totalSessions: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    completionRate: { type: Number, default: 100 }, // Percentage
    avgResponseTime: { type: Number, default: 60 }, // Minutes
    rating: { type: Number, default: 0, index: true },
    reviewCount: { type: Number, default: 0 },
  },
  education: [{
    institution: String,
    degree: String,
    field: String,
    startDate: Date,
    endDate: Date,
    description: String,
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    url: String,
  }],
  portfolio: [{
    title: String,
    description: String,
    url: String,
    image: String,
  }],
  badges: [{
    type: String,
    enum: ['Top Rated', 'Rising Talent', 'Expert', 'Verified'],
  }],
  isFeatured: {
    type: Boolean,
    default: false,
    index: true,
  }
}, {
  timestamps: true,
});

export default mongoose.models.TutorProfile || mongoose.model('TutorProfile', TutorProfileSchema);
