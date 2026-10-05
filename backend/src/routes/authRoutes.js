const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth, requireAppUser } = require('../middleware/authMiddleware');

router.get('/me', requireAuth, authController.getCurrentUser);
router.post('/profile', requireAuth, authController.createProfileHandler);
router.patch('/profile/location', requireAuth, requireAppUser, authController.updateLocationHandler);

module.exports = router;
