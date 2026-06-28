import { ContentItem } from "@/types/content";
import sampleAsset from "@/assets/sampleContent.json.asset.json";

// The large content dataset is hosted as an external asset to keep the repo lean.
// `sampleContent` starts empty and is hydrated asynchronously by `loadSampleContent()`.
export let sampleContent: ContentItem[] = [];

let loadPromise: Promise<ContentItem[]> | null = null;

export function loadSampleContent(): Promise<ContentItem[]> {
  if (loadPromise) return loadPromise;
  loadPromise = fetch(sampleAsset.url)
    .then(r => r.json())
    .then((data: ContentItem[]) => {
      sampleContent = Array.isArray(data) ? data : [];
      return sampleContent;
    })
    .catch(err => {
      console.error("Failed to load sampleContent asset", err);
      return [];
    });
  return loadPromise;
}
