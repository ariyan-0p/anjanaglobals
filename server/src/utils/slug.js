export function slugify(input) {
  return String(input || '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120);
}

export async function uniqueSlug(Model, base, ignoreId) {
  let slug = slugify(base) || 'post';
  let candidate = slug;
  let n = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await Model.exists({ slug: candidate, ...(ignoreId ? { _id: { $ne: ignoreId } } : {}) })) {
    n += 1;
    candidate = `${slug}-${n}`;
  }
  return candidate;
}
