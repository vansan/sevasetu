import { Response } from 'express';
import { z } from 'zod';
import { Organization } from '../models/organization.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { cloudinary } from '../config/cloudinary';

const orgSchema = z.object({
  name: z.string().min(2).max(200),
  type: z.enum(['NGO', 'Temple', 'Trust', 'Education', 'Health', 'Food', 'Other']),
  description: z.string().min(10).max(2000),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().min(5).max(10),
  contactEmail: z.string().email(),
  phone: z.string().min(10).max(15),
  razorpayAccountId: z.string().optional(),
  razorpayKeyId: z.string().optional(),
});

// GET /api/organizations - public
export const getOrganizations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search, city, type, page = '1', limit = '12', verified } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = { status: 'approved' };

    if (search) {
      filter.$text = { $search: search };
    }
    if (city) filter.city = new RegExp(city, 'i');
    if (type) filter.type = type;
    if (verified === 'true') filter.isVerified = true;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, parseInt(limit) || 12);
    const skip = (pageNum - 1) * limitNum;

    const [organizations, total] = await Promise.all([
      Organization.find(filter)
        .sort({ isVerified: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .select('-razorpayAccountId'),
      Organization.countDocuments(filter),
    ]);

    res.json({
      organizations,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch organizations.' });
  }
};

// GET /api/organizations/:id - public
export const getOrganizationById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const org = await Organization.findOne({
      _id: req.params.id,
      status: 'approved',
    }).select('-razorpayAccountId');

    if (!org) {
      res.status(404).json({ error: 'Organization not found.' });
      return;
    }

    res.json(org);
  } catch {
    res.status(500).json({ error: 'Failed to fetch organization.' });
  }
};

// POST /api/organizations - protected (org)
export const createOrganization = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = orgSchema.parse(req.body);

    const existing = await Organization.findOne({ createdBy: req.user!._id });
    if (existing) {
      res.status(409).json({ error: 'You already have a registered organization.' });
      return;
    }

    const files = req.files as { logo?: Express.Multer.File[]; images?: Express.Multer.File[] };
    const logo = files?.logo?.[0]?.path;
    const images = files?.images?.map((f) => f.path) || [];

    const org = await Organization.create({
      ...data,
      logo,
      images,
      createdBy: req.user!._id,
    });

    res.status(201).json({
      message: 'Organization created and pending approval.',
      organization: org,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: err.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to create organization.' });
  }
};

// PUT /api/organizations/:id - protected (owner or admin)
export const updateOrganization = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) {
      res.status(404).json({ error: 'Organization not found.' });
      return;
    }

    // Check ownership (admin can edit any)
    if (req.user!.role !== 'admin' && org.createdBy.toString() !== req.user!._id.toString()) {
      res.status(403).json({ error: 'Not authorized to edit this organization.' });
      return;
    }

    const data = orgSchema.partial().parse(req.body);

    const files = req.files as { logo?: Express.Multer.File[]; images?: Express.Multer.File[] };
    if (files?.logo?.[0]) data.logo = files.logo[0].path as unknown as never;
    if (files?.images?.length) {
      (data as Record<string, unknown>).images = files.images.map((f) => f.path);
    }

    const updated = await Organization.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json({ message: 'Organization updated.', organization: updated });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: err.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to update organization.' });
  }
};

// GET /api/organizations/my - protected (org)
export const getMyOrganization = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const org = await Organization.findOne({ createdBy: req.user!._id });
    if (!org) {
      res.status(404).json({ error: 'No organization found for this account.' });
      return;
    }
    res.json(org);
  } catch {
    res.status(500).json({ error: 'Failed to fetch organization.' });
  }
};

// DELETE image from gallery
export const deleteImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id, publicId } = req.params;
    const org = await Organization.findById(id);

    if (!org) {
      res.status(404).json({ error: 'Organization not found.' });
      return;
    }

    if (req.user!.role !== 'admin' && org.createdBy.toString() !== req.user!._id.toString()) {
      res.status(403).json({ error: 'Not authorized.' });
      return;
    }

    await cloudinary.uploader.destroy(decodeURIComponent(publicId));
    const imageUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${decodeURIComponent(publicId)}`;
    org.images = org.images.filter((img) => !img.includes(decodeURIComponent(publicId)));
    await org.save();

    res.json({ message: 'Image deleted.', images: org.images });
  } catch {
    res.status(500).json({ error: 'Failed to delete image.' });
  }
};
