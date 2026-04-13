import { create } from "zustand";
import { ContentItem } from "@/types/content";
import { sampleContent } from "@/data/sampleContent";

interface ContentStore {
  items: ContentItem[];
  favorites: string[];
  playlist: string[];
  searchQuery: string;
  activeType: string | null;
  activeTags: string[];
  setSearchQuery: (q: string) => void;
  setActiveType: (type: string | null) => void;
  toggleTag: (tag: string) => void;
  clearFilters: () => void;
  toggleFavorite: (id: string) => void;
  addToPlaylist: (id: string) => void;
  removeFromPlaylist: (id: string) => void;
  updateItem: (item: ContentItem) => void;
  addItem: (item: ContentItem) => void;
  filteredItems: () => ContentItem[];
  getItem: (id: string) => ContentItem | undefined;
}

const loadFavorites = (): string[] => {
  try { return JSON.parse(localStorage.getItem("uem-favorites") || "[]"); } catch { return []; }
};
const loadPlaylist = (): string[] => {
  try { return JSON.parse(localStorage.getItem("uem-playlist") || "[]"); } catch { return []; }
};

export const useContentStore = create<ContentStore>((set, get) => ({
  items: sampleContent,
  favorites: loadFavorites(),
  playlist: loadPlaylist(),
  searchQuery: "",
  activeType: null,
  activeTags: [],
  setSearchQuery: (q) => set({ searchQuery: q }),
  setActiveType: (type) => set({ activeType: type }),
  toggleTag: (tag) => set((s) => ({
    activeTags: s.activeTags.includes(tag) ? s.activeTags.filter(t => t !== tag) : [...s.activeTags, tag]
  })),
  clearFilters: () => set({ searchQuery: "", activeType: null, activeTags: [] }),
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
  filteredItems: () => {
    const { items, searchQuery, activeType, activeTags } = get();
    return items.filter(item => {
      if (activeType && item.type !== activeType) return false;
      if (activeTags.length && !activeTags.some(t => item.tags.includes(t))) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || item.tags.some(t => t.toLowerCase().includes(q));
      }
      return true;
    });
  },
  getItem: (id) => get().items.find(i => i.id === id),
}));
