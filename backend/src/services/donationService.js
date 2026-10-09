const User = require('../models/User');
const Donation = require('../models/Donation');
const { calculateDistanceKm, obscureCoordinate } = require('../utils/geo');
const { getRoute } = require('./locationService');
const { sendNotification } = require('./notificationService');

/**
 * Creates a new donation after validating the donor.
 * @param {Object} donationData - The donation fields from the request body.
 * @returns {Object} The created donation document.
 */
const createDonation = async (donationData) => {
  const {
    donorId,
    foodName,
    category,
    quantity,
    unit,
    description,
    pickupAddress,
    pincode,
    imageUrl,
    latitude,
    longitude,
    availableUntil,
  } = donationData;

  // --- Validate required fields ---
  const missingFields = [];
  if (!donorId) missingFields.push('donorId');
  if (!foodName || !foodName.trim()) missingFields.push('foodName');
  if (!category || !category.trim()) missingFields.push('category');
  if (quantity === undefined || quantity === null) missingFields.push('quantity');
  if (!unit || !unit.trim()) missingFields.push('unit');
  if (!pickupAddress) missingFields.push('pickupAddress');
  if (!availableUntil) missingFields.push('availableUntil');

  if (missingFields.length > 0) {
    const error = new Error(
      `Missing required fields: ${missingFields.join(', ')}`
    );
    error.status = 400;
    throw error;
  }

  // --- Validate Geography ---
  const numLat = Number(latitude);
  const numLng = Number(longitude);

  if (
    !Number.isFinite(numLat) || numLat < -90 || numLat > 90 ||
    !Number.isFinite(numLng) || numLng < -180 || numLng > 180
  ) {
    const error = new Error('Invalid geographic coordinates');
    error.status = 400;
    throw error;
  }

  // --- Validate quantity ---
  const parsedQuantity = Number(quantity);
  if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
    const error = new Error('Quantity must be a positive number');
    error.status = 400;
    throw error;
  }

  // --- Verify donor exists ---
  const donor = await User.findById(donorId);
  if (!donor) {
    const error = new Error('Donor not found');
    error.status = 404;
    throw error;
  }

  // --- Verify donor role ---
  if (donor.role !== 'DONOR') {
    const error = new Error('Only users with the DONOR role can create donations');
    error.status = 403;
    throw error;
  }

  // --- Create donation (status defaults to AVAILABLE via schema) ---
  const donation = await Donation.create({
    donorId,
    foodName,
    category,
    quantity: parsedQuantity,
    unit,
    description,
    pickupAddress,
    pincode,
    imageUrl,
    latitude: numLat,
    longitude: numLng,
    availableUntil,
  });

  return donation;
};

/**
 * Returns all donations with status AVAILABLE and whose availableUntil
 * has not yet passed, sorted by newest first.
 * Excludes donorId from the public response.
 * @returns {Array} Array of available donation documents.
 */
const getAvailableDonations = async () => {
  const donations = await Donation.find({
    status: 'AVAILABLE',
    availableUntil: { $gt: new Date() },
  })
    .populate('donorId', 'name organizationName -_id')
    .sort({ createdAt: -1 })
    .lean();

  return donations.map(donation => {
    const { donorId, ...rest } = donation;
    return {
      ...rest,
      donorName: donorId?.name || null,
      donorOrganizationName: donorId?.organizationName || null,
    };
  });
};

const mongoose = require('mongoose');

/**
 * Returns donations and statistics for a specific donor.
 * @param {string} donorId - The MongoDB ObjectId of the donor.
 * @returns {Object} Object containing stats and array of donations.
 */
const getMyDonations = async (donorId) => {
  if (!donorId) {
    const error = new Error('donorId is required');
    error.status = 400;
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(donorId)) {
    const error = new Error('Invalid donorId format');
    error.status = 400;
    throw error;
  }

  const donor = await User.findById(donorId);
  if (!donor) {
    const error = new Error('Donor not found');
    error.status = 404;
    throw error;
  }

  if (donor.role !== 'DONOR') {
    const error = new Error('User is not a DONOR');
    error.status = 403;
    throw error;
  }

  const donations = await Donation.find({ donorId })
    .select('-donorId')
    .sort({ createdAt: -1 });

  const stats = {
    total: donations.length,
    available: 0,
    claimed: 0,
    pickedUp: 0,
  };

  for (const donation of donations) {
    if (donation.status === 'AVAILABLE') stats.available += 1;
    if (donation.status === 'CLAIMED') stats.claimed += 1;
    if (donation.status === 'PICKED_UP') stats.pickedUp += 1;
  }

  return { stats, donations };
};

