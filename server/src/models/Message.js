import mongoose from 'mongoose';
const messageSchema = new mongoose.Schema({
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  body: { type: String, required: true, trim: true, maxlength: 2000 },
  readAt: { type: Date, default: null }
}, { timestamps: true });
export default mongoose.model('Message', messageSchema);
