import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    index: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    select: false,
  },
  role: {
    type: String,
    enum: ['student', 'tutor', 'both', 'admin'],
    default: 'student',
    index: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  university: {
    type: String,
    default: '',
    index: true,
  },
  major: {
    type: String,
    default: '',
  },
  yearOfStudy: {
    type: String,
    enum: ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Masters', 'PhD', 'Alumni', ''],
    default: '',
  },
  bio: {
    type: String,
    default: '',
    maxlength: 1000,
  },
  location: {
    city: String,
    country: String,
    timezone: String,
  },
  languages: [{
    type: String,
    trim: true,
  }],
  isVerified: {
    type: Boolean,
    default: false,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String,
    website: String,
  },
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
  }],
  savedTutors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  tutorProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TutorProfile',
  }
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
