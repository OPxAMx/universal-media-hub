import { ContentItem } from "@/types/content";
import asset from "@/assets/sampleContent.json.asset.json";

/**
 * Lightweight loader stub for the main dataset (hosted as an external asset).
 * Plus an auto-aggregator that picks up every other `.json` and `.ts` data file
 * dropped into `src/data/` so contributors can add new video sources by simply
 * placing a file in this folder.
 */
export const sampleContent: ContentItem[] = [];

const isContentItem = (x: any): x is ContentItem =>
  x && typeof x === "object" && typeof x.id === "string" && typeof x.type === "string";

const pickTrailerKey = (videos: any): string | undefined => {
  if (!Array.isArray(videos) || !videos.length) return undefined;
  const yt = videos.filter((v: any) => v && v.site === "YouTube" && v.key);
  if (!yt.length) return undefined;
  const trailers = yt.filter((v: any) => v.type === "Trailer");
  const pool = trailers.length ? trailers : yt;
  const fr = pool.find((v: any) => v.iso_639_1 === "fr" && v.official);
  const off = pool.find((v: any) => v.official);
  return (fr || off || pool[0]).key;
};

const normalizeLocalItem = (x: any): ContentItem => {
  const meta = x.meta ? { ...x.meta } : {};
  if (x.vote_average != null && meta.vote_average == null) meta.vote_average = x.vote_average;
  if (x.backdrop && !meta.backdrop) meta.backdrop = x.backdrop;
  if (meta.trailer_key == null) {
    const key = pickTrailerKey(x.videos);
    if (key) meta.trailer_key = key;
  }
  return { ...x, meta };
};

const collectFromModule = (mod: any): ContentItem[] => {
  const out: ContentItem[] = [];
  const visit = (v: any) => {
    if (!v) return;
    if (Array.isArray(v)) v.forEach(visit);
    else if (isContentItem(v)) out.push(normalizeLocalItem(v));
    else if (typeof v === "object") Object.values(v).forEach(visit);
  };
  visit(mod?.default ?? mod);
  return out;
};

const assetModules = import.meta.glob("../assets/data/*.asset.json", { eager: true });
const externalAssets = [
  asset,
  ...Object.values(assetModules).map((mod: any) => mod?.default ?? mod),
].filter((entry: any) => entry?.url);

const loadAssetItems = async (entry: any): Promise<ContentItem[]> => {
  try {
    const res = await fetch(entry.url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map(normalizeLocalItem);
  } catch (e) {
    console.error("Failed to load sampleContent asset", entry?.url, e);
    return [];
  }
};

/** Eagerly aggregate every other data file under src/data/ (except this loader). */
const jsonModules = import.meta.glob("./*.json", { eager: true });
const tsModules = import.meta.glob("./*.ts", { eager: true });

export const localDataItems: ContentItem[] = (() => {
  const all: ContentItem[] = [];
  for (const [path, mod] of Object.entries({ ...jsonModules, ...tsModules })) {
    if (path.endsWith("/sampleContent.ts")) continue;
    all.push(...collectFromModule(mod));
  }
  return all;
})();

export async function loadSampleContent(): Promise<ContentItem[]> {
  const chunks = await Promise.all(externalAssets.map(loadAssetItems));
  return chunks.flat();
}
