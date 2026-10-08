const User = require('../models/User');

const findUserByFirebaseUid = async (firebaseUid, email = null) => {
  let user = await User.findOne({ firebaseUid });
  
  const normalizedEmail = email ? email.toLowerCase().trim() : null;
  
  if (!user && normalizedEmail) {
    user = await User.findOne({ email: normalizedEmail });
    if (user && !user.firebaseUid) {
      user.firebaseUid = firebaseUid;
      await user.save();
    }
  }
  
  return user;
};

const createApplicationProfile = async (firebaseUid, email, profileData) => {
  const normalizedEmail = email ? email.toLowerCase().trim() : null;

  // Check if firebaseUid already exists
  let existingUser = await User.findOne({ firebaseUid });

  if (!existingUser && normalizedEmail) {
    existingUser = await User.findOne({ email: normalizedEmail });
  }

  if (existingUser) {
    if (!existingUser.firebaseUid) {
      existingUser.firebaseUid = firebaseUid;
      await existingUser.save();
    }
    return { user: existingUser, reused: true };
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
    email: normalizedEmail || email,
    name,
    phone,
    role,
    organizationName,
    address,
    pincode,
    latitude: latitude !== undefined ? Number(latitude) : undefined,
    longitude: longitude !== undefined ? Number(longitude) : undefined
  });

  const savedUser = await user.save();
  return { user: savedUser, reused: false };
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
