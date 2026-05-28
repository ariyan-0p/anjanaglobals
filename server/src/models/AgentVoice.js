import mongoose from 'mongoose';

const agentVoiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    role: { type: String, trim: true, maxlength: 160, default: '' },
    desk: { type: String, trim: true, maxlength: 80, default: '' },
    quote: { type: String, trim: true, maxlength: 600, default: '' },
    videoUrl: { type: String, required: true },
    videoStorageKey: { type: String, required: true },
    mimeType: { type: String, default: 'video/mp4' },
    bytes: { type: Number, default: 0 },
    order: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const AgentVoice = mongoose.model('AgentVoice', agentVoiceSchema);