/**
 * Claims a donation for an NGO atomicaly.
 * @param {string} donationId - The MongoDB ObjectId of the donation.
 * @param {string} ngoId - The MongoDB ObjectId of the NGO user claiming the donation.
 * @returns {Object} The updated donation document.
 */
const claimDonation = async (donationId, ngoId) => {
  if (!donationId) {
    const error = new Error('donationId is required');
    error.status = 400;
    throw error;
  }
  if (!ngoId) {
    const error = new Error('ngoId is required');
    error.status = 400;
    throw error;
  }
  if (!mongoose.Types.ObjectId.isValid(donationId) || !mongoose.Types.ObjectId.isValid(ngoId)) {
    const error = new Error('Invalid ID format');
    error.status = 400;
    throw error;
  }

  const ngo = await User.findById(ngoId);
  if (!ngo) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }
  if (ngo.role !== 'NGO') {
    const error = new Error('User is not an NGO');
    error.status = 403;
    throw error;
  }

  const now = new Date();

  // Atomic update to ensure no double claims
  const claimedDonation = await Donation.findOneAndUpdate(
    {
      _id: donationId,
      status: 'AVAILABLE',
      availableUntil: { $gt: now },
    },
    {
      $set: {
        status: 'CLAIMED',
        claimedBy: ngoId,
        claimedAt: now,
      },
    },
    { new: true }
  ).select('-donorId');

  if (!claimedDonation) {
    // Identify failure reason
    const existing = await Donation.findById(donationId);
    if (!existing) {
      const error = new Error('Donation not found');
      error.status = 404;
      throw error;
    }
    const error = new Error('Donation is no longer available for claiming');
    error.status = 409;
    throw error;
  }

  // Send notification to donor
  try {
    await sendNotification({
      recipientId: claimedDonation.donorId,
      type: 'DONATION_CLAIMED',
      title: 'Donation Claimed',
      message: 'Your donation has been claimed by an NGO.',
      donationId: claimedDonation._id
    });
  } catch (err) {
    console.error('Notification failed:', err);
  }

  return claimedDonation;
};

/**
 * Returns all donations claimed by a specific NGO.
 * @param {string} ngoId - The MongoDB ObjectId of the NGO.
 * @returns {Array} Array of claimed donation documents.
 */
const getMyClaims = async (ngoId) => {
  if (!ngoId) {
    const error = new Error('ngoId is required');
    error.status = 400;
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(ngoId)) {
    const error = new Error('Invalid ngoId format');
    error.status = 400;
    throw error;
  }

  const ngo = await User.findById(ngoId);
  if (!ngo) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  if (ngo.role !== 'NGO') {
    const error = new Error('User is not an NGO');
    error.status = 403;
    throw error;
  }

  const claims = await Donation.find({ claimedBy: ngoId })
    .populate('donorId', 'name organizationName -_id')
    .sort({ claimedAt: -1 })
    .lean();

  return claims.map(claim => {
    const { donorId, claimedBy, ...rest } = claim;
    return {
      ...rest,
      donorName: donorId?.name || null,
      donorOrganizationName: donorId?.organizationName || null,
    };
  });
};

/**
 * Marks a donation as ready for pickup by the donor.
 * @param {string} donationId - The MongoDB ObjectId of the donation.
 * @param {string} donorId - The MongoDB ObjectId of the donor marking it ready.
 * @returns {Object} The updated donation document.
 */
