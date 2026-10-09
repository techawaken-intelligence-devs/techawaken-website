import { Router, Request, Response } from 'express';
import {
  createApplication,
  getAllApplications,
  updateApplicationStatus,
  getPositionById
} from '../db';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// PUBLIC: POST /api/applications/apply
router.post('/apply', async (req: Request, res: Response) => {
  try {
    const { positionId, fullName, email, phone, portfolioUrl, linkedinUrl, coverNote, resumeUrl } = req.body;
    if (!positionId || !fullName || !email || !phone) {
      res.status(400).json({ success: false, error: 'Full name, email, phone, and positionId are required' });
      return;
    }

    const position = await getPositionById(positionId);
    const positionTitle = position ? position.title : 'General Application';

    const application = await createApplication({
      positionId,
      positionTitle,
      fullName,
      email,
      phone,
      portfolioUrl,
      linkedinUrl,
      coverNote,
      resumeUrl
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Our talent team will review your profile.',
      data: application
    });
  } catch (err: any) {
    console.error('Apply error:', err);
    res.status(500).json({ success: false, error: 'Failed to submit application' });
  }
});

// ADMIN: GET /api/admin/applications
export const adminApplicationsRouter = Router();

adminApplicationsRouter.use(requireAdmin);

adminApplicationsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const applications = await getAllApplications();
    res.json({ success: true, count: applications.length, data: applications });
  } catch (err: any) {
    console.error('Admin fetch applications error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch applications' });
  }
});

adminApplicationsRouter.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!['new', 'reviewed', 'interviewing', 'rejected', 'accepted'].includes(status)) {
      res.status(400).json({ success: false, error: 'Invalid status value' });
      return;
    }

    const success = await updateApplicationStatus(String(req.params.id), status);
    if (!success) {
      res.status(404).json({ success: false, error: 'Application not found' });
      return;
    }

    res.json({ success: true, message: 'Status updated' });
  } catch (err: any) {
    console.error('Update application status error:', err);
    res.status(500).json({ success: false, error: 'Failed to update application status' });
  }
});

export default router;
