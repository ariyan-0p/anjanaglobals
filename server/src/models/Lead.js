import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, trim: true, lowercase: true, maxlength: 200 },
    phone: { type: String, trim: true, maxlength: 30 },
    destination: { type: String, trim: true, maxlength: 120 },
    travelDate: { type: Date },
    travelers: { type: Number, min: 1, max: 50 },
    message: { type: String, trim: true, maxlength: 2000 },
    source: {
      type: String,
      enum: ['popup', 'contact', 'package', 'b2b', 'destination', 'destination-rail', 'other'],
      default: 'other',
      index: true,
    },
    packageRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'converted', 'lost'],
      default: 'new',
      index: true,
    },
    notes: { type: String, maxlength: 2000 },
    meta: {
      ip: String,
      userAgent: String,
      referer: String,
    },
  },
  { timestamps: true }
);

leadSchema.index({ createdAt: -1 });
leadSchema.index({ email: 1, createdAt: -1 });

export const Lead = mongoose.model('Lead', leadSchema);
