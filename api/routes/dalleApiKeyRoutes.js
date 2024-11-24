import express from 'express';
import { requireUser } from '../middlewares/authMiddleware.js';
import { storeDalleApiKey, retrieveDalleApiKey, verifyDalleApiKey } from '../controllers/dalleApiKeyController.js';

const router = express.Router();

router.post('/dalle-api-key', requireUser, storeDalleApiKey);
router.get('/dalle-api-key', requireUser, (req, res, next) => {
  console.log('GET /dalle-api-key route hit for user:', req.user.id);
  retrieveDalleApiKey(req, res, next);
});
router.post('/verify-dalle-api-key', requireUser, verifyDalleApiKey);

export default router;