const express = require('express');
const router = express.Router();
const { 
  createDonationHandler, 
  getDonationsHandler, 
  getMyDonationsHandler, 
  claimDonationHandler, 
  getMyClaimsHandler,
  markReadyForPickupHandler,
  markPickedUpHandler
} = require('../controllers/donationController');

// POST /api/donations
router.post('/', createDonationHandler);

// GET /api/donations/mine
router.get('/mine', getMyDonationsHandler);

// GET /api/donations/my-claims
router.get('/my-claims', getMyClaimsHandler);

// GET /api/donations
router.get('/', getDonationsHandler);

// POST /api/donations/:donationId/claim
router.post('/:donationId/claim', claimDonationHandler);

// PATCH /api/donations/:donationId/ready-for-pickup
router.patch('/:donationId/ready-for-pickup', markReadyForPickupHandler);

// PATCH /api/donations/:donationId/picked-up
router.patch('/:donationId/picked-up', markPickedUpHandler);

module.exports = router;
