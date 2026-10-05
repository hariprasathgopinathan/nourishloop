const express = require('express');

jest.mock('../config/firebaseAdmin', () => ({
  getAuth: jest.fn()
}));

const router = require('./donationRoutes');

describe('Donation Routes Regression', () => {
  test('TEST 14 - Route order and existence', () => {
    // router.stack contains the registered routes
    const routes = router.stack.map(layer => ({
      path: layer.route.path,
      method: Object.keys(layer.route.methods)[0].toUpperCase(),
    }));

    // Expected order
    expect(routes).toEqual([
      { path: '/', method: 'POST' },
      { path: '/mine', method: 'GET' },
      { path: '/my-claims', method: 'GET' },
      { path: '/nearby', method: 'GET' }, // Static route before dynamic
      { path: '/', method: 'GET' },
      { path: '/:donationId/claim', method: 'POST' },
      { path: '/:donationId/ready-for-pickup', method: 'PATCH' },
      { path: '/:donationId/picked-up', method: 'PATCH' },
      { path: '/:donationId/route', method: 'GET' },
    ]);
  });
});
