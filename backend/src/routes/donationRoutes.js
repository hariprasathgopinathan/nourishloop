const express = require('express');
const { requireAuth, requireAppUser, requireRole } = require('../middleware/authMiddleware');
const router = express.Router();
const { 
  createDonationHandler, 
  getDonationsHandler, 
  getMyDonationsHandler, 
  claimDonationHandler, 
  getMyClaimsHandler,
  markReadyForPickupHandler,
  markPickedUpHandler,
  getNearbyDonationsHandler,
  getDonationRouteHandler
} = require('../controllers/donationController');

// POST /api/donations
router.post('/', requireAuth, requireAppUser, requireRole('DONOR'), createDonationHandler);

// GET /api/donations/mine
router.get('/mine', requireAuth, requireAppUser, requireRole('DONOR'), getMyDonationsHandler);

// GET /api/donations/my-claims
router.get('/my-claims', requireAuth, requireAppUser, requireRole('NGO'), getMyClaimsHandler);

// GET /api/donations/nearby
router.get('/nearby', requireAuth, requireAppUser, requireRole('NGO'), getNearbyDonationsHandler);

// GET /api/donations
router.get('/', requireAuth, requireAppUser, requireRole('NGO'), getDonationsHandler);

// POST /api/donations/:donationId/claim
router.post('/:donationId/claim', requireAuth, requireAppUser, requireRole('NGO'), claimDonationHandler);

// PATCH /api/donations/:donationId/ready-for-pickup
router.patch('/:donationId/ready-for-pickup', requireAuth, requireAppUser, requireRole('DONOR'), markReadyForPickupHandler);

// PATCH /api/donations/:donationId/picked-up
router.patch('/:donationId/picked-up', requireAuth, requireAppUser, requireRole('NGO'), markPickedUpHandler);

// GET /api/donations/:donationId/route
router.get('/:donationId/route', requireAuth, requireAppUser, requireRole('NGO'), getDonationRouteHandler);

module.exports = router;
