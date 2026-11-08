import mongoose from 'mongoose';
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, maxlength: 4000 },
  category: { type: String, required: true, trim: true },
  tags: [{ type: String, trim: true, lowercase: true }],
  budget: { type: Number, required: true, min: 0 },
  deadline: { type: Date },
  status: { type: String, enum: ['open', 'in_progress', 'completed', 'cancelled'], default: 'open' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });
jobSchema.index({ title: 'text', description: 'text', tags: 'text', category: 'text' });
jobSchema.index({ status: 1, category: 1, createdAt: -1 });
export default mongoose.model('Job', jobSchema);
