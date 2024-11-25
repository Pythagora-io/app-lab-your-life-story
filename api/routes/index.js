import { Router } from 'express';
import dalleApiKeyRoutes from './dalleApiKeyRoutes.js';
import storyRoutes from './storyRoutes.js';

const router = Router();

router.use('/api', dalleApiKeyRoutes);
router.use('/api', storyRoutes);

export default router;