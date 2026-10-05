const Notification = require('../models/Notification');
const { getIO } = require('../config/socket');

const sendNotification = async ({ recipientId, type, title, message, donationId }) => {
  try {
    // 1. Persist notification in DB
    const notification = await Notification.create({
      recipientId,
      type,
      title,
      message,
      donationId
    });

    // 2. Emit to socket room
    try {
      const io = getIO();
      const roomName = `user:${recipientId.toString()}`;
      
      const payload = {
        notificationId: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        donationId: notification.donationId,
        createdAt: notification.createdAt
      };

      // Emit new notification
      io.to(roomName).emit('notification:new', payload);
      
      // Emit generic status update for UI refetch
      io.to(roomName).emit('donation:status-updated', { donationId });
      
    } catch (socketError) {
      // Socket emission failure shouldn't crash the business logic
      console.error('Socket emission failed:', socketError.message);
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error.message);
    // Don't throw, we don't want to roll back the business logic
  }
};

module.exports = {
  sendNotification
};
