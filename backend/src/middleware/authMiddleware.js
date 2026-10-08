const { getAuth } = require('../config/firebaseAdmin');

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const token = authHeader.split('Bearer ')[1].trim();
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    
    // Attach safe authenticated-user object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || null
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token'
    });
  }
};

const authService = require('../services/authService');

const requireAppUser = async (req, res, next) => {
  if (!req.user || !req.user.uid) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  try {
    const user = await authService.findUserByFirebaseUid(req.user.uid, req.user.email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Authenticated user is not linked to an application account.'
      });
    }

    req.appUser = {
      _id: user._id,
      firebaseUid: user.firebaseUid,
      name: user.name,
      email: user.email,
      role: user.role,
      latitude: user.latitude,
      longitude: user.longitude
    };

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to authenticate user profile'
    });
  }
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.appUser) {
      return res.status(401).json({
        success: false,
        message: 'Application user not found in request context'
      });
    }

    if (req.appUser.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires ${role} role.`
      });
    }

    next();
  };
};

module.exports = {
  requireAuth,
  requireAppUser,
  requireRole
};
