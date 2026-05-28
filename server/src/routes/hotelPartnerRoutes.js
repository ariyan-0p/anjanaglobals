import { Router } from 'express';
import { HotelPartner } from '../models/HotelPartner.js';
import { crudFactory } from '../controllers/crudFactory.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const c = crudFactory(HotelPartner, { searchFields: ['name'] });

export const hotelPartnerRoutes = Router();

hotelPartnerRoutes.get('/', c.listPublic);

hotelPartnerRoutes.use(requireAuth, requireRole('admin', 'editor'));
hotelPartnerRoutes.get('/admin/all', c.listAll);
hotelPartnerRoutes.post('/', c.create);
hotelPartnerRoutes.patch('/:id', c.update);
hotelPartnerRoutes.delete('/:id', c.remove);
