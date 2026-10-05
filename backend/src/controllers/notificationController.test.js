const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const notificationRoutes = require('../routes/notificationRoutes');
const { requireAuth, requireAppUser } = require('../middleware/authMiddleware');

jest.mock('../middleware/authMiddleware');
jest.mock('../models/Notification');
jest.mock('../config/firebaseAdmin');

const app = express();
app.use(express.json());
app.use('/api/notifications', notificationRoutes);

describe('Notification Controller', () => {
  const mockUserId = new mongoose.Types.ObjectId().toString();
  
  beforeEach(() => {
    requireAuth.mockImplementation((req, res, next) => next());
    requireAppUser.mockImplementation((req, res, next) => {
      req.appUser = { _id: mockUserId, role: 'DONOR' };
      next();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET notifications only returns req.appUser notifications', async () => {
    const mockNotifications = [{ _id: '1', title: 'Test' }];
    
    Notification.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockNotifications)
      })
    });

    const res = await request(app).get('/api/notifications');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(mockNotifications);
    
    expect(Notification.find).toHaveBeenCalledWith({ recipientId: mockUserId });
  });

  test('unauthorized notification query blocked', async () => {
    requireAuth.mockImplementation((req, res) => res.status(401).json({ success: false }));
    const res = await request(app).get('/api/notifications');
    expect(res.status).toBe(401);
  });

  test('notification read only works for owner', async () => {
    const notificationId = new mongoose.Types.ObjectId().toString();
    
    Notification.findOneAndUpdate.mockResolvedValue({ _id: notificationId });

    const res = await request(app).patch(`/api/notifications/${notificationId}/read`);

    expect(res.status).toBe(200);
    expect(Notification.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: notificationId, recipientId: mockUserId },
      expect.any(Object),
      expect.any(Object)
    );
  });

  test('read-all only affects owner', async () => {
    Notification.updateMany.mockResolvedValue({});

    const res = await request(app).patch('/api/notifications/read-all');

    expect(res.status).toBe(200);
    expect(Notification.updateMany).toHaveBeenCalledWith(
      { recipientId: mockUserId, readAt: null },
      expect.any(Object)
    );
  });
});
