import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import apiRoutes from './routes/api';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup for local and production deployment
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev/testing
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  }
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Root greeting & status
app.get('/', (req, res) => {
  res.json({
    message: 'Shopora Voice Assistant API is running 🎙️🛒',
    health: '/api/health',
    docs: '/api/products',
  });
});

// Global Error Handler
app.use(errorHandler);

// Optional MongoDB Atlas connection
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (uri && uri.trim() !== '') {
    try {
      await mongoose.connect(uri);
      console.log('📦 Connected to MongoDB Atlas successfully');
    } catch (err) {
      console.warn('⚠️ MongoDB connection failed, continuing with in-memory persistence:', err);
    }
  } else {
    console.log('💾 Running with high-performance in-memory persistence & demo seed store');
  }
};

// Start Server
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Shopora Server running at http://localhost:${PORT}`);
    });
  });
}

export default app;
