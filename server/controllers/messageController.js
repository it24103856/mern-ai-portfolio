import Message from '../models/Message.js';

// Public: Contact Form Submit
export const sendMessage = async (req, res, next) => {
  try {
    const message = await Message.create(req.body);
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all messages
export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

// Admin: Mark as read / delete
export const toggleReadMessage = async (req, res, next) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) {
      res.status(404);
      return next(new Error('Message not found'));
    }
    msg.isRead = !msg.isRead;
    await msg.save();
    res.status(200).json({ success: true, data: msg });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
};