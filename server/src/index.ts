import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './db';
import authRoutes from './routes/auth';
import positionsRoutes, { adminPositionsRouter } from './routes/positions';
import applicationsRoutes, { adminApplicationsRouter } from './routes/applications';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: '*', // Allow frontend from Vercel / custom domains / localhost
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check for Render & uptime monitors
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'TechAwaken Intelligence API & Admin Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', uptime: process.uptime() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/positions', positionsRoutes);
app.use('/api/applications', applicationsRoutes);

// Protected Admin Routes
app.use('/api/admin/positions', adminPositionsRouter);
app.use('/api/admin/applications', adminApplicationsRouter);

// Start server
async function startServer() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`[TechAwaken API] Server running on http://localhost:${PORT}`);
      console.log(`[TechAwaken API] Ready for Render & Vercel integration.`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
