/**
 * DarshanEase — Express Server Entry Point
 * Loads env, connects MongoDB, mounts routes, starts listening.
 */
require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const morgan   = require('morgan');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/error');

// ── Route imports ─────────────────────────────────────────────
const authRoutes    = require('./routes/auth');
const templeRoutes  = require('./routes/temples');
const slotRoutes    = require('./routes/slots');
const bookingRoutes = require('./routes/bookings');
const adminRoutes   = require('./routes/admin');

// ── Connect to database ───────────────────────────────────────
connectDB();

const app = express();

// ── Global Middleware ─────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// HTTP logger (dev only)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ── Health Check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🛕 DarshanEase API is running',
    timestamp: new Date(),
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('🛕 DarshanEase API is running');
});

// ── API Routes ────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/temples',  templeRoutes);
app.use('/api/slots',    slotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin',    adminRoutes);

// ── 404 + Error Handlers ──────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 DarshanEase API Server`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`📦 Env: ${process.env.NODE_ENV}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});