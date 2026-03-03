import { Router } from 'express';
import { getPublicMenu } from '../controllers/snackController.js';

const router = Router();

// Public endpoints - no authentication required
router.get('/menu/:companySlug', getPublicMenu);

export default router;
