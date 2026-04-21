import { useMemo, useState } from "react";
import Layout from "@/components/Layout";
import LivePlaylistManager from "@/components/LivePlaylistManager";
import LivePlayer from "@/components/LivePlayer";
import LiveChannelEditor from "@/components/LiveChannelEditor";
import { useLiveTVStore } from "@/store/liveTVStore";
import { LiveChannel } from "@/types/livetv";
import {
  Search, Heart, Plus, Pencil, Trash2, ArrowUp, ArrowDown,
  Tv, Star, Clock, Filter, X
} from "lucide-react";

const LiveTVPage = () => {
  const {
    playlists, activePlaylistId,
    searchQuery, setSearchQuery,
    activeGroup, setActiveGroup,
    showFavoritesOnly, setShowFavoritesOnly,
    favorites, toggleFavorite,
    recent, addRecent, clearRecent,
    filteredChannels, groups,
    removeChannel, moveChannel,
  } = useLiveTVStore();

  const [current, setCurrent] = useState<LiveChannel | null>(null);
  const [editing, setEditing] = useState<LiveChannel | null>(null);
  const [adding, setAdding] = useState(false);
  const [showManager, setShowManager] = useState(true);

  const channels = filteredChannels();
  const groupList = groups();
  const activePlaylist = playlists.find(p => p.id === activePlaylistId);

  const groupCounts = useMemo(() => {
    const map = new Map<string, number>();
    activePlaylist?.channels.forEach(c => {
      const g = c.group || "Sans groupe";
      map.set(g, (map.get(g) || 0) + 1);
    });
    return map;
  }, [activePlaylist]);

  const handlePlay = (ch: LiveChannel) => {
    setCurrent(ch);
    addRecent(ch);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
              <Tv className="w-7 h-7 text-primary" /> LiveTV
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gérez vos playlists M3U/M3U8 et regardez du contenu live
            </p>
          </div>
          <button
            onClick={() => setShowManager(s => !s)}
            className="px-3 py-2 rounded-md bg-secondary hover:bg-secondary/80 text-sm flex items-center gap-1.5"
          >
            <Filter className="w-4 h-4" /> {showManager ? "Masquer" : "Afficher"} la bibliothèque
          </button>
        </div>

        {showManager && <LivePlaylistManager />}

        {activePlaylist && (
          <div className="grid lg:grid-cols-[1fr_360px] gap-6">
            {/* Player */}
            <div className="space-y-4">
              {current ? (
                <>
                  <LivePlayer channel={current} />
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-card/60 border border-border">
                    {current.logo && (
                      <img src={current.logo} alt="" className="w-12 h-12 rounded object-contain bg-black/40" onError={(e) => (e.currentTarget.style.display = "none")} />
                    )}
                    <div className="flex-1 min-w-0">
                      <h2 className="font-heading font-bold truncate">{current.name}</h2>
                      <div className="text-xs text-muted-foreground flex flex-wrap gap-2 mt-1">
                        {current.group && <span className="px-2 py-0.5 rounded bg-secondary">{current.group}</span>}
                        {current.tvgCountry && <span className="px-2 py-0.5 rounded bg-secondary">{current.tvgCountry}</span>}
                        {current.tvgLanguage && <span className="px-2 py-0.5 rounded bg-secondary">{current.tvgLanguage}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(current.url)}
                      className="p-2 rounded hover:bg-secondary"
                      title="Favori"
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(current.url) ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="aspect-video w-full rounded-lg border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground gap-2">
                  <Tv className="w-12 h-12" />
                  <p className="text-sm">Sélectionnez une chaîne pour commencer</p>
                </div>
              )}

              {recent.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> Récemment regardé
                    </h3>
                    <button onClick={clearRecent} className="text-xs text-muted-foreground hover:text-destructive">Effacer</button>
                  </div>
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                    {recent.slice(0, 12).map(r => (
                      <button
                        key={r.url + r.at}
                        onClick={() => handlePlay({ id: "recent", name: r.name, url: r.url })}
                        className="flex-shrink-0 px-3 py-1.5 rounded-full bg-secondary text-xs hover:bg-secondary/70 transition-colors"
                      >
                        {r.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Channel list */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text" placeholder="Rechercher chaîne..."
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-md bg-secondary border border-border text-sm"
                  />
                </div>
                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`p-2 rounded-md transition-colors ${showFavoritesOnly ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"}`}
                  title="Favoris uniquement"
                >
                  <Star className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setAdding(true)}
                  className="p-2 rounded-md bg-primary text-primary-foreground"
                  title="Ajouter une chaîne"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Group filter */}
              {groupList.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setActiveGroup(null)}
                    className={`px-2.5 py-1 rounded-full text-xs ${!activeGroup ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
                  >
                    Tous ({activePlaylist.channels.length})
                  </button>
                  {groupList.map(g => (
                    <button
                      key={g}
                      onClick={() => setActiveGroup(activeGroup === g ? null : g)}
                      className={`px-2.5 py-1 rounded-full text-xs ${activeGroup === g ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
                    >
                      {g} ({groupCounts.get(g) || 0})
                    </button>
                  ))}
                </div>
              )}

              {/* Channels */}
              <div className="max-h-[70vh] overflow-y-auto space-y-1 pr-1">
                {channels.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Aucune chaîne</p>
                ) : channels.map(ch => (
                  <div
                    key={ch.id}
                    className={`group flex items-center gap-2 p-2 rounded-md border transition-colors ${
                      current?.url === ch.url ? "border-primary bg-primary/10" : "border-transparent hover:border-border hover:bg-secondary/40"
                    }`}
                  >
                    <button onClick={() => handlePlay(ch)} className="flex items-center gap-2 flex-1 min-w-0 text-left">
                      {ch.logo ? (
                        <img src={ch.logo} alt="" className="w-8 h-8 rounded object-contain bg-black/40 flex-shrink-0" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
                      ) : (
                        <div className="w-8 h-8 rounded bg-secondary flex-shrink-0 flex items-center justify-center">
                          <Tv className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-sm truncate">{ch.name}</div>
                        {ch.group && <div className="text-[10px] text-muted-foreground truncate">{ch.group}</div>}
                      </div>
                    </button>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => toggleFavorite(ch.url)} className="p-1 rounded hover:bg-secondary" title="Favori">
                        <Heart className={`w-3.5 h-3.5 ${favorites.includes(ch.url) ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                      </button>
                      <button onClick={() => moveChannel(activePlaylistId!, ch.id, -1)} className="p-1 rounded hover:bg-secondary" title="Monter">
                        <ArrowUp className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button onClick={() => moveChannel(activePlaylistId!, ch.id, 1)} className="p-1 rounded hover:bg-secondary" title="Descendre">
                        <ArrowDown className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button onClick={() => setEditing(ch)} className="p-1 rounded hover:bg-secondary" title="Modifier">
                        <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => { if (confirm(`Supprimer "${ch.name}" ?`)) removeChannel(activePlaylistId!, ch.id); }}
                        className="p-1 rounded hover:bg-destructive/20" title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {(editing || adding) && activePlaylistId && (
          <LiveChannelEditor
            playlistId={activePlaylistId}
            channel={editing || undefined}
            onClose={() => { setEditing(null); setAdding(false); }}
          />
        )}
      </div>
    </Layout>
  );
};

export default LiveTVPage;
