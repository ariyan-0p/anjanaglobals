import { Router } from 'express';
import { Destination } from '../models/Destination.js';
import { crudFactory } from '../controllers/crudFactory.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const c = crudFactory(Destination, {
  searchFields: ['name', 'country', 'region', 'shortDescription'],
  sort: { order: 1, name: 1 },
});

export const destinationRoutes = Router();

destinationRoutes.get('/', c.listPublic);
destinationRoutes.get('/:idOrSlug', c.getOnePublic);

destinationRoutes.use(requireAuth, requireRole('admin', 'editor'));
destinationRoutes.get('/admin/all', c.listAll);
destinationRoutes.post('/', c.create);
destinationRoutes.patch('/:id', c.update);
destinationRoutes.delete('/:id', c.remove);
