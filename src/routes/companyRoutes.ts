import { Router } from 'express';
import {
  createCompany,
  getCompany,
  getMembers,
  updateCompany,
} from '../controllers/companyController.js';
import { authenticateJWT } from '../middlewares/authenticateJWT.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';

const router = Router();

router.use(authenticateJWT);

router.get('/:id', getCompany);
router.get('/:id/members', getMembers);
router.post('/', authorizeRole('OWNER'), createCompany);
router.put('/:id', authorizeRole('OWNER'), updateCompany);

export default router;
