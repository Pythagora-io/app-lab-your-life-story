import { Router } from 'express';
import dalleApiKeyRoutes from './dalleApiKeyRoutes.js';

const router = Router();

// Define API routes here
// All API routes must have /api/ prefix to avoid conflicts with the UI/frontend.
router.use('/api', dalleApiKeyRoutes);

export default router;