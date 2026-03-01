import { Router } from 'express';
import {
  createIngredient,
  deleteIngredient,
  getIngredient,
  listIngredients,
  updateIngredient,
} from '../controllers/ingredientController.js';
import { authenticateJWT } from '../middlewares/authenticateJWT.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';

const router = Router();

router.use(authenticateJWT);

router.get('/', listIngredients);
router.get('/:id', getIngredient);
router.post('/', authorizeRole('OWNER', 'ADMIN'), createIngredient);
router.put('/:id', authorizeRole('OWNER', 'ADMIN'), updateIngredient);
router.delete('/:id', authorizeRole('OWNER'), deleteIngredient);

export default router;
