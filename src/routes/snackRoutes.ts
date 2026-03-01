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
import { upload } from '../middlewares/upload.js';

const router = Router();

router.use(authenticateJWT);

router.post('/', upload.single('image'), createSnack);
router.get('/', listSnacks);
router.get('/:id', getSnack);
router.post('/:snackId/portions/:portionId', addPortion);
router.delete(
  '/:snackId/portions/:portionId',
  removePortion
);
router.delete('/:id', deleteSnack);

export default router;
