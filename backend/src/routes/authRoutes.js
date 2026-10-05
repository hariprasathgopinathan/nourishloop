const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth, requireAppUser } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimitMiddleware');

router.get('/me', requireAuth, authController.getCurrentUser);
router.post('/profile', authLimiter, requireAuth, authController.createProfileHandler);
router.patch('/profile/location', authLimiter, requireAuth, requireAppUser, authController.updateLocationHandler);

module.exports = router;
