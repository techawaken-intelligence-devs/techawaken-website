import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface Position {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string; // Full-time, Part-time, Remote, Contract
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  status: 'active' | 'draft' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  positionId: string;
  positionTitle: string;
  fullName: string;
  email: string;
  phone: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  coverNote?: string;
  resumeUrl?: string;
  status: 'new' | 'reviewed' | 'interviewing' | 'rejected' | 'accepted';
  createdAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
}

let pool: Pool | null = null;
const fallbackDataPath = path.join(__dirname, '..', 'data');
const fallbackDataFile = path.join(fallbackDataPath, 'store.json');

// Initial seed jobs
const initialPositions: Position[] = [
  {
    id: 'pos-1',
    title: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    location: 'Rajkot, Gujarat (Hybrid / Remote)',
    type: 'Full-time',
    experience: '3-5 Years',
    salary: 'Competitive / Performance Bonus',
    description: 'Lead engineering for high-performance SaaS platforms and enterprise AI integrations.',
    requirements: [
      'Strong proficiency in Next.js, React, Node.js, and TypeScript',
      'Experience with PostgreSQL, cloud architectures (Aiven, Render, AWS/Azure)',
      'Solid understanding of REST & GraphQL APIs, microservices, and performance optimization'
    ],
    responsibilities: [
      'Architect, develop, and deploy scalable full-stack applications',
      'Collaborate with AI researchers and UI/UX designers to ship end-to-end features',
      'Mentor junior developers and participate in code reviews'
    ],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'pos-2',
    title: 'AI / Machine Learning Engineer',
    department: 'AI Solutions',
    location: 'Remote / Rajkot, Gujarat',
    type: 'Full-time',
    experience: '2-4 Years',
    salary: 'Competitive',
    description: 'Design and deploy production-grade LLM workflows, NLP pipelines, and computer vision models.',
    requirements: [
      'Hands-on experience with Python, PyTorch/TensorFlow, and Hugging Face ecosystem',
      'Familiarity with RAG systems, Vector Databases, and MCP (Model Context Protocol)',
      'Experience building scalable inference APIs'
    ],
    responsibilities: [
      'Develop custom AI models and fine-tune open-source LLMs for enterprise use cases',
      'Build resilient data pipelines and real-time inference endpoints',
      'Evaluate model quality, latency, and token efficiency'
    ],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'pos-3',
    title: 'UI/UX & Product Designer',
    department: 'Design',
    location: 'Rajkot, Gujarat (On-site / Hybrid)',
    type: 'Full-time',
    experience: '2+ Years',
    salary: 'Competitive',
    description: 'Craft world-class interactive experiences, design systems, and user interfaces.',
    requirements: [
      'Mastery of Figma, modern layout systems, typography, and micro-interactions',
      'Understanding of modern web constraints (Tailwind, GSAP animations, responsive design)',
      'Portfolio demonstrating high aesthetic polish and user-first thinking'
    ],
    responsibilities: [
      'Design end-to-end product experiences for our SaaS products',
      'Develop design tokens and component libraries alongside frontend developers',
      'Run user testing sessions and iterate rapidly'
    ],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// In-memory or file-based store fallback
interface LocalStore {
  positions: Position[];
  applications: Application[];
  admins: AdminUser[];
}

function loadLocalStore(): LocalStore {
  if (!fs.existsSync(fallbackDataPath)) {
    fs.mkdirSync(fallbackDataPath, { recursive: true });
  }
  if (!fs.existsSync(fallbackDataFile)) {
    const defaultPasswordHash = bcrypt.hashSync(process.env.ADMIN_DEFAULT_PASSWORD || 'TechAwaken@2026', 10);
    const store: LocalStore = {
      positions: initialPositions,
      applications: [],
      admins: [
        {
          id: 'admin-1',
          username: process.env.ADMIN_DEFAULT_USER || 'admin',
          passwordHash: defaultPasswordHash
        }
      ]
    };
    fs.writeFileSync(fallbackDataFile, JSON.stringify(store, null, 2));
    return store;
  }
  try {
    const raw = fs.readFileSync(fallbackDataFile, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local store, resetting...', err);
    return { positions: initialPositions, applications: [], admins: [] };
  }
}

function saveLocalStore(store: LocalStore) {
  if (!fs.existsSync(fallbackDataPath)) {
    fs.mkdirSync(fallbackDataPath, { recursive: true });
  }
  fs.writeFileSync(fallbackDataFile, JSON.stringify(store, null, 2));
}

export async function initDb(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    console.log('[DB] Connecting to PostgreSQL (Aiven / Cloud)...');
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false }
    });

    try {
      // Test connection
      await pool.query('SELECT NOW()');
      console.log('[DB] PostgreSQL connected successfully.');

      // Create tables if not exist
      await pool.query(`
        CREATE TABLE IF NOT EXISTS admin_users (
          id VARCHAR(64) PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS open_positions (
          id VARCHAR(64) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          department VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL,
          type VARCHAR(100) NOT NULL,
          experience VARCHAR(100) NOT NULL,
          salary VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          requirements JSONB NOT NULL,
          responsibilities JSONB NOT NULL,
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS job_applications (
          id VARCHAR(64) PRIMARY KEY,
          position_id VARCHAR(64) NOT NULL,
          position_title VARCHAR(255) NOT NULL,
          full_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(100) NOT NULL,
          portfolio_url TEXT,
          linkedin_url TEXT,
          cover_note TEXT,
          resume_url TEXT,
          status VARCHAR(50) DEFAULT 'new',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Seed initial admin if empty
      const adminCount = await pool.query('SELECT COUNT(*) FROM admin_users');
      if (parseInt(adminCount.rows[0].count, 10) === 0) {
        const defaultHash = await bcrypt.hash(process.env.ADMIN_DEFAULT_PASSWORD || 'TechAwaken@2026', 10);
        await pool.query(
          'INSERT INTO admin_users (id, username, password_hash) VALUES ($1, $2, $3)',
          ['admin-1', process.env.ADMIN_DEFAULT_USER || 'admin', defaultHash]
        );
        console.log('[DB] Seeded initial admin account.');
      }

      // Seed initial positions if empty
      const posCount = await pool.query('SELECT COUNT(*) FROM open_positions');
      if (parseInt(posCount.rows[0].count, 10) === 0) {
        for (const p of initialPositions) {
          await pool.query(
            `INSERT INTO open_positions (id, title, department, location, type, experience, salary, description, requirements, responsibilities, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [
              p.id,
              p.title,
              p.department,
              p.location,
              p.type,
              p.experience,
              p.salary,
              p.description,
              JSON.stringify(p.requirements),
              JSON.stringify(p.responsibilities),
              p.status
            ]
          );
        }
        console.log('[DB] Seeded initial open positions.');
      }
    } catch (err) {
      console.error('[DB] PostgreSQL init error, falling back to local storage:', err);
      pool = null;
      loadLocalStore();
    }
  } else {
    console.log('[DB] No DATABASE_URL provided. Initialized local embedded store.');
    loadLocalStore();
  }
}

