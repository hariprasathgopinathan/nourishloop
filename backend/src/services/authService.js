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
    latitude,
    longitude
  });

  return await user.save();
};

module.exports = {
  findUserByFirebaseUid,
  createApplicationProfile
};
