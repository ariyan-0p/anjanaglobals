import { Router } from 'express';
import { authRoutes } from './authRoutes.js';
import { leadRoutes } from './leadRoutes.js';
import { subscriberRoutes } from './subscriberRoutes.js';
import { destinationRoutes } from './destinationRoutes.js';
import { packageRoutes } from './packageRoutes.js';
import { serviceRoutes } from './serviceRoutes.js';
import { testimonialRoutes } from './testimonialRoutes.js';
import { hotelPartnerRoutes } from './hotelPartnerRoutes.js';
import { b2bRoutes } from './b2bRoutes.js';
import { galleryRoutes } from './galleryRoutes.js';
import { blogRoutes } from './blogRoutes.js';
import { statsRoutes } from './statsRoutes.js';

export const router = Router();

router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);
router.use('/subscribers', subscriberRoutes);
router.use('/destinations', destinationRoutes);
router.use('/packages', packageRoutes);
router.use('/services', serviceRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/hotel-partners', hotelPartnerRoutes);
router.use('/b2b', b2bRoutes);
router.use('/galleries', galleryRoutes);
router.use('/blog', blogRoutes);
router.use('/stats', statsRoutes);
