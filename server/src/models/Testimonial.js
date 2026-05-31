import mongoose from 'mongoose';

const ALLOWED_DESTINATIONS = ['dubai', 'azerbaijan', 'singapore', 'malaysia', 'bali'];

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    location: { type: String, trim: true, maxlength: 160, default: '' },
    avatarUrl: { type: String, default: '' },
    avatarThumbUrl: { type: String, default: '' },
    avatarStorageKey: { type: String, default: '' },
    avatarThumbStorageKey: { type: String, default: '' },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    message: { type: String, required: true, maxlength: 2000 },
    tripType: { type: String, trim: true, maxlength: 80, default: '' },
    tripDate: { type: String, trim: true, maxlength: 60, default: '' },
    destinationId: {
      type: String,
      enum: [...ALLOWED_DESTINATIONS, ''],
      default: '',
      index: true,
    },
    isApproved: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

testimonialSchema.index({ destinationId: 1, order: 1 });

export const ALLOWED_TESTIMONIAL_DESTINATIONS = ALLOWED_DESTINATIONS;
export const Testimonial = mongoose.model('Testimonial', testimonialSchema);
