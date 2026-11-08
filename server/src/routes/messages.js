import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
const router = Router();
router.use(protect);
const isParticipant = (conversation, userId) => conversation.participants.some(id => id.equals(userId));
router.get('/conversations', async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate('job', 'title status').populate('participants', 'name email')
      .sort({ lastMessageAt: -1 });
    res.json({ conversations });
  } catch (e) { next(e); }
});
router.post('/conversations', async (req, res, next) => {
  try {
    const { jobId, recipientId } = req.body;
    if (!jobId || !recipientId) return res.status(400).json({ message: 'A gig and recipient are required.' });
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Gig not found.' });
    const recipientIsOwner = job.owner.equals(recipientId);
    const senderIsOwner = job.owner.equals(req.user._id);
    if (!recipientIsOwner && !senderIsOwner) return res.status(403).json({ message: 'Messages must be connected to a gig owner.' });
    if (recipientId === String(req.user._id)) return res.status(400).json({ message: 'You cannot message yourself.' });
    if (!senderIsOwner) {
      const application = await Application.findOne({ job: job._id, applicant: req.user._id });
      if (!application) return res.status(403).json({ message: 'Apply to this gig before contacting its owner.' });
    } else {
      const application = await Application.findOne({ job: job._id, applicant: recipientId });
      if (!application) return res.status(403).json({ message: 'You can message applicants to your gig only.' });
    }
    const participants = [req.user._id, recipientId].sort((a,b) => String(a).localeCompare(String(b)));
    let conversation = await Conversation.findOne({ job: job._id, participants: { $all: participants, $size: 2 } });
    if (!conversation) conversation = await Conversation.create({ job: job._id, participants });
    conversation = await Conversation.findById(conversation._id).populate('job', 'title status').populate('participants', 'name email');
    res.status(200).json({ conversation });
  } catch (e) { next(e); }
});
router.get('/conversations/:id/messages', async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found.' });
    if (!isParticipant(conversation, req.user._id)) return res.status(403).json({ message: 'You do not have access to this conversation.' });
    const messages = await Message.find({ conversation: conversation._id }).populate('sender', 'name').sort({ createdAt: 1 }).limit(200);
    await Message.updateMany({ conversation: conversation._id, sender: { $ne: req.user._id }, readAt: null }, { readAt: new Date() });
    res.json({ messages, conversation });
  } catch (e) { next(e); }
});
router.post('/conversations/:id/messages', async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found.' });
    if (!isParticipant(conversation, req.user._id)) return res.status(403).json({ message: 'You do not have access to this conversation.' });
    const body = String(req.body.body || '').trim();
    if (!body) return res.status(400).json({ message: 'Message cannot be empty.' });
    if (body.length > 2000) return res.status(400).json({ message: 'Message must be 2,000 characters or fewer.' });
    const message = await Message.create({ conversation: conversation._id, sender: req.user._id, body });
    conversation.lastMessage = body.slice(0, 180); conversation.lastMessageAt = message.createdAt; await conversation.save();
    await message.populate('sender', 'name');
    res.status(201).json({ message });
  } catch (e) { next(e); }
});
export default router;
