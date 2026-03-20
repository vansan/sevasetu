import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IDonation extends Document {
  orgId: Types.ObjectId;
  amount: number;
  paymentId?: string;
  donorName?: string;
  donorEmail?: string;
  createdAt: Date;
}

const donationSchema = new Schema<IDonation>(
  {
    orgId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    amount: { type: Number, required: true, min: 1 },
    paymentId: { type: String },
    donorName: { type: String },
    donorEmail: { type: String, lowercase: true },
  },
  { timestamps: true }
);

donationSchema.index({ orgId: 1 });

export const Donation = mongoose.model<IDonation>('Donation', donationSchema);
