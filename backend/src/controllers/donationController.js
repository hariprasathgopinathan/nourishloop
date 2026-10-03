const { createDonation, getAvailableDonations, getMyDonations, claimDonation } = require('../services/donationService');

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

/**
 * GET /api/donations/mine
 * Returns donations and statistics for the current donor.
 */
const getMyDonationsHandler = async (req, res, next) => {
  try {
    const { donorId } = req.query;
    const result = await getMyDonations(donorId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/donations/:donationId/claim
 * Claims a donation for an NGO.
 */
const claimDonationHandler = async (req, res, next) => {
  try {
    const { donationId } = req.params;
    const { ngoId } = req.body;
    
    // Note: ngoId is a temporary development mechanism and will be replaced by
    // an authenticated user ID when Firebase Authentication is implemented.
    const result = await claimDonation(donationId, ngoId);

    res.status(200).json({
      success: true,
      message: 'Donation claimed successfully',
      data: { donation: result },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createDonationHandler, getDonationsHandler, getMyDonationsHandler, claimDonationHandler };
