import { Router } from 'express';
import {
  createPortion,
  deletePortion,
  getPortion,
  listPortions,
  updatePortion,
} from '../controllers/portionController.js';

const router = Router();

router.post('/', createPortion);
router.get('/', listPortions);
router.get('/:id', getPortion);
router.put('/:id', updatePortion);
router.delete('/:id', deletePortion);

export default router;
