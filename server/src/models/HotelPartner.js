import mongoose from 'mongoose';

const hotelPartnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: String },
    website: { type: String, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const HotelPartner = mongoose.model('HotelPartner', hotelPartnerSchema);
