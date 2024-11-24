import UserService from '../services/userService.js';

export const authenticateWithSession = async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const user = await UserService.get(req.session.userId);
      if (user) {
        req.user = user;
        next();
      } else {
        console.log('No user found with session userId:', req.session.userId);
        next(new Error('Authentication failed, user not found'));
      }
    } catch (error) {
      console.error('Session authentication error:', error);
      next(error);
    }
  } else {
    console.log('Session or userId not found in session');
    next();
  }
};

export const requireUser = (req, res, next) => {
  console.log('Session data:', req.session);
  console.log('User in request:', req.user);
  if (!req.user) {
    console.log('Authentication required, no user found');
    return res.status(401).json({ error: 'Authentication required' });
  }
  console.log('User authenticated:', req.user.id);
  next();
};