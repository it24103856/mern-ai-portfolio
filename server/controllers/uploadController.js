import cloudinary from '../config/cloudinary.js';

// @desc    Upload image or PDF to Cloudinary
// @route   POST /api/upload
// @access  Private (Admin)
export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      return next(new Error('Please select a file to upload'));
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'mern-portfolio',
      resource_type: 'auto', // Images සහ PDFs දෙකටම support කරයි
    });

    res.status(200).json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    next(error);
  }
};