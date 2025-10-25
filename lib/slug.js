export function slugify(input) {
  return (input || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function uniqueSlug(base, checkExists) {
  let s = slugify(base);
  if (!s) s = Math.random().toString(36).slice(2, 8);
  let i = 1;
  let candidate = s;
  // checkExists: async (slug) => boolean
  while (await checkExists(candidate)) {
    i += 1;
    candidate = `${s}-${i}`;
    if (i > 1000) break;
  }
  return candidate;
}

