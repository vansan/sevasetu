import { Request, Response } from 'express';
import { z } from 'zod';
import { Donation } from '../models/donation.model';
import { Organization } from '../models/organization.model';

const donationSchema = z.object({
  orgId: z.string().min(1),
  amount: z.number().min(1),
  paymentId: z.string().optional(),
  donorName: z.string().optional(),
  donorEmail: z.string().email().optional(),
});

// POST /api/donations - record donation metadata
export const recordDonation = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = donationSchema.parse(req.body);

    const org = await Organization.findOne({ _id: data.orgId, status: 'approved' });
    if (!org) {
      res.status(404).json({ error: 'Organization not found or not approved.' });
      return;
    }

    const donation = await Donation.create(data);
    res.status(201).json({ message: 'Donation recorded.', donation });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: err.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to record donation.' });
  }
};

// GET /api/donations/org/:orgId
export const getOrgDonations = async (req: Request, res: Response): Promise<void> => {
  try {
    const donations = await Donation.find({ orgId: req.params.orgId }).sort({ createdAt: -1 });
    res.json(donations);
  } catch {
    res.status(500).json({ error: 'Failed to fetch donations.' });
  }
};
