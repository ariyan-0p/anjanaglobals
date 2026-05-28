import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    country: { type: String, trim: true },
    region: { type: String, trim: true },
    shortDescription: { type: String, maxlength: 500 },
    description: { type: String },
    heroImage: { type: String },
    images: [{ type: String }],
    highlights: [{ type: String }],
    bestTimeToVisit: { type: String },
    isFeatured: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
  },
  { timestamps: true }
);

export const Destination = mongoose.model('Destination', destinationSchema);
