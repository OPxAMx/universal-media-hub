import { create } from "zustand";
import { ContentItem } from "@/types/content";
import { sampleContent } from "@/data/sampleContent";

interface HistoryEntry {
  id: string;
  watchedAt: string;
}

export type SortKey = "title" | "id" | "date" | "none";
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
  updateItem: (item: ContentItem) => void;
  addItem: (item: ContentItem) => void;
  addToHistory: (id: string) => void;
  clearHistory: () => void;
  filteredItems: () => ContentItem[];
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

export const useContentStore = create<ContentStore>((set, get) => ({
  items: sampleContent,
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
  updateItem: (item) => set((s) => ({ items: s.items.map(i => i.id === item.id ? item : i) })),
  addItem: (item) => set((s) => ({ items: [...s.items, item] })),
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
        const q = searchQuery.toLowerCase();
        return (item.title || "").toLowerCase().includes(q) || (item.description || "").toLowerCase().includes(q) || (item.tags || []).some(t => (t || "").toLowerCase().includes(q));
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
    }
    return result;
  },
  getItem: (id) => get().items.find(i => i.id === id),
}));
