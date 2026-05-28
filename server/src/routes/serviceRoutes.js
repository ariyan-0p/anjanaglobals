import { Router } from 'express';
import { Service } from '../models/Service.js';
import { crudFactory } from '../controllers/crudFactory.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const c = crudFactory(Service, {
  searchFields: ['title', 'shortDescription'],
});

export const serviceRoutes = Router();

serviceRoutes.get('/', c.listPublic);
serviceRoutes.get('/:idOrSlug', c.getOnePublic);

serviceRoutes.use(requireAuth, requireRole('admin', 'editor'));
serviceRoutes.get('/admin/all', c.listAll);
serviceRoutes.post('/', c.create);
serviceRoutes.patch('/:id', c.update);
serviceRoutes.delete('/:id', c.remove);
