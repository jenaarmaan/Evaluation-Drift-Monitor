import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/database';
import driftRoutes from './routes/driftRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to Database
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/drift', driftRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Basic Route
app.get('/', (req, res) => {
  res.send('🔬 Evaluation Drift Monitor Backend Active');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