// Queries
export async function getAdminByUsername(username: string): Promise<AdminUser | null> {
  if (pool) {
    const res = await pool.query('SELECT id, username, password_hash as "passwordHash" FROM admin_users WHERE username = $1', [username]);
    return res.rows[0] || null;
  }
  const store = loadLocalStore();
  return store.admins.find((a) => a.username.toLowerCase() === username.toLowerCase()) || null;
}

export async function getAllPositions(includeDrafts = false): Promise<Position[]> {
  if (pool) {
    const sql = includeDrafts
      ? 'SELECT id, title, department, location, type, experience, salary, description, requirements, responsibilities, status, created_at as "createdAt", updated_at as "updatedAt" FROM open_positions ORDER BY created_at DESC'
      : "SELECT id, title, department, location, type, experience, salary, description, requirements, responsibilities, status, created_at as \"createdAt\", updated_at as \"updatedAt\" FROM open_positions WHERE status = 'active' ORDER BY created_at DESC";
    const res = await pool.query(sql);
    return res.rows.map((row) => ({
      ...row,
      requirements: typeof row.requirements === 'string' ? JSON.parse(row.requirements) : row.requirements,
      responsibilities: typeof row.responsibilities === 'string' ? JSON.parse(row.responsibilities) : row.responsibilities
    }));
  }
  const store = loadLocalStore();
  return includeDrafts ? store.positions : store.positions.filter((p) => p.status === 'active');
}

export async function getPositionById(id: string): Promise<Position | null> {
  if (pool) {
    const res = await pool.query(
      'SELECT id, title, department, location, type, experience, salary, description, requirements, responsibilities, status, created_at as "createdAt", updated_at as "updatedAt" FROM open_positions WHERE id = $1',
      [id]
    );
    if (!res.rows[0]) return null;
    const row = res.rows[0];
    return {
      ...row,
      requirements: typeof row.requirements === 'string' ? JSON.parse(row.requirements) : row.requirements,
      responsibilities: typeof row.responsibilities === 'string' ? JSON.parse(row.responsibilities) : row.responsibilities
    };
  }
  const store = loadLocalStore();
  return store.positions.find((p) => p.id === id) || null;
}

