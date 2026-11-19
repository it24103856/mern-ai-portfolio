import Profile from '../models/Profile.js';

// @desc    Get portfolio profile
// @route   GET /api/profile
// @access  Public
export const getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne();
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update portfolio profile
// @route   PUT /api/profile
// @access  Private (Admin)
export const upsertProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();

    if (profile) {
      profile = await Profile.findByIdAndUpdate(profile._id, req.body, {
        new: true,
        runValidators: true,
      });
    } else {
      profile = await Profile.create(req.body);
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};