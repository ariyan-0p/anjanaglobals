import { Router } from 'express';
import { asyncHandler } from '../middleware/error.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { BlogPost } from '../models/BlogPost.js';
import { GalleryImage, ALLOWED_GALLERY_DESTINATIONS } from '../models/GalleryImage.js';
import { Lead } from '../models/Lead.js';
import { Subscriber } from '../models/Subscriber.js';
import { B2BAgent } from '../models/B2BAgent.js';

export const statsRoutes = Router();

statsRoutes.use(requireAuth, requireRole('admin', 'editor'));

statsRoutes.get(
  '/',
  asyncHandler(async (_req, res) => {
    const [
      blogPublished,
      blogDrafts,
      blogTotal,
      galleryTotal,
      leadCount,
      subscriberCount,
      b2bCount,
      galleryByDest,
      recentPosts,
      recentLeads,
    ] = await Promise.all([
      BlogPost.countDocuments({ status: 'published' }),
      BlogPost.countDocuments({ status: 'draft' }),
      BlogPost.countDocuments(),
      GalleryImage.countDocuments(),
      Lead.countDocuments().catch(() => 0),
      Subscriber.countDocuments().catch(() => 0),
      B2BAgent.countDocuments().catch(() => 0),
      GalleryImage.aggregate([
        { $group: { _id: '$destinationId', count: { $sum: 1 } } },
      ]),
      BlogPost.find()
        .sort({ updatedAt: -1 })
        .limit(5)
        .select('title slug status updatedAt coverThumbUrl category')
        .lean(),
      Lead.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email phone source createdAt')
        .lean()
        .catch(() => []),
    ]);

    const galleries = ALLOWED_GALLERY_DESTINATIONS.reduce((acc, id) => {
      const row = galleryByDest.find((g) => g._id === id);
      acc[id] = row ? row.count : 0;
      return acc;
    }, {});

    res.json({
      blog: { published: blogPublished, drafts: blogDrafts, total: blogTotal },
      galleries: { total: galleryTotal, byDestination: galleries },
      leads: leadCount,
      subscribers: subscriberCount,
      b2bAgents: b2bCount,
      recent: { posts: recentPosts, leads: recentLeads },
    });
  })
);
