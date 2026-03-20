import mongoose, { Document, Schema, Types } from 'mongoose';

export type OrgType = 'NGO' | 'Temple' | 'Trust' | 'Education' | 'Health' | 'Food' | 'Other';
export type OrgStatus = 'pending' | 'approved' | 'rejected';

export interface IOrganization extends Document {
  name: string;
  type: OrgType;
  description: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactEmail: string;
  phone: string;
  logo?: string;
  images: string[];
  razorpayAccountId?: string;
  razorpayKeyId?: string;
  status: OrgStatus;
  isVerified: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['NGO', 'Temple', 'Trust', 'Education', 'Health', 'Food', 'Other'],
      required: true,
    },
    description: { type: String, required: true, maxlength: 2000 },
    address: { type: String, required: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true },
    contactEmail: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    logo: { type: String },
    images: [{ type: String }],
    razorpayAccountId: { type: String },
    razorpayKeyId: { type: String },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    isVerified: { type: Boolean, default: false },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Text index for search
organizationSchema.index({ name: 'text', description: 'text', city: 'text' });

// Regular indexes
organizationSchema.index({ city: 1 });
organizationSchema.index({ type: 1 });
organizationSchema.index({ status: 1 });
organizationSchema.index({ isVerified: 1 });

export const Organization = mongoose.model<IOrganization>('Organization', organizationSchema);
