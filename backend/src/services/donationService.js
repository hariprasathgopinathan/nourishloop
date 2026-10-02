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

module.exports = { createDonation };
