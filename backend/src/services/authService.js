const User = require('../models/User');

const findUserByFirebaseUid = async (firebaseUid) => {
  return await User.findOne({ firebaseUid });
};

module.exports = {
  findUserByFirebaseUid
};
