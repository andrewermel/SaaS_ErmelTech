import { Router } from 'express';
import {
  addPortion,
  createSnack,
  deleteSnack,
  getSnack,
  listSnacks,
  removePortion,
} from '../controllers/snackController.js';
import { authenticateJWT } from '../middlewares/authenticateJWT.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.use(authenticateJWT);

router.get('/', listSnacks);
router.get('/:id', getSnack);
router.post(
  '/',
  authorizeRole('OWNER', 'ADMIN'),
  upload.single('image'),
  createSnack
);
router.post(
  '/:snackId/portions/:portionId',
  authorizeRole('OWNER', 'ADMIN'),
  addPortion
);
router.delete(
  '/:snackId/portions/:portionId',
  authorizeRole('OWNER', 'ADMIN'),
  removePortion
);
router.delete('/:id', authorizeRole('OWNER'), deleteSnack);

export default router;
