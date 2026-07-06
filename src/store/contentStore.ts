import { create } from "zustand";
import { ContentItem } from "@/types/content";
import { sampleContent, loadSampleContent, localDataItems } from "@/data/sampleContent";

const buildBase = (sample: ContentItem[]): ContentItem[] => {
  const seen = new Set<string>();
  const out: ContentItem[] = [];
  // Order: locally-bundled data files (src/data/*.json|*.ts) first, then the
  // big remote sample dataset. Duplicates by `id` are filtered.
  for (const it of [...localDataItems, ...sample]) {
    if (!it || !it.id || seen.has(it.id)) continue;
    seen.add(it.id);
    out.push(it);
  }
  return out;
};

let baseContent: ContentItem[] = buildBase(sampleContent);


interface HistoryEntry {
  id: string;
  watchedAt: string;
}

export type SortKey = "title" | "id" | "date" | "rating" | "popularity" | "genre" | "country" | "producer" | "provider" | "none";
export type SortDir = "asc" | "desc";


interface ContentStore {
  items: ContentItem[];
  favorites: string[];
  playlist: string[];
  history: HistoryEntry[];
  searchQuery: string;
  activeType: string | null;
  activeTags: string[];
  filterId: string;
  filterDateFrom: string;
  filterDateTo: string;
  sortKey: SortKey;
  sortDir: SortDir;
  setSearchQuery: (q: string) => void;
  setActiveType: (type: string | null) => void;
  toggleTag: (tag: string) => void;
  setFilterId: (v: string) => void;
  setFilterDateFrom: (v: string) => void;
  setFilterDateTo: (v: string) => void;
  setSort: (key: SortKey, dir?: SortDir) => void;
  clearFilters: () => void;
  toggleFavorite: (id: string) => void;
  addToPlaylist: (id: string) => void;
  removeFromPlaylist: (id: string) => void;
  setPlaylist: (ids: string[]) => void;
  updateItem: (item: ContentItem) => void;
  addItem: (item: ContentItem) => void;
  addToHistory: (id: string) => void;
  clearHistory: () => void;
  filteredItems: () => ContentItem[];
  applyFilters: (items: ContentItem[]) => ContentItem[];
  getItem: (id: string) => ContentItem | undefined;
}


const loadFavorites = (): string[] => {
  try { return JSON.parse(localStorage.getItem("uem-favorites") || "[]"); } catch { return []; }
};
const loadPlaylist = (): string[] => {
  try { return JSON.parse(localStorage.getItem("uem-playlist") || "[]"); } catch { return []; }
};
const loadHistory = (): HistoryEntry[] => {
  try { return JSON.parse(localStorage.getItem("uem-history") || "[]"); } catch { return []; }
};
const loadItems = (): ContentItem[] => {
  try {
    const extras: ContentItem[] = JSON.parse(localStorage.getItem("uem-items") || "[]");
    const existing = new Set(baseContent.map(i => i.id));
    const merged = [...baseContent];
    for (const it of extras) if (!existing.has(it.id)) { merged.push(it); existing.add(it.id); }
    return merged;
  } catch { return baseContent; }
};
const persistExtras = (items: ContentItem[]) => {
  const baseIds = new Set(baseContent.map(i => i.id));
  const extras = items.filter(i => !baseIds.has(i.id));
  try { localStorage.setItem("uem-items", JSON.stringify(extras)); } catch {}
};

