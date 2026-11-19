import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const verifyCloudinary = async () => {
  try {
    const res = await cloudinary.api.ping();
    if (res.status === 'ok') {
      console.log('☁️  Cloudinary Connected successfully!');
    }
  } catch (error) {
    console.error('❌ Cloudinary Connection Error:', error.message);
  }
};

export default cloudinary;