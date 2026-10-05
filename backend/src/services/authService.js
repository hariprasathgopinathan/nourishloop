const User = require('../models/User');

const findUserByFirebaseUid = async (firebaseUid) => {
  return await User.findOne({ firebaseUid });
};

const createApplicationProfile = async (firebaseUid, email, profileData) => {
  // Check if firebaseUid already exists
  const existingUid = await User.findOne({ firebaseUid });
  if (existingUid) {
    const error = new Error('Application profile already exists for this account.');
    error.status = 409;
    throw error;
  }

  // Check if email already exists
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    const error = new Error('An application account already exists for this email.');
    error.status = 409;
    throw error;
  }

  // Extract allowed fields
  const {
    name,
    phone,
    role,
    organizationName,
    address,
    pincode,
    latitude,
    longitude
  } = profileData;

  // Validate geography if provided
  if (latitude !== undefined && longitude !== undefined) {
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
  }

  // Create new user profile using trusted firebaseUid and email
  const user = new User({
    firebaseUid,
    email,
    name,
    phone,
    role,
    organizationName,
    address,
    pincode,
    latitude: latitude !== undefined ? Number(latitude) : undefined,
    longitude: longitude !== undefined ? Number(longitude) : undefined
  });

  return await user.save();
};

const updateUserLocation = async (userId, latitude, longitude) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }
  
  user.latitude = latitude;
  user.longitude = longitude;
  return await user.save();
};

module.exports = {
  findUserByFirebaseUid,
  createApplicationProfile,
  updateUserLocation
};
