import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Frontend', 'Backend', 'Database', 'AI & Data', 'DevOps & Tools'],
      required: true,
    },
    iconUrl: {
      type: String,
      default: '',
    },
    proficiency: {
      type: Number,
      min: 1,
      max: 100,
      default: 85,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Skill', skillSchema);