const markReadyForPickup = async (donationId, donorId) => {
  if (!donationId) {
    const error = new Error('donationId is required');
    error.status = 400;
    throw error;
  }
  if (!donorId) {
    const error = new Error('donorId is required');
    error.status = 400;
    throw error;
  }
  if (!mongoose.Types.ObjectId.isValid(donationId) || !mongoose.Types.ObjectId.isValid(donorId)) {
    const error = new Error('Invalid ID format');
    error.status = 400;
    throw error;
  }

  const donor = await User.findById(donorId);
  if (!donor) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }
  if (donor.role !== 'DONOR') {
    const error = new Error('Only DONOR can mark ready for pickup');
    error.status = 403;
    throw error;
  }

  const updatedDonation = await Donation.findOneAndUpdate(
    {
      _id: donationId,
      donorId: donorId,
      status: 'CLAIMED',
    },
    {
      $set: {
        status: 'READY_FOR_PICKUP',
      },
    },
    { new: true }
  )
    .populate('donorId', 'name organizationName -_id')
    .lean();

  if (!updatedDonation) {
    const existing = await Donation.findById(donationId);
    if (!existing) {
      const error = new Error('Donation not found');
      error.status = 404;
      throw error;
    }
    if (existing.donorId.toString() !== donorId) {
      const error = new Error('Forbidden: You do not own this donation');
      error.status = 403;
      throw error;
    }
    const error = new Error('Invalid status transition. Donation must be CLAIMED.');
    error.status = 409;
    throw error;
  }

  // Send notification to the NGO
  try {
    await sendNotification({
      recipientId: updatedDonation.claimedBy,
      type: 'DONATION_READY',
      title: 'Ready for Pickup',
      message: 'The donor has marked your claimed donation as ready for pickup.',
      donationId: updatedDonation._id
    });
  } catch (err) {
    console.error('Notification failed:', err);
  }

  const { donorId: populatedDonor, claimedBy, ...rest } = updatedDonation;
  return {
    ...rest,
    donorName: populatedDonor?.name || null,
    donorOrganizationName: populatedDonor?.organizationName || null,
  };
};

/**
 * Marks a donation as picked up by the NGO.
 * @param {string} donationId - The MongoDB ObjectId of the donation.
 * @param {string} ngoId - The MongoDB ObjectId of the NGO marking it picked up.
 * @returns {Object} The updated donation document.
 */
const markPickedUp = async (donationId, ngoId) => {
  if (!donationId) {
    const error = new Error('donationId is required');
    error.status = 400;
    throw error;
  }
  if (!ngoId) {
    const error = new Error('ngoId is required');
    error.status = 400;
    throw error;
  }
  if (!mongoose.Types.ObjectId.isValid(donationId) || !mongoose.Types.ObjectId.isValid(ngoId)) {
    const error = new Error('Invalid ID format');
    error.status = 400;
    throw error;
  }

  const ngo = await User.findById(ngoId);
  if (!ngo) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }
  if (ngo.role !== 'NGO') {
    const error = new Error('Only NGO can mark as picked up');
    error.status = 403;
    throw error;
  }

  const now = new Date();
  const updatedDonation = await Donation.findOneAndUpdate(
    {
      _id: donationId,
      claimedBy: ngoId,
      status: 'READY_FOR_PICKUP',
    },
    {
      $set: {
        status: 'PICKED_UP',
        pickedUpAt: now,
      },
    },
    { new: true }
  )
    .populate('donorId', 'name organizationName -_id')
    .lean();

  if (!updatedDonation) {
    const existing = await Donation.findById(donationId);
    if (!existing) {
      const error = new Error('Donation not found');
      error.status = 404;
      throw error;
    }
    if (existing.claimedBy?.toString() !== ngoId) {
      const error = new Error('Forbidden: You did not claim this donation');
      error.status = 403;
      throw error;
    }
    const error = new Error('Invalid status transition. Donation must be READY_FOR_PICKUP.');
    error.status = 409;
    throw error;
  }

  // Send notification to donor
  try {
    await sendNotification({
      recipientId: updatedDonation.donorId._id,
      type: 'DONATION_PICKED_UP',
      title: 'Donation Picked Up',
      message: 'Your donation has been picked up successfully.',
      donationId: updatedDonation._id
    });
  } catch (err) {
    console.error('Notification failed:', err);
  }

  const { donorId: populatedDonor, claimedBy, ...rest } = updatedDonation;
  return {
    ...rest,
    donorName: populatedDonor?.name || null,
    donorOrganizationName: populatedDonor?.organizationName || null,
  };
};

