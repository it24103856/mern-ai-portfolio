import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    headline: {
      type: String,
      required: true, // උදා: "Full-Stack Developer & AI Engineer"
    },
    bio: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: 'Sri Lanka',
    },
    email: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    availability: {
      type: Boolean,
      default: true, // "Open to work / freelance" badge එකට
    },
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      website: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Profile', profileSchema);