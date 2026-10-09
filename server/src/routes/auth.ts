import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { getAdminByUsername } from '../db';
import { generateToken, requireAdmin, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ success: false, error: 'Username and password are required' });
      return;
    }

    const admin = await getAdminByUsername(username);
    if (!admin) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    const token = generateToken({ id: admin.id, username: admin.username });
    res.json({
      success: true,
      token,
      user: { id: admin.id, username: admin.username }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/auth/me (verify token)
router.get('/me', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, user: req.user });
});

export default router;
