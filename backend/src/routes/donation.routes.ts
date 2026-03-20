import { Router } from 'express';
import { recordDonation, getOrgDonations } from '../controllers/donation.controller';

const router = Router();

router.post('/', recordDonation);
router.get('/org/:orgId', getOrgDonations);

export default router;
