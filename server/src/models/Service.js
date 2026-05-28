import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    icon: { type: String },
    image: { type: String },
    shortDescription: { type: String, maxlength: 500 },
    description: { type: String },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Service = mongoose.model('Service', serviceSchema);
