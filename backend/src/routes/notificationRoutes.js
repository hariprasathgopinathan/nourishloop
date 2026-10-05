const express = require('express');
const { requireAuth, requireAppUser } = require('../middleware/authMiddleware');
const {
  getNotificationsHandler,
  markReadHandler,
  markAllReadHandler
} = require('../controllers/notificationController');

const router = express.Router();

router.use(requireAuth, requireAppUser);

router.get('/', getNotificationsHandler);
router.patch('/read-all', markAllReadHandler);
router.patch('/:notificationId/read', markReadHandler);

module.exports = router;
