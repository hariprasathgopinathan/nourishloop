const User = require('../models/User');
const Donation = require('../models/Donation');

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
    latitude,
    longitude,
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
    .select('-donorId')
    .sort({ createdAt: -1 });

  return donations;
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

module.exports = { createDonation, getAvailableDonations, getMyDonations };
