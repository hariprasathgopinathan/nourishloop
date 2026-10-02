const { createDonation, getAvailableDonations } = require('../services/donationService');

/**
 * POST /api/donations
 * Creates a new donation.
 */
const createDonationHandler = async (req, res, next) => {
  try {
    const donation = await createDonation(req.body);

    res.status(201).json({
      success: true,
      message: 'Donation created successfully',
      data: donation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/donations
 * Returns all available donations.
 */
const getDonationsHandler = async (req, res, next) => {
  try {
    const donations = await getAvailableDonations();

    res.status(200).json({
      success: true,
      data: donations,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createDonationHandler, getDonationsHandler };
