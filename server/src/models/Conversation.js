import mongoose from 'mongoose';
const conversationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  lastMessage: { type: String, default: '' },
  lastMessageAt: { type: Date, default: Date.now }
}, { timestamps: true });
conversationSchema.index({ participants: 1, lastMessageAt: -1 });
conversationSchema.index({ job: 1, participants: 1 });
export default mongoose.model('Conversation', conversationSchema);
