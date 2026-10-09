const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const healthRoutes = require('./routes/healthRoutes');
const donationRoutes = require('./routes/donationRoutes');
const authRoutes = require('./routes/authRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const { apiLimiter } = require('./middleware/rateLimitMiddleware');

const app = express();

// Set trust proxy if running behind a reverse proxy (e.g. Render)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Middleware
// Helmet configuration
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Need this if serving resources across origins
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      // MapLibre requires worker-src 'self' blob:
      workerSrc: ["'self'", "blob:"],
      // OpenStreetMap tiles
      imgSrc: ["'self'", "data:", "blob:", "https://*.tile.openstreetmap.org", "https://*.project-osrm.org"],
      connectSrc: ["'self'", "https://router.project-osrm.org"],
      scriptSrc: ["'self'"],
    },
  } : false, // Disable CSP in dev to avoid breaking Vite HMR
}));

// CORS Configuration
const getCorsOrigins = () => {
  if (process.env.FRONTEND_ORIGIN) {
    return process.env.FRONTEND_ORIGIN.split(',').map(o => o.trim());
  }
  return ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'];
};

app.use(cors({
  origin: getCorsOrigins(),
  credentials: true
}));

app.use(express.json({ limit: '10mb' })); // Limit request body size
app.use('/api', apiLimiter); // Apply general API rate limit

// Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/notifications', notificationRoutes);

// Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;
