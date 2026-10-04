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

const createProfileHandler = async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const email = req.user.email;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Verified Firebase email is required to create a profile.'
      });
    }

    const { name, phone, role } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    if (!role || (role !== 'DONOR' && role !== 'NGO')) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either DONOR or NGO'
      });
    }

    const user = await authService.createApplicationProfile(firebaseUid, email, req.body);

    return res.status(201).json({
      success: true,
      message: 'Application profile created successfully',
      data: {
        user: {
          id: user._id,
          firebaseUid: user.firebaseUid,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          organizationName: user.organizationName,
          address: user.address,
          pincode: user.pincode
        }
      }
    });

  } catch (error) {
    if (error.status === 409) {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    // Mongoose duplicate key error (race condition fallback)
    if (error.code === 11000) {
      const isEmail = error.message.includes('email');
      return res.status(409).json({
        success: false,
        message: isEmail 
          ? 'An application account already exists for this email.' 
          : 'Application profile already exists for this account.'
      });
    }
    
    // Mongoose validation error handling
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create application profile',
      error: error.message
    });
  }
};

module.exports = {
  getCurrentUser,
  createProfileHandler
};
