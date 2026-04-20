import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import roleRoutes from './routes/roleRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import authRoutes from './routes/authRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import userRoutes from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsRoot = path.resolve(__dirname, 'uploads');
const resumeUploadsRoot = path.resolve(uploadsRoot, 'resumes');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = Number(process.env.PORT) || 5000;
const configuredOrigins = [
  process.env.CLIENT_URL,
  process.env.VERCEL_FRONTEND_URL,
  process.env.FRONTEND_URL,
  'https://marketing-job-client.vercel.app',
  ...(process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
].map((origin) => origin.replace(/\/+$/, ''));

const vercelPreviewOrigin = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL.replace(/\/+$/, '')}`
  : '';

const allowedOrigins = Array.from(
  new Set(
    [
      ...configuredOrigins,
      vercelPreviewOrigin,
      'http://localhost:5173',
      'http://localhost:5174'
    ].filter(Boolean)
  )
);

app.use(cors({
  origin(origin, callback) {
    const normalizedOrigin = origin ? origin.replace(/\/+$/, '') : '';
    const isVercelOrigin = /\.vercel\.app$/i.test(new URL(normalizedOrigin || 'http://invalid').hostname || '');

    if (!origin || allowedOrigins.includes(normalizedOrigin) || isVercelOrigin) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

if (!fs.existsSync(resumeUploadsRoot)) {
  fs.mkdirSync(resumeUploadsRoot, { recursive: true });
}

app.get('/uploads/resumes/:filename', (req, res) => {
  const safeFilename = path.basename(req.params.filename || '');
  const absolutePath = path.resolve(resumeUploadsRoot, safeFilename);

  res.sendFile(absolutePath, (error) => {
    if (!error) {
      return;
    }

    if (!res.headersSent) {
      res.status(404).json({ message: 'Resume file not found.' });
    }
  });
});

app.use('/uploads', express.static(uploadsRoot));

app.get('/', (_req, res) => {
  res.json({ message: 'Marketing & Sales Careers API is running.' });
});

app.use('/api/roles', roleRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/users', userRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Internal server error.' });
});

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(port);

    server.on('listening', () => {
      console.log(`Server running on port ${port}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.warn(
          `Port ${port} is already in use. Another backend instance is already running, so this dev process will stay idle.`
        );
        return;
      }

      console.error('Server failed to start.', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('Server startup failed because MongoDB is unavailable or misconfigured.');
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is missing. Set it in your Render environment variables.');
    }
    process.exit(1);
  }
};

startServer();
