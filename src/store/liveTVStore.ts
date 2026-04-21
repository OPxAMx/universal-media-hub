import { create } from "zustand";
import { LiveChannel, LivePlaylist } from "@/types/livetv";
import { parseM3U } from "@/lib/m3uParser";

const LS_PLAYLISTS = "uem-livetv-playlists";
const LS_FAVORITES = "uem-livetv-favorites";
const LS_RECENT = "uem-livetv-recent";

const load = <T,>(k: string, fb: T): T => {
  try { return JSON.parse(localStorage.getItem(k) || "null") ?? fb; } catch { return fb; }
};
const save = (k: string, v: unknown) => localStorage.setItem(k, JSON.stringify(v));

interface LiveTVStore {
  playlists: LivePlaylist[];
  favorites: string[]; // channel urls (stable across reimports)
  recent: { url: string; name: string; at: string }[];
  activePlaylistId: string | null;
  searchQuery: string;
  activeGroup: string | null;
  showFavoritesOnly: boolean;

  setSearchQuery: (q: string) => void;
  setActiveGroup: (g: string | null) => void;
  setShowFavoritesOnly: (v: boolean) => void;
  setActivePlaylist: (id: string | null) => void;

  addPlaylistFromText: (name: string, text: string, source?: string) => string;
  importPlaylistFromUrl: (name: string, url: string) => Promise<string>;
  removePlaylist: (id: string) => void;
  renamePlaylist: (id: string, name: string) => void;

  addChannel: (playlistId: string, ch: Omit<LiveChannel, "id">) => void;
  updateChannel: (playlistId: string, ch: LiveChannel) => void;
  removeChannel: (playlistId: string, channelId: string) => void;
  moveChannel: (playlistId: string, channelId: string, dir: -1 | 1) => void;

  toggleFavorite: (url: string) => void;
  addRecent: (ch: LiveChannel) => void;
  clearRecent: () => void;

  filteredChannels: () => LiveChannel[];
  groups: () => string[];
}

export const useLiveTVStore = create<LiveTVStore>((set, get) => ({
  playlists: load<LivePlaylist[]>(LS_PLAYLISTS, []),
  favorites: load<string[]>(LS_FAVORITES, []),
  recent: load<{ url: string; name: string; at: string }[]>(LS_RECENT, []),
  activePlaylistId: load<string | null>("uem-livetv-active", null),
  searchQuery: "",
  activeGroup: null,
  showFavoritesOnly: false,

  setSearchQuery: (q) => set({ searchQuery: q }),
  setActiveGroup: (g) => set({ activeGroup: g }),
  setShowFavoritesOnly: (v) => set({ showFavoritesOnly: v }),
  setActivePlaylist: (id) => {
    save("uem-livetv-active", id);
    set({ activePlaylistId: id, activeGroup: null });
  },

  addPlaylistFromText: (name, text, source) => {
    const channels = parseM3U(text);
    const pl: LivePlaylist = {
      id: `pl-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      source,
      importedAt: new Date().toISOString(),
      channels,
    };
    set((s) => {
      const next = [...s.playlists, pl];
      save(LS_PLAYLISTS, next);
      save("uem-livetv-active", pl.id);
      return { playlists: next, activePlaylistId: pl.id };
    });
    return pl.id;
  },

  importPlaylistFromUrl: async (name, url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    return get().addPlaylistFromText(name, text, url);
  },

  removePlaylist: (id) => set((s) => {
    const next = s.playlists.filter(p => p.id !== id);
    save(LS_PLAYLISTS, next);
    const active = s.activePlaylistId === id ? (next[0]?.id ?? null) : s.activePlaylistId;
    save("uem-livetv-active", active);
    return { playlists: next, activePlaylistId: active };
  }),

  renamePlaylist: (id, name) => set((s) => {
    const next = s.playlists.map(p => p.id === id ? { ...p, name } : p);
    save(LS_PLAYLISTS, next);
    return { playlists: next };
  }),

  addChannel: (playlistId, ch) => set((s) => {
    const next = s.playlists.map(p => p.id === playlistId
      ? { ...p, channels: [...p.channels, { ...ch, id: `c-${Date.now()}-${Math.random().toString(36).slice(2,7)}` }] }
      : p);
    save(LS_PLAYLISTS, next);
    return { playlists: next };
  }),

  updateChannel: (playlistId, ch) => set((s) => {
    const next = s.playlists.map(p => p.id === playlistId
      ? { ...p, channels: p.channels.map(c => c.id === ch.id ? ch : c) }
      : p);
    save(LS_PLAYLISTS, next);
    return { playlists: next };
  }),

  removeChannel: (playlistId, channelId) => set((s) => {
    const next = s.playlists.map(p => p.id === playlistId
      ? { ...p, channels: p.channels.filter(c => c.id !== channelId) }
      : p);
    save(LS_PLAYLISTS, next);
    return { playlists: next };
  }),

  moveChannel: (playlistId, channelId, dir) => set((s) => {
    const next = s.playlists.map(p => {
      if (p.id !== playlistId) return p;
      const idx = p.channels.findIndex(c => c.id === channelId);
      if (idx < 0) return p;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= p.channels.length) return p;
      const arr = [...p.channels];
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return { ...p, channels: arr };
    });
    save(LS_PLAYLISTS, next);
    return { playlists: next };
  }),

  toggleFavorite: (url) => set((s) => {
    const next = s.favorites.includes(url) ? s.favorites.filter(u => u !== url) : [...s.favorites, url];
    save(LS_FAVORITES, next);
    return { favorites: next };
  }),

  addRecent: (ch) => set((s) => {
    const filtered = s.recent.filter(r => r.url !== ch.url);
    const next = [{ url: ch.url, name: ch.name, at: new Date().toISOString() }, ...filtered].slice(0, 50);
    save(LS_RECENT, next);
    return { recent: next };
  }),

  clearRecent: () => {
    save(LS_RECENT, []);
    set({ recent: [] });
  },

  filteredChannels: () => {
    const { playlists, activePlaylistId, searchQuery, activeGroup, showFavoritesOnly, favorites } = get();
    const pl = playlists.find(p => p.id === activePlaylistId);
    if (!pl) return [];
    const q = searchQuery.trim().toLowerCase();
    return pl.channels.filter(c => {
      if (activeGroup && (c.group || "Sans groupe") !== activeGroup) return false;
      if (showFavoritesOnly && !favorites.includes(c.url)) return false;
      if (q) {
        const hay = `${c.name} ${c.group || ""} ${c.tvgCountry || ""} ${c.tvgLanguage || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  },

  groups: () => {
    const { playlists, activePlaylistId } = get();
    const pl = playlists.find(p => p.id === activePlaylistId);
    if (!pl) return [];
    const set = new Set<string>();
    pl.channels.forEach(c => set.add(c.group || "Sans groupe"));
    return Array.from(set).sort();
  },
}));