export async function createPosition(pos: Omit<Position, 'id' | 'createdAt' | 'updatedAt'>): Promise<Position> {
  const newPos: Position = {
    ...pos,
    id: `pos-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (pool) {
    await pool.query(
      `INSERT INTO open_positions (id, title, department, location, type, experience, salary, description, requirements, responsibilities, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        newPos.id,
        newPos.title,
        newPos.department,
        newPos.location,
        newPos.type,
        newPos.experience,
        newPos.salary,
        newPos.description,
        JSON.stringify(newPos.requirements),
        JSON.stringify(newPos.responsibilities),
        newPos.status,
        newPos.createdAt,
        newPos.updatedAt
      ]
    );
    return newPos;
  }

  const store = loadLocalStore();
  store.positions.unshift(newPos);
  saveLocalStore(store);
  return newPos;
}

export async function updatePosition(id: string, updates: Partial<Position>): Promise<Position | null> {
  if (pool) {
    const existing = await getPositionById(id);
    if (!existing) return null;
    const merged: Position = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await pool.query(
      `UPDATE open_positions SET
        title = $1, department = $2, location = $3, type = $4, experience = $5,
        salary = $6, description = $7, requirements = $8, responsibilities = $9,
        status = $10, updated_at = $11
       WHERE id = $12`,
      [
        merged.title,
        merged.department,
        merged.location,
        merged.type,
        merged.experience,
        merged.salary,
        merged.description,
        JSON.stringify(merged.requirements),
        JSON.stringify(merged.responsibilities),
        merged.status,
        merged.updatedAt,
        id
      ]
    );
    return merged;
  }

  const store = loadLocalStore();
  const index = store.positions.findIndex((p) => p.id === id);
  if (index === -1) return null;
  store.positions[index] = {
    ...store.positions[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  saveLocalStore(store);
  return store.positions[index];
}

export async function deletePosition(id: string): Promise<boolean> {
  if (pool) {
    const res = await pool.query('DELETE FROM open_positions WHERE id = $1', [id]);
    return (res.rowCount || 0) > 0;
  }
  const store = loadLocalStore();
  const initialLength = store.positions.length;
  store.positions = store.positions.filter((p) => p.id !== id);
  if (store.positions.length !== initialLength) {
    saveLocalStore(store);
    return true;
  }
  return false;
}

export async function createApplication(app: Omit<Application, 'id' | 'createdAt' | 'status'>): Promise<Application> {
  const newApp: Application = {
    ...app,
    id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    status: 'new',
    createdAt: new Date().toISOString()
  };

  if (pool) {
    await pool.query(
      `INSERT INTO job_applications (id, position_id, position_title, full_name, email, phone, portfolio_url, linkedin_url, cover_note, resume_url, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        newApp.id,
        newApp.positionId,
        newApp.positionTitle,
        newApp.fullName,
        newApp.email,
        newApp.phone,
        newApp.portfolioUrl || null,
        newApp.linkedinUrl || null,
        newApp.coverNote || null,
        newApp.resumeUrl || null,
        newApp.status,
        newApp.createdAt
      ]
    );
    return newApp;
  }

  const store = loadLocalStore();
  store.applications.unshift(newApp);
  saveLocalStore(store);
  return newApp;
}

export async function getAllApplications(): Promise<Application[]> {
  if (pool) {
    const res = await pool.query(
      'SELECT id, position_id as "positionId", position_title as "positionTitle", full_name as "fullName", email, phone, portfolio_url as "portfolioUrl", linkedin_url as "linkedinUrl", cover_note as "coverNote", resume_url as "resumeUrl", status, created_at as "createdAt" FROM job_applications ORDER BY created_at DESC'
    );
    return res.rows;
  }
  const store = loadLocalStore();
  return store.applications;
}

export async function updateApplicationStatus(id: string, status: Application['status']): Promise<boolean> {
  if (pool) {
    const res = await pool.query('UPDATE job_applications SET status = $1 WHERE id = $2', [status, id]);
    return (res.rowCount || 0) > 0;
  }
  const store = loadLocalStore();
  const app = store.applications.find((a) => a.id === id);
  if (app) {
    app.status = status;
    saveLocalStore(store);
    return true;
  }
  return false;
}
