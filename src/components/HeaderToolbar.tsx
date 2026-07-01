import { SlidersHorizontal, LayoutGrid, List, Rows3 } from "lucide-react";
import { useViewMode } from "@/hooks/useViewMode";
import { useFiltersOpen } from "@/hooks/useFiltersOpen";
import { useContentStore } from "@/store/contentStore";

const HeaderToolbar = () => {
  const [viewMode, setViewMode] = useViewMode();
  const [open, , toggle] = useFiltersOpen();
  const {
    searchQuery, activeType, activeTags, filterId, filterDateFrom, filterDateTo, sortKey,
  } = useContentStore();

  const activeCount =
    (filterId ? 1 : 0) +
    (filterDateFrom ? 1 : 0) +
    (filterDateTo ? 1 : 0) +
    (activeType ? 1 : 0) +
    activeTags.length +
    (sortKey !== "none" ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggle}
        aria-label="Filtres"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
          open || activeCount > 0
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Filtres</span>
        {activeCount > 0 && (
          <span className="bg-background/30 rounded-full px-1.5 text-[10px]">{activeCount}</span>
        )}
      </button>
      <div className="flex items-center gap-0.5 p-0.5 rounded-full bg-secondary/40 border border-border/40">
        <button
          onClick={() => setViewMode("grid")}
          aria-label="Affichage grille"
          title="Grille"
          className={`p-1.5 rounded-full transition-colors ${
            viewMode === "grid"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setViewMode("list")}
          aria-label="Affichage liste"
          title="Liste"
          className={`p-1.5 rounded-full transition-colors ${
            viewMode === "list"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setViewMode("horizontal")}
          aria-label="Affichage horizontal"
          title="Fiches horizontales"
          className={`p-1.5 rounded-full transition-colors ${
            viewMode === "horizontal"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Rows3 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default HeaderToolbar;
