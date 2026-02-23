import { Router } from 'express';
import {
  createIngredient,
  deleteIngredient,
  getIngredient,
  listIngredients,
  updateIngredient,
} from '../controllers/ingredientController.js';

const router = Router();

router.post('/', createIngredient);
router.get('/', listIngredients);
router.get('/:id', getIngredient);
router.put('/:id', updateIngredient);
router.delete('/:id', deleteIngredient);

export default router;
