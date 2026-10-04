const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/me', requireAuth, authController.getCurrentUser);

module.exports = router;
