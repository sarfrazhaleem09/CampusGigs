import { Router } from 'express';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import { protect } from '../middleware/auth.js';
const router = Router();
router.get('/', async (req, res, next) => {
  try {
    const { q, category, status = 'open', page = 1, limit = 9 } = req.query;
    const filter = {};
    if (status !== 'all') filter.status = status;
    if (category && category !== 'All categories') filter.category = category;
    if (q?.trim()) filter.$text = { $search: q.trim() };
    const safeLimit = Math.min(24, Math.max(1, Number(limit) || 9));
    const safePage = Math.max(1, Number(page) || 1);
    const [jobs, total] = await Promise.all([
      Job.find(filter).populate('owner', 'name').sort({ createdAt: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit),
      Job.countDocuments(filter)
    ]);
    res.json({ jobs, pagination: { page: safePage, limit: safeLimit, total, pages: Math.ceil(total / safeLimit) } });
  } catch (e) { next(e); }
});
router.get('/mine/posted', protect, async (req, res, next) => {
  try { res.json({ jobs: await Job.find({ owner: req.user._id }).sort({ createdAt: -1 }) }); } catch (e) { next(e); }
});
router.get('/:id', async (req, res, next) => {
  try { const job = await Job.findById(req.params.id).populate('owner', 'name bio skills'); if (!job) return res.status(404).json({ message: 'Gig not found.' }); res.json({ job }); } catch (e) { next(e); }
});
router.post('/', protect, async (req, res, next) => {
  try {
    const { title, description, category, tags = [], budget, deadline } = req.body;
    if (!title?.trim() || !description?.trim() || !category || budget === undefined) return res.status(400).json({ message: 'Title, description, category, and budget are required.' });
    const job = await Job.create({ title: title.trim(), description: description.trim(), category, tags: Array.isArray(tags) ? tags.slice(0, 10) : String(tags).split(',').slice(0, 10), budget: Number(budget), deadline: deadline || undefined, owner: req.user._id });
    res.status(201).json({ job });
  } catch (e) { next(e); }
});
router.patch('/:id', protect, async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id); if (!job) return res.status(404).json({ message: 'Gig not found.' });
    if (!job.owner.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Only the gig owner can edit this listing.' });
    for (const key of ['title','description','category','tags','budget','deadline','status']) if (req.body[key] !== undefined) job[key] = req.body[key];
    await job.save(); res.json({ job });
  } catch (e) { next(e); }
});
router.delete('/:id', protect, async (req, res, next) => {
  try { const job = await Job.findById(req.params.id); if (!job) return res.status(404).json({ message: 'Gig not found.' }); if (!job.owner.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Only the gig owner can delete this listing.' }); await Promise.all([job.deleteOne(), Application.deleteMany({ job: job._id })]); res.json({ message: 'Gig deleted.' }); } catch (e) { next(e); }
});
export default router;
