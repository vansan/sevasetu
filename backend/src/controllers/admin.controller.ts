import { Response } from 'express';
import { Organization } from '../models/organization.model';
import { User } from '../models/user.model';
import { Donation } from '../models/donation.model';
import { AuthRequest } from '../middleware/auth.middleware';

// GET /api/admin/stats
export const getStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [totalOrgs, pendingOrgs, approvedOrgs, verifiedOrgs, totalUsers, totalDonations] =
      await Promise.all([
        Organization.countDocuments(),
        Organization.countDocuments({ status: 'pending' }),
        Organization.countDocuments({ status: 'approved' }),
        Organization.countDocuments({ isVerified: true }),
        User.countDocuments(),
        Donation.countDocuments(),
      ]);

    res.json({
      totalOrgs,
      pendingOrgs,
      approvedOrgs,
      verifiedOrgs,
      totalUsers,
      totalDonations,
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
};

// GET /api/admin/organizations
export const getAllOrganizations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, search, page = '1', limit = '20' } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (search) filter.$text = { $search: search };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit) || 20);

    const [organizations, total] = await Promise.all([
      Organization.find(filter)
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Organization.countDocuments(filter),
    ]);

    res.json({
      organizations,
      pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum) },
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch organizations.' });
  }
};

// PATCH /api/admin/organizations/:id/status
export const updateOrgStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      res.status(400).json({ error: 'Invalid status value.' });
      return;
    }

    const org = await Organization.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!org) {
      res.status(404).json({ error: 'Organization not found.' });
      return;
    }

    res.json({ message: `Organization status updated to ${status}.`, organization: org });
  } catch {
    res.status(500).json({ error: 'Failed to update status.' });
  }
};

// PATCH /api/admin/organizations/:id/verify
export const toggleVerification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) {
      res.status(404).json({ error: 'Organization not found.' });
      return;
    }

    org.isVerified = !org.isVerified;
    await org.save();

    res.json({
      message: `Organization ${org.isVerified ? 'verified' : 'unverified'} successfully.`,
      organization: org,
    });
  } catch {
    res.status(500).json({ error: 'Failed to toggle verification.' });
  }
};

// DELETE /api/admin/organizations/:id
export const deleteOrganization = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const org = await Organization.findByIdAndDelete(req.params.id);
    if (!org) {
      res.status(404).json({ error: 'Organization not found.' });
      return;
    }
    res.json({ message: 'Organization deleted successfully.' });
  } catch {
    res.status(500).json({ error: 'Failed to delete organization.' });
  }
};

// GET /api/admin/users
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
};
