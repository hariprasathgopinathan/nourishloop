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

module.exports = {
  requireAuth
};
