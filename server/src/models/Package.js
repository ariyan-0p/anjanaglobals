import mongoose from 'mongoose';

const itineraryDaySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String },
    meals: [{ type: String, enum: ['breakfast', 'lunch', 'dinner'] }],
  },
  { _id: false }
);

const packageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' },
    destinationName: { type: String, trim: true },
    durationDays: { type: Number, min: 1 },
    durationNights: { type: Number, min: 0 },
    priceFrom: { type: Number, min: 0 },
    currency: { type: String, default: 'INR' },
    summary: { type: String, maxlength: 500 },
    description: { type: String },
    coverImage: { type: String },
    images: [{ type: String }],
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    itinerary: [itineraryDaySchema],
    tags: [{ type: String }],
    category: { type: String, trim: true },
    isFeatured: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

packageSchema.index({ title: 'text', summary: 'text', description: 'text' });

export const Package = mongoose.model('Package', packageSchema);