export const useContentStore = create<ContentStore>((set, get) => ({
  items: loadItems(),
  favorites: loadFavorites(),
  playlist: loadPlaylist(),
  history: loadHistory(),
  searchQuery: "",
  activeType: null,
  activeTags: [],
  filterId: "",
  filterDateFrom: "",
  filterDateTo: "",
  sortKey: "none",
  sortDir: "desc",
  setSearchQuery: (q) => set({ searchQuery: q }),
  setActiveType: (type) => set({ activeType: type }),
  toggleTag: (tag) => set((s) => ({
    activeTags: s.activeTags.includes(tag) ? s.activeTags.filter(t => t !== tag) : [...s.activeTags, tag]
  })),
  setFilterId: (v) => set({ filterId: v }),
  setFilterDateFrom: (v) => set({ filterDateFrom: v }),
  setFilterDateTo: (v) => set({ filterDateTo: v }),
  setSort: (key, dir) => set((s) => ({ sortKey: key, sortDir: dir ?? s.sortDir })),
  clearFilters: () => set({ searchQuery: "", activeType: null, activeTags: [], filterId: "", filterDateFrom: "", filterDateTo: "", sortKey: "none" }),
  toggleFavorite: (id) => set((s) => {
    const next = s.favorites.includes(id) ? s.favorites.filter(f => f !== id) : [...s.favorites, id];
    localStorage.setItem("uem-favorites", JSON.stringify(next));
    return { favorites: next };
  }),
  addToPlaylist: (id) => set((s) => {
    if (s.playlist.includes(id)) return s;
    const next = [...s.playlist, id];
    localStorage.setItem("uem-playlist", JSON.stringify(next));
    return { playlist: next };
  }),
  removeFromPlaylist: (id) => set((s) => {
    const next = s.playlist.filter(p => p !== id);
    localStorage.setItem("uem-playlist", JSON.stringify(next));
    return { playlist: next };
  }),
  setPlaylist: (ids) => set(() => {
    localStorage.setItem("uem-playlist", JSON.stringify(ids));
    return { playlist: ids };
  }),
  updateItem: (item) => set((s) => {
    const next = s.items.map(i => i.id === item.id ? item : i);
    persistExtras(next);
    return { items: next };
  }),
  addItem: (item) => set((s) => {
    if (s.items.some(i => i.id === item.id)) return s;
    const next = [...s.items, item];
    persistExtras(next);
    return { items: next };
  }),
  addToHistory: (id) => set((s) => {
    const entry: HistoryEntry = { id, watchedAt: new Date().toISOString() };
    const filtered = s.history.filter(h => h.id !== id);
    const next = [...filtered, entry].slice(-200);
    localStorage.setItem("uem-history", JSON.stringify(next));
    return { history: next };
  }),
  clearHistory: () => {
    localStorage.removeItem("uem-history");
    set({ history: [] });
  },
  filteredItems: () => {
    const { items, searchQuery, activeType, activeTags, filterId, filterDateFrom, filterDateTo, sortKey, sortDir } = get();
    let result = items.filter(item => {
      if (activeType && item.type !== activeType) return false;
      if (activeTags.length && !activeTags.some(t => (item.tags || []).includes(t))) return false;
      if (filterId && !(item.id || "").toLowerCase().includes(filterId.toLowerCase())) return false;
      const itemDate = item.meta?.date_added || "";
      if (filterDateFrom && itemDate && itemDate < filterDateFrom) return false;
      if (filterDateTo && itemDate && itemDate > filterDateTo) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return true;
        const pc = item.meta?.production_companies;
        const pcStr = Array.isArray(pc) ? pc.join(" ") : (pc || "");
        const networks = (item.meta as any)?.networks;
        const nwStr = Array.isArray(networks) ? networks.join(" ") : (networks || "");
        return (
          (item.title || "").toLowerCase().includes(q) ||
          (item.description || "").toLowerCase().includes(q) ||
          (item.id || "").toLowerCase().includes(q) ||
          (item.meta?.author || "").toLowerCase().includes(q) ||
          (item.embed?.provider || "").toLowerCase().includes(q) ||
          pcStr.toLowerCase().includes(q) ||
          nwStr.toLowerCase().includes(q) ||
          (item.tags || []).some(t => (t || "").toLowerCase().includes(q))
        );
      }
      return true;
    });
    if (sortKey !== "none") {
      const dir = sortDir === "asc" ? 1 : -1;
      result = [...result].sort((a, b) => {
        let av: string | number = "", bv: string | number = "";
        if (sortKey === "title") { av = (a.title || "").toLowerCase(); bv = (b.title || "").toLowerCase(); }
        else if (sortKey === "id") { av = a.id; bv = b.id; }
        else if (sortKey === "date") { av = a.meta?.date_added || ""; bv = b.meta?.date_added || ""; }
        return av < bv ? -1 * dir : av > bv ? 1 * dir : 0;
      });
    } else {
      // Default: most recent year first, then highest vote_average.
      const yearOf = (it: ContentItem): number => {
        const d = it.meta?.date_added || "";
        const m = d.match(/(19|20)\d{2}/);
        if (m) return parseInt(m[0], 10);
        const tag = (it.tags || []).find(t => /^(19|20)\d{2}$/.test(t));
        return tag ? parseInt(tag, 10) : 0;
      };
      result = [...result].sort((a, b) => {
        const ya = yearOf(a), yb = yearOf(b);
        if (yb !== ya) return yb - ya;
        const va = typeof a.meta?.vote_average === "number" ? a.meta.vote_average : -1;
        const vb = typeof b.meta?.vote_average === "number" ? b.meta.vote_average : -1;
        return vb - va;
      });
    }
    return result;
  },
  getItem: (id) => get().items.find(i => i.id === id),
}));

// Hydrate the large dataset asynchronously (hosted as an external asset).
loadSampleContent().then(sample => {
  baseContent = buildBase(sample);
  const state = useContentStore.getState();
  const existing = new Set(state.items.map(i => i.id));
  const merged = [...state.items];
  for (const it of baseContent) if (!existing.has(it.id)) merged.push(it);
  useContentStore.setState({ items: merged });
});

