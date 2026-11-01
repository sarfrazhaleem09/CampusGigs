import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  bio: { type: String, default: '', maxlength: 500 },
  skills: [{ type: String, trim: true }]
}, { timestamps: true });
export default mongoose.model('User', userSchema);
