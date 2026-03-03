import { Router } from 'express';
import {
  createCompany,
  createMember,
  getCompany,
  getMembers,
  inviteMember,
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
router.post(
  '/:id/invite',
  authorizeRole('OWNER'),
  inviteMember
);
router.post(
  '/:id/members',
  authorizeRole('OWNER'),
  createMember
);

export default router;
