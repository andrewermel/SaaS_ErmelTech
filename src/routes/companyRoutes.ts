import { Router } from 'express';
import {
  createCompany,
  getCompany,
  getMembers,
  inviteMember,
  updateCompany,
} from '../controllers/companyController.js';

const router = Router();

// Todas as rotas deste router assumem middleware de autenticação
router.post('/', createCompany);
router.get('/:id', getCompany);
router.put('/:id', updateCompany);
router.get('/:id/members', getMembers);
router.post('/:id/invite', inviteMember);

export default router;
