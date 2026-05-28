import mongoose from 'mongoose';

const ALLOWED_DESTINATIONS = ['dubai', 'azerbaijan', 'singapore', 'malaysia', 'bali'];

const galleryImageSchema = new mongoose.Schema(
  {
    destinationId: {
      type: String,
      required: true,
      enum: ALLOWED_DESTINATIONS,
      index: true,
    },
    url: { type: String, required: true },
    thumbUrl: { type: String, required: true },
    width: { type: Number },
    height: { type: Number },
    bytes: { type: Number },
    caption: { type: String, trim: true, maxlength: 240, default: '' },
    alt: { type: String, trim: true, maxlength: 240, default: '' },
    order: { type: Number, default: 0, index: true },
    storageKey: { type: String, required: true },
    thumbStorageKey: { type: String, required: true },
  },
  { timestamps: true }
);

galleryImageSchema.index({ destinationId: 1, order: 1 });

export const ALLOWED_GALLERY_DESTINATIONS = ALLOWED_DESTINATIONS;
export const GalleryImage = mongoose.model('GalleryImage', galleryImageSchema);
