const { createDonation, getAvailableDonations, getMyDonations, claimDonation, getMyClaims, markReadyForPickup, markPickedUp, getNearbyDonations } = require('../services/donationService');

/**
 * POST /api/donations
 * Creates a new donation.
 */
const createDonationHandler = async (req, res, next) => {
  try {
    const donationData = { ...req.body, donorId: req.appUser._id };
    const donation = await createDonation(donationData);

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
    const donorId = req.appUser._id;
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
    const ngoId = req.appUser._id;
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
    const ngoId = req.appUser._id;
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
    const donorId = req.appUser._id;
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
    const ngoId = req.appUser._id;
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

/**
 * GET /api/donations/nearby
 * Returns nearby donations for an NGO.
 */
const getNearbyDonationsHandler = async (req, res, next) => {
  try {
    const radiusKm = req.query.radiusKm ? Number(req.query.radiusKm) : 10;
    
    if (isNaN(radiusKm) || radiusKm <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid radiusKm parameter'
      });
    }

    const { latitude, longitude } = req.appUser;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Organization location is not set in your profile'
      });
    }

    const donations = await getNearbyDonations(latitude, longitude, radiusKm);

    res.status(200).json({
      success: true,
      data: donations,
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
  markPickedUpHandler,
  getNearbyDonationsHandler
};
