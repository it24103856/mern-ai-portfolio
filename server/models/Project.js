import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    shortDescription: {
      type: String,
      required: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Full-Stack', 'AI/ML', 'Mobile', 'Frontend', 'Backend'],
      default: 'Full-Stack',
    },
    techStack: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: '' }, // Cloudinary image delete කරන්න
      },
    ],
    liveUrl: {
      type: String,
      default: '',
    },
    githubUrl: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0, // Projects පෙන්නන පිළිවෙල control කරන්න
    },
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);