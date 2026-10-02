const express = require('express');
const router = express.Router();
const { createDonationHandler } = require('../controllers/donationController');

// POST /api/donations
router.post('/', createDonationHandler);

module.exports = router;
