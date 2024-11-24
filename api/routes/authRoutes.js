import { Router } from 'express';

import UserService from '../services/userService.js';
import { requireUser } from '../middlewares/authMiddleware.js';
import logger from '../utils/log.js';

const log = logger('api/routes/authRoutes');

const router = Router();

router.post('/api/auth/login', async (req, res) => {
  log.info('Login attempt:', req.body.email);
  const sendError = msg => res.status(400).json({ error: msg });
  const { email, password } = req.body;

  if (!email || !password) {
    log.info('Authentication failed for:', req.body.email);
    return sendError('Email and password are required');
  }

  try {
    const user = await UserService.authenticateWithPassword(email, password);
    if (user) {
      log.info('User authenticated:', user.id);
      req.session.userId = user._id;
      req.session.email = user.email;
      req.session.save((err) => {
        if (err) {
          log.error('Session save error:', err);
          return sendError('An error occurred during login');
        }
        log.info('Session saved successfully');
        return res.json({ message: 'Login successful', user: { id: user.id, email: user.email } });
      });
    } else {
      log.info('Authentication failed for:', req.body.email);
      return sendError('Email or password is incorrect');
    }
  } catch (error) {
    log.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/api/auth/login', (req, res) => res.status(405).json({ error: 'Login with POST instead' }));

router.post('/api/auth/register', async (req, res, next) => {
  if (req.user) {
    return res.json({ user: req.user });
  }
  try {
    const user = await UserService.createUser(req.body);
    return res.status(201).json(user);
  } catch (error) {
    log.error('Error while registering user', error);
    return res.status(400).json({ error });
  }
});

router.get('/api/auth/register', (req, res) => res.status(405).json({ error: 'Register with POST instead' }));

router.all('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      log.error('Error destroying session:', err);
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.clearCookie('express.sid');
    return res.status(200).json({ message: 'Logged out successfully' });
  });
});

router.post('/api/auth/password', requireUser, async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  try {
    await UserService.setPassword(req.user, password);
    res.status(204).send();
  } catch (error) {
    log.error('Error setting password', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/auth/me', requireUser, async (req, res) => {
  log.info('Accessing /api/auth/me route');
  log.info('User in request:', req.user);
  return res.status(200).json(req.user);
});

export default router;