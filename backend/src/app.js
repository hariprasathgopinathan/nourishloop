const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const healthRoutes = require('./routes/healthRoutes');
const donationRoutes = require('./routes/donationRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.use('/api', healthRoutes);
app.use('/api/donations', donationRoutes);

// Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;
