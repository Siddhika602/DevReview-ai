import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import dns from 'dns';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import { dbCheck } from './middleware/dbCheck.js';

// Resolve DNS issues in Node on Windows for Atlas SRV connections
dns.setDefaultResultOrder('ipv4first');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the absolute path of the backend directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connect to MongoDB
await connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // Allow all origins for development, can be configured in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', dbCheck, authRoutes);
console.log('Auth routes loaded');
app.use('/api/reviews', reviewRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'DevReview AI API is running...' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`Server listening on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use by another process.`);
    console.error('Please close other terminal windows running the backend server or terminate the process using that port.\n');
    process.exit(1);
  } else {
    throw err;
  }
});

