import Skill from '../models/Skill.js';

export const getSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ category: 1, proficiency: -1 });
    res.status(200).json({ success: true, data: skills });
  } catch (error) {
    next(error);
  }
};

export const createSkill = async (req, res, next) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    next(error);
  }
};

export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      res.status(404);
      return next(new Error('Skill not found'));
    }
    res.status(200).json({ success: true, message: 'Skill deleted' });
  } catch (error) {
    next(error);
  }
};