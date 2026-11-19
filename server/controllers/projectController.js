import Project from '../models/Project.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Get all projects (supports ?category= and ?featured= filters)
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }
    if (req.query.featured === 'true') {
      filter.featured = true;
    }

    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private (Admin)
export const createProject = async (req, res, next) => {
  try {
    const slug = req.body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const project = await Project.create({ ...req.body, slug });
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (Admin)
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      res.status(404);
      return next(new Error('Project not found'));
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a project & clean up Cloudinary images
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      return next(new Error('Project not found'));
    }

    // Cloudinary වලින් project images මකා දැමීම
    if (project.images && project.images.length > 0) {
      for (const img of project.images) {
        if (img.publicId) {
          await cloudinary.uploader.destroy(img.publicId);
        }
      }
    }

    await project.deleteOne();
    res.status(200).json({ success: true, message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
};