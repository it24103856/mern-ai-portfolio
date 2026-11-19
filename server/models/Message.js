import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    senderName: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    senderEmail: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
    },
    subject: {
      type: String,
      default: 'Portfolio Inquiry',
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);