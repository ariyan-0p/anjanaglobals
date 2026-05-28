import { ApiError, asyncHandler } from '../middleware/error.js';

/**
 * Generic CRUD controller factory for simple resources.
 * Override individual handlers in route files when behavior diverges.
 */
export function crudFactory(Model, options = {}) {
  const {
    publicFilter = { isActive: true },
    sort = { order: 1, createdAt: -1 },
    searchFields = [],
  } = options;

  const listPublic = asyncHandler(async (req, res) => {
    const { q, limit = 50, page = 1 } = req.query;
    const filter = { ...publicFilter };
    if (q && searchFields.length) {
      filter.$or = searchFields.map((f) => ({ [f]: new RegExp(q, 'i') }));
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Model.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Model.countDocuments(filter),
    ]);
    res.json({ items, total, page: Number(page), limit: Number(limit) });
  });

  const getOnePublic = asyncHandler(async (req, res) => {
    const { idOrSlug } = req.params;
    const isId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const filter = isId ? { _id: idOrSlug } : { slug: idOrSlug };
    const doc = await Model.findOne({ ...filter, ...publicFilter });
    if (!doc) throw new ApiError(404, 'Not found');
    res.json(doc);
  });

  const listAll = asyncHandler(async (req, res) => {
    const { limit = 100, page = 1 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Model.find().sort(sort).skip(skip).limit(Number(limit)),
      Model.countDocuments(),
    ]);
    res.json({ items, total, page: Number(page), limit: Number(limit) });
  });

  const create = asyncHandler(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json(doc);
  });

  const update = asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) throw new ApiError(404, 'Not found');
    res.json(doc);
  });

  const remove = asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) throw new ApiError(404, 'Not found');
    res.json({ ok: true });
  });

  return { listPublic, getOnePublic, listAll, create, update, remove };
}
