const express = require('express');
const router = express.Router();
const { createDonationHandler, getDonationsHandler } = require('../controllers/donationController');

// POST /api/donations
router.post('/', createDonationHandler);

// GET /api/donations
router.get('/', getDonationsHandler);

module.exports = router;
