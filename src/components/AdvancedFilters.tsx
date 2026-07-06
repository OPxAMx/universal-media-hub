import { useContentStore, SortKey } from "@/store/contentStore";
import { useMemo } from "react";
import { X, ArrowDownAZ, ArrowUpAZ, Hash, Calendar, Tag, Film, Tv, Music, Mic, Code, Image, Layers, Star, Flame, Popcorn, Globe, Building2, Cast } from "lucide-react";
import { ContentType } from "@/types/content";
import { useFiltersOpen } from "@/hooks/useFiltersOpen";

const typeOptions: { value: ContentType; label: string; icon: React.ReactNode }[] = [
  { value: "film", label: "Films", icon: <Film className="w-3.5 h-3.5" /> },
  { value: "series", label: "Séries", icon: <Tv className="w-3.5 h-3.5" /> },
  { value: "music", label: "Musique", icon: <Music className="w-3.5 h-3.5" /> },
  { value: "podcast", label: "Podcasts", icon: <Mic className="w-3.5 h-3.5" /> },
  { value: "codepen", label: "Code", icon: <Code className="w-3.5 h-3.5" /> },
  { value: "gallery", label: "Galerie", icon: <Image className="w-3.5 h-3.5" /> },
  { value: "iframe", label: "Iframe", icon: <Layers className="w-3.5 h-3.5" /> },
];

const AdvancedFilters = () => {
  const {
    items,
    activeType, setActiveType,
    filterId, setFilterId,
    filterDateFrom, setFilterDateFrom,
    filterDateTo, setFilterDateTo,
    sortKey, sortDir, setSort,
    activeTags, toggleTag,
    clearFilters,
    searchQuery,
  } = useContentStore();

  const [open] = useFiltersOpen();

  const allTags = useMemo(() => {
    const set = new Set<string>();
    items.forEach(i => i.tags.forEach(t => set.add(t)));
    return Array.from(set).sort();
  }, [items]);

  const activeCount =
    (filterId ? 1 : 0) +
    (filterDateFrom ? 1 : 0) +
    (filterDateTo ? 1 : 0) +
    (activeType ? 1 : 0) +
    activeTags.length +
    (sortKey !== "none" ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const sortOptions: { key: SortKey; label: string; icon: React.ReactNode }[] = [
    { key: "title", label: "Nom", icon: <ArrowDownAZ className="w-3.5 h-3.5" /> },
    { key: "id", label: "ID", icon: <Hash className="w-3.5 h-3.5" /> },
    { key: "date", label: "Date", icon: <Calendar className="w-3.5 h-3.5" /> },
    { key: "genre", label: "Genre", icon: <Popcorn className="w-3.5 h-3.5" /> },
    { key: "popularity", label: "Popularité", icon: <Flame className="w-3.5 h-3.5" /> },
    { key: "rating", label: "Rating", icon: <Star className="w-3.5 h-3.5" /> },
    { key: "country", label: "Pays", icon: <Globe className="w-3.5 h-3.5" /> },
    { key: "producer", label: "Producteur", icon: <Building2 className="w-3.5 h-3.5" /> },
    { key: "provider", label: "Provider", icon: <Cast className="w-3.5 h-3.5" /> },
  ];


  if (!open) return null;

  return (
    <div className="space-y-3">
      {(activeType || activeCount > 0) && (
        <div className="flex items-center gap-2 flex-wrap">
          {activeType && (
            <span className="text-[10px] px-2 py-1 rounded-full bg-primary/15 text-primary border border-primary/30">
              Type: {typeOptions.find(t => t.value === activeType)?.label || activeType}
            </span>
          )}
          {activeCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
            >
              <X className="w-3 h-3" /> Effacer
            </button>
          )}
        </div>
      )}

      {open && (
        <div className="rounded-xl p-4 space-y-4 border border-border/40 bg-card/40 backdrop-blur-sm fade-up">
          {/* Type filter */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground flex items-center gap-1.5"><Layers className="w-3 h-3" />Type de contenu</label>
            <div className="flex items-center gap-2 flex-wrap">
              {typeOptions.map(t => (

                <button
                  key={t.value}
                  onClick={() => setActiveType(activeType === t.value ? null : t.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeType === t.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground flex items-center gap-1.5"><Hash className="w-3 h-3" />ID</label>
              <input
                type="text"
                value={filterId}
                onChange={e => setFilterId(e.target.value)}
                placeholder="Rechercher par ID..."
                className="w-full px-3 py-2 rounded-md bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground flex items-center gap-1.5"><Calendar className="w-3 h-3" />Date début</label>
              <input
                type="date"
                value={filterDateFrom}
                onChange={e => setFilterDateFrom(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground flex items-center gap-1.5"><Calendar className="w-3 h-3" />Date fin</label>
              <input
                type="date"
                value={filterDateTo}
                onChange={e => setFilterDateTo(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Trier par</label>
            <div className="flex items-center gap-2 flex-wrap">
              {sortOptions.map(opt => {
                const active = sortKey === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => setSort(active ? "none" : opt.key, sortDir)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {opt.icon} {opt.label}
                  </button>
                );
              })}
              {sortKey !== "none" && (
                <button
                  onClick={() => setSort(sortKey, sortDir === "asc" ? "desc" : "asc")}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs bg-accent/20 text-accent-foreground hover:bg-accent/30"
                  title="Inverser l'ordre"
                >
                  {sortDir === "asc" ? <ArrowUpAZ className="w-3.5 h-3.5" /> : <ArrowDownAZ className="w-3.5 h-3.5" />}
                  {sortDir === "asc" ? "Croissant" : "Décroissant"}
                </button>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground flex items-center gap-1.5"><Tag className="w-3 h-3" />Tags ({activeTags.length} sélectionnés)</label>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`text-xs px-2 py-1 rounded-full transition-all ${
                    activeTags.includes(tag)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {activeCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
            >
              <X className="w-3 h-3" /> Réinitialiser tous les filtres
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
