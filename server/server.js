import path from 'path';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({ message: 'Marketing & Sales Careers API is running.' });
});

app.use('/api/roles', roleRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/auth', authRoutes);

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

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Server startup failed because MongoDB is unavailable or misconfigured.');
    process.exit(1);
  }
};

startServer();
