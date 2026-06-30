// Helpers shared by card components to keep tag display clean.
const YEAR_RE = /(19|20)\d{2}/;

export function extractYear(item: { meta?: { date_added?: string }; tags?: string[] }): string | null {
  const fromDate = item.meta?.date_added?.match(YEAR_RE)?.[0];
  if (fromDate) return fromDate;
  const fromTag = (item.tags || []).find(t => /^(19|20)\d{2}$/.test(t));
  return fromTag || null;
}

/** Keep only year tags and "genre-like" tags (capitalized, no dashes/digits). */
export function visibleTags(tags: string[] | undefined): string[] {
  if (!tags) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of tags) {
    const t = (raw || "").trim();
    if (!t || seen.has(t.toLowerCase())) continue;
    const isYear = /^(19|20)\d{2}$/.test(t);
    const isGenre =
      /^[A-ZÀ-ÖØ-Þ][\p{L}\s&'-]{1,18}$/u.test(t) && !/-/.test(t) && !/\d/.test(t);
    if (isYear || isGenre) {
      seen.add(t.toLowerCase());
      out.push(t);
    }
  }
  return out;
}
