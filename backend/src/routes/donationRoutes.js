const express = require('express');
const router = express.Router();
const { createDonationHandler, getDonationsHandler, getMyDonationsHandler } = require('../controllers/donationController');

// POST /api/donations
router.post('/', createDonationHandler);

// GET /api/donations/mine
router.get('/mine', getMyDonationsHandler);

// GET /api/donations
router.get('/', getDonationsHandler);

module.exports = router;
