import { Router } from 'express';
import { Package } from '../models/Package.js';
import { crudFactory } from '../controllers/crudFactory.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const c = crudFactory(Package, {
  searchFields: ['title', 'destinationName', 'summary', 'category'],
  sort: { order: 1, createdAt: -1 },
});

export const packageRoutes = Router();

packageRoutes.get('/', c.listPublic);
packageRoutes.get('/:idOrSlug', c.getOnePublic);

packageRoutes.use(requireAuth, requireRole('admin', 'editor'));
packageRoutes.get('/admin/all', c.listAll);
packageRoutes.post('/', c.create);
packageRoutes.patch('/:id', c.update);
packageRoutes.delete('/:id', c.remove);
