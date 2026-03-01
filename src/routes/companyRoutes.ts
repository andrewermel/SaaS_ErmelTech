import { Router } from 'express';
import {
  createCompany,
  getCompany,
  getMembers,
  updateCompany,
} from '../controllers/companyController.js';

const router = Router();

router.post('/', createCompany);
router.get('/:id', getCompany);
router.put('/:id', updateCompany);
router.get('/:id/members', getMembers);

export default router;
