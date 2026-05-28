import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 300 },
    slug: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
    excerpt: { type: String, trim: true, maxlength: 600, default: '' },
    body: { type: String, required: true }, // HTML
    coverUrl: { type: String, default: '' },
    coverThumbUrl: { type: String, default: '' },
    coverStorageKey: { type: String, default: '' },
    coverThumbStorageKey: { type: String, default: '' },
    category: { type: String, trim: true, default: '', index: true },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
      index: true,
    },
    publishedAt: { type: Date, default: () => new Date(), index: true },
    source: { type: String, default: 'manual' }, // "manual" or "wp-import"
    sourceId: { type: String, default: '' }, // original WP post id when imported
  },
  { timestamps: true }
);

blogPostSchema.index({ title: 'text', excerpt: 'text', body: 'text' });

export const BlogPost = mongoose.model('BlogPost', blogPostSchema);
