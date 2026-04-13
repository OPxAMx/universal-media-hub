import { useContentStore } from "@/store/contentStore";
import { ContentType } from "@/types/content";
import { Film, Tv, Music, Mic, Code, Image, Layers, X } from "lucide-react";

const types: { value: ContentType; label: string; icon: React.ReactNode }[] = [
  { value: "film", label: "Films", icon: <Film className="w-4 h-4" /> },
  { value: "series", label: "Séries", icon: <Tv className="w-4 h-4" /> },
  { value: "music", label: "Musique", icon: <Music className="w-4 h-4" /> },
  { value: "podcast", label: "Podcasts", icon: <Mic className="w-4 h-4" /> },
  { value: "codepen", label: "Code", icon: <Code className="w-4 h-4" /> },
  { value: "gallery", label: "Galerie", icon: <Image className="w-4 h-4" /> },
  { value: "iframe", label: "Iframe", icon: <Layers className="w-4 h-4" /> },
];

const FilterBar = () => {
  const { activeType, setActiveType, activeTags, clearFilters } = useContentStore();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {types.map(t => (
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
      {(activeType || activeTags.length > 0) && (
        <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors">
          <X className="w-3 h-3" /> Effacer
        </button>
      )}
    </div>
  );
};

export default FilterBar;
