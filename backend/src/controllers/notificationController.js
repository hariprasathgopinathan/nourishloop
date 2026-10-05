const Notification = require('../models/Notification');

/**
 * GET /api/notifications
 * Returns notifications for the current authenticated user.
 */
const getNotificationsHandler = async (req, res, next) => {
  try {
    const userId = req.appUser._id;
    
    const notifications = await Notification.find({ recipientId: userId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/notifications/:notificationId/read
 * Marks a notification as read.
 */
const markReadHandler = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const userId = req.appUser._id;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipientId: userId },
      { $set: { readAt: new Date() } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/notifications/read-all
 * Marks all notifications for the user as read.
 */
const markAllReadHandler = async (req, res, next) => {
  try {
    const userId = req.appUser._id;

    await Notification.updateMany(
      { recipientId: userId, readAt: null },
      { $set: { readAt: new Date() } }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotificationsHandler,
  markReadHandler,
  markAllReadHandler
};
