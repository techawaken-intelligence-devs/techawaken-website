import { Router, Request, Response } from 'express';
import {
  getAllPositions,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition
} from '../db';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// PUBLIC: GET /api/positions
router.get('/', async (req: Request, res: Response) => {
  try {
    const positions = await getAllPositions(false);
    res.json({ success: true, count: positions.length, data: positions });
  } catch (err: any) {
    console.error('Fetch positions error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch open positions' });
  }
});

// PUBLIC: GET /api/positions/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const position = await getPositionById(String(req.params.id));
    if (!position || position.status !== 'active') {
      res.status(404).json({ success: false, error: 'Position not found' });
      return;
    }
    res.json({ success: true, data: position });
  } catch (err: any) {
    console.error('Fetch position error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch position' });
  }
});

// ADMIN: GET /api/admin/positions (all positions including drafts/closed)
export const adminPositionsRouter = Router();

adminPositionsRouter.use(requireAdmin);

adminPositionsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const positions = await getAllPositions(true);
    res.json({ success: true, count: positions.length, data: positions });
  } catch (err: any) {
    console.error('Admin fetch positions error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch positions' });
  }
});

adminPositionsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { title, department, location, type, experience, salary, description, requirements, responsibilities, status } = req.body;
    if (!title || !department || !location) {
      res.status(400).json({ success: false, error: 'Title, department, and location are required' });
      return;
    }

    const newPos = await createPosition({
      title,
      department,
      location,
      type: type || 'Full-time',
      experience: experience || 'Not specified',
      salary: salary || 'Competitive',
      description: description || '',
      requirements: Array.isArray(requirements) ? requirements : (requirements ? [requirements] : []),
      responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities ? [responsibilities] : []),
      status: status || 'active'
    });

    res.status(201).json({ success: true, data: newPos });
  } catch (err: any) {
    console.error('Create position error:', err);
    res.status(500).json({ success: false, error: 'Failed to create position' });
  }
});

adminPositionsRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const updated = await updatePosition(String(req.params.id), req.body);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Position not found' });
      return;
    }
    res.json({ success: true, data: updated });
  } catch (err: any) {
    console.error('Update position error:', err);
    res.status(500).json({ success: false, error: 'Failed to update position' });
  }
});

adminPositionsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await deletePosition(String(req.params.id));
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Position not found' });
      return;
    }
    res.json({ success: true, message: 'Position deleted successfully' });
  } catch (err: any) {
    console.error('Delete position error:', err);
    res.status(500).json({ success: false, error: 'Failed to delete position' });
  }
});

export default router;
