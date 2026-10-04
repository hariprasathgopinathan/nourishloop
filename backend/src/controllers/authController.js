const authService = require('../services/authService');

const getCurrentUser = async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const user = await authService.findUserByFirebaseUid(firebaseUid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Authenticated Firebase user is not linked to an application account.'
      });
    }

    // Return safe data
    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          firebaseUid: user.firebaseUid,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve current user',
      error: error.message
    });
  }
};

module.exports = {
  getCurrentUser
};
