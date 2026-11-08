import { Router } from 'express';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { protect } from '../middleware/auth.js';
const router = Router();
router.use(protect);
router.post('/', async (req, res, next) => {
  try {
    const { jobId, coverLetter } = req.body;
    if (!jobId || !coverLetter?.trim()) return res.status(400).json({ message: 'A gig and a short cover letter are required.' });
    const job = await Job.findById(jobId); if (!job) return res.status(404).json({ message: 'Gig not found.' });
    if (job.status !== 'open') return res.status(400).json({ message: 'This gig is no longer accepting applications.' });
    if (job.owner.equals(req.user._id)) return res.status(400).json({ message: 'You cannot apply to your own gig.' });
    const application = await Application.create({ job: job._id, applicant: req.user._id, coverLetter: coverLetter.trim() });
    res.status(201).json({ application });
  } catch (e) { if (e.code === 11000) return res.status(409).json({ message: 'You have already applied to this gig.' }); next(e); }
});
router.get('/mine', async (req, res, next) => {
  try { const applications = await Application.find({ applicant: req.user._id }).populate({ path: 'job', select: 'title category budget status owner', populate: { path: 'owner', select: 'name' } }).sort({ createdAt: -1 }); res.json({ applications }); } catch (e) { next(e); }
});
router.get('/received', async (req, res, next) => {
  try { const jobs = await Job.find({ owner: req.user._id }).select('_id title'); const applications = await Application.find({ job: { $in: jobs.map(j => j._id) } }).populate('applicant', 'name email skills').populate('job', 'title').sort({ createdAt: -1 }); res.json({ applications }); } catch (e) { next(e); }
});
router.patch('/:id/status', async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate('job'); if (!application) return res.status(404).json({ message: 'Application not found.' });
    if (!application.job.owner.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Only the gig owner can review this application.' });
    const { status } = req.body; if (!['accepted','rejected','pending'].includes(status)) return res.status(400).json({ message: 'Invalid application status.' });
    application.status = status; await application.save();
    if (status === 'accepted') { application.job.assignedTo = application.applicant; application.job.status = 'in_progress'; await application.job.save(); await Application.updateMany({ job: application.job._id, _id: { $ne: application._id }, status: 'pending' }, { status: 'rejected' }); }
    res.json({ application });
  } catch (e) { next(e); }
});
export default router;
