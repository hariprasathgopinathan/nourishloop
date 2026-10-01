const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const healthRoutes = require('./routes/healthRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', healthRoutes);

// Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;
