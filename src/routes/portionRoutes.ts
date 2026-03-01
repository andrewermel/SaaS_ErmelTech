import { Router } from 'express';
import {
  createPortion,
  deletePortion,
  getPortion,
  listPortions,
  updatePortion,
} from '../controllers/portionController.js';
import { authenticateJWT } from '../middlewares/authenticateJWT.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';

const router = Router();

router.use(authenticateJWT);

router.get('/', listPortions);
router.get('/:id', getPortion);
router.post('/', authorizeRole('OWNER', 'ADMIN'), createPortion);
router.put('/:id', authorizeRole('OWNER', 'ADMIN'), updatePortion);
router.delete('/:id', authorizeRole('OWNER'), deletePortion);

export default router;
