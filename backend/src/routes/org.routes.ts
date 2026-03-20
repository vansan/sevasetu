import { Router } from 'express';
import {
  getOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  getMyOrganization,
  deleteImage,
} from '../controllers/org.controller';
import { protect, orgOnly } from '../middleware/auth.middleware';
import { upload } from '../config/cloudinary';

const router = Router();

// Public routes
router.get('/', getOrganizations);
router.get('/my', protect, orgOnly, getMyOrganization);
router.get('/:id', getOrganizationById);

// Protected routes
router.post(
  '/',
  protect,
  orgOnly,
  upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'images', maxCount: 10 }]),
  createOrganization
);

router.put(
  '/:id',
  protect,
  upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'images', maxCount: 10 }]),
  updateOrganization
);

router.delete('/:id/images/:publicId', protect, deleteImage);

export default router;
