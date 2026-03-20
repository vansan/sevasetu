import { Router } from 'express';
import {
  getStats,
  getAllOrganizations,
  updateOrgStatus,
  toggleVerification,
  deleteOrganization,
  getAllUsers,
} from '../controllers/admin.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';

const router = Router();

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/organizations', getAllOrganizations);
router.patch('/organizations/:id/status', updateOrgStatus);
router.patch('/organizations/:id/verify', toggleVerification);
router.delete('/organizations/:id', deleteOrganization);
router.get('/users', getAllUsers);

export default router;