/**
 * Retrieves nearby available donations within a specific radius.
 * Obscures the exact coordinates and pickup address for privacy.
 * 
 * @param {number} ngoLat - NGO latitude
 * @param {number} ngoLng - NGO longitude
 * @param {number} radiusKm - Search radius in kilometers
 * @returns {Array} Array of nearby donations with obscured locations
 */
const getNearbyDonations = async (ngoLat, ngoLng, radiusKm) => {
  const donations = await Donation.find({
    status: 'AVAILABLE',
    availableUntil: { $gt: new Date() },
    latitude: { $exists: true, $ne: null },
    longitude: { $exists: true, $ne: null }
  }).lean();

  const nearbyDonations = [];

  for (const donation of donations) {
    if (!Number.isFinite(donation.latitude) || !Number.isFinite(donation.longitude)) continue;

    const distanceKm = calculateDistanceKm(ngoLat, ngoLng, donation.latitude, donation.longitude);
    
    if (distanceKm <= radiusKm) {
      // Obscure data for privacy
              const {
          donorId,
          claimedBy,
          pickupAddress, // Hide exact address
          pincode,
          latitude,
          longitude,
          createdAt,
          updatedAt,
          __v,
          ...safeData
        } = donation;

      nearbyDonations.push({
        ...safeData,
        distanceKm: Math.round(distanceKm * 10) / 10, // Round to 1 decimal place
        approximateLocation: {
          latitude: obscureCoordinate(latitude),
          longitude: obscureCoordinate(longitude)
        }
      });
    }
  }

  // Sort nearest first
  return nearbyDonations.sort((a, b) => a.distanceKm - b.distanceKm);
};

/**
 * Retrieves the authorized route for a claimed donation.
 * @param {string} donationId - The MongoDB ObjectId of the donation.
 * @param {Object} appUser - The authenticated user profile (must be NGO).
 * @returns {Object} Route information
 */
const getDonationRoute = async (donationId, appUser) => {
  if (!donationId) {
    const error = new Error('donationId is required');
    error.status = 400;
    throw error;
  }
  if (!mongoose.Types.ObjectId.isValid(donationId)) {
    const error = new Error('Invalid donationId format');
    error.status = 400;
    throw error;
  }

  if (appUser.role !== 'NGO') {
    const error = new Error('Only NGOs can request routes');
    error.status = 403;
    throw error;
  }

  if (!appUser.latitude || !appUser.longitude) {
    const error = new Error('NGO location is not set in your profile');
    error.status = 400;
    throw error;
  }

  const donation = await Donation.findById(donationId);
  if (!donation) {
    const error = new Error('Donation not found');
    error.status = 404;
    throw error;
  }

  if (donation.claimedBy?.toString() !== appUser._id.toString()) {
    const error = new Error('Forbidden: You did not claim this donation');
    error.status = 403;
    throw error;
  }

  if (!['CLAIMED', 'READY_FOR_PICKUP', 'PICKED_UP'].includes(donation.status)) {
    const error = new Error('Route is not available for this donation status');
    error.status = 409;
    throw error;
  }

  if (!donation.latitude || !donation.longitude) {
    const error = new Error('Donation location is unavailable');
    error.status = 400;
    throw error;
  }

  const routeData = await getRoute(
    appUser.latitude,
    appUser.longitude,
    donation.latitude,
    donation.longitude
  );

  return {
    donationId: donation._id,
    distanceKm: Math.round((routeData.distanceMeters / 1000) * 10) / 10,
    durationMinutes: Math.round(routeData.durationSeconds / 60),
    geometry: routeData.geometry
  };
};

module.exports = { 
  createDonation, 
  getAvailableDonations, 
  getMyDonations, 
  claimDonation, 
  getMyClaims, 
  markReadyForPickup, 
  markPickedUp,
  getNearbyDonations,
  getDonationRoute
};





