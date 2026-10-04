const { createDonation, getAvailableDonations, getMyDonations, claimDonation, getMyClaims, markReadyForPickup, markPickedUp } = require('../services/donationService');

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

/**
 * GET /api/donations/my-claims
 * Returns all donations claimed by the current NGO.
 */
const getMyClaimsHandler = async (req, res, next) => {
  try {
    const { ngoId } = req.query;
    
    // Note: ngoId is a temporary development mechanism and will be replaced by
    // an authenticated user ID when Firebase Authentication is implemented.
    const result = await getMyClaims(ngoId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/donations/:donationId/ready-for-pickup
 * Marks a donation as ready for pickup.
 */
const markReadyForPickupHandler = async (req, res, next) => {
  try {
    const { donationId } = req.params;
    const { donorId } = req.body;

    // Note: donorId is a temporary development mechanism and will be replaced by
    // an authenticated user ID when Firebase Authentication is implemented.
    const result = await markReadyForPickup(donationId, donorId);

    res.status(200).json({
      success: true,
      message: 'Donation marked as ready for pickup',
      data: { donation: result },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/donations/:donationId/picked-up
 * Marks a donation as picked up.
 */
const markPickedUpHandler = async (req, res, next) => {
  try {
    const { donationId } = req.params;
    const { ngoId } = req.body;

    // Note: ngoId is a temporary development mechanism and will be replaced by
    // an authenticated user ID when Firebase Authentication is implemented.
    const result = await markPickedUp(donationId, ngoId);

    res.status(200).json({
      success: true,
      message: 'Donation marked as picked up',
      data: { donation: result },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  createDonationHandler, 
  getDonationsHandler, 
  getMyDonationsHandler, 
  claimDonationHandler, 
  getMyClaimsHandler,
  markReadyForPickupHandler,
  markPickedUpHandler
};
