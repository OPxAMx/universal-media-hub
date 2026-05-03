import { ContentItem } from "@/types/content";
import { Heart, Play, Plus, Check } from "lucide-react";
import { useContentStore } from "@/store/contentStore";
import { getTagColor } from "@/lib/colors";
import { useNavigate } from "react-router-dom";
import { useLazyLoad } from "@/hooks/use-lazy-load";
import { useState } from "react";

interface ContentCardProps {
  item: ContentItem;
  onView?: () => void;
}

const ContentCard = ({ item, onView }: ContentCardProps) => {
  const { toggleFavorite, favorites, addToPlaylist, playlist } = useContentStore();
  const isFav = favorites.includes(item.id);
  const inPlaylist = playlist.includes(item.id);
  const navigate = useNavigate();
  const { ref, isVisible } = useLazyLoad();
  const [tapped, setTapped] = useState(false);

  const handleView = () => {
    if (onView) onView();
    else navigate(`/viewer/${item.id}`);
  };

  const handleTap = (e: React.MouseEvent) => {
    // On mobile (no hover) first tap reveals description, second navigates
    if (window.matchMedia("(hover: none)").matches && !tapped) {
      e.stopPropagation();
      setTapped(true);
      return;
    }
    handleView();
  };

  return (
    <div ref={ref} className="min-h-[280px] relative">
      {isVisible ? (
        <div
          className="card-3d group/card relative rounded-lg bg-card border border-border cursor-pointer h-full transition-all duration-300 hover:z-30 hover:scale-[1.06] hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/40"
          onClick={handleView}
        >
          <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
              <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm">
                <Play className="w-6 h-6 text-primary-foreground ml-1" />
              </div>
            </div>
            <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
              <button
                onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                className={`p-1.5 rounded-full backdrop-blur-sm transition-colors ${isFav ? "bg-primary text-primary-foreground" : "bg-background/50 text-foreground hover:bg-background/80"}`}
              >
                <Heart className="w-4 h-4" fill={isFav ? "currentColor" : "none"} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); addToPlaylist(item.id); }}
                className={`p-1.5 rounded-full backdrop-blur-sm transition-colors ${inPlaylist ? "bg-accent text-accent-foreground" : "bg-background/50 text-foreground hover:bg-background/80"}`}
              >
                {inPlaylist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
            </div>
            <span className="absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/80 text-primary-foreground backdrop-blur-sm">
              {item.type}
            </span>
          </div>
          <div className="p-3 relative">
            <h3 className="font-heading font-semibold text-sm text-foreground truncate group-hover/card:text-primary transition-colors">{item.title}</h3>
            {/* Collapsed description */}
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 group-hover/card:hidden">
              {item.description}
            </p>
            {/* Expanded description on hover */}
            <div className="hidden group-hover/card:block">
              <p className="text-xs text-foreground/90 mt-1 leading-relaxed max-h-48 overflow-y-auto pr-1">
                {item.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {(item.tags || []).slice(0, 3).map(tag => (
                <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded-full ${getTagColor(tag)}`}>{tag}</span>
              ))}
              {item.tags && item.tags.length > 3 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground hidden group-hover/card:inline-flex">
                  +{item.tags.length - 3}
                </span>
              )}
            </div>
            {(item.meta?.duration || item.meta?.author) && (
              <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1.5 flex-wrap">
                {item.meta.duration && <span>{item.meta.duration}</span>}
                {item.meta.duration && item.meta.author && <span>·</span>}
                {item.meta.author && <span className="truncate">{item.meta.author}</span>}
              </p>
            )}
            {/* Extra meta only visible on hover */}
            <div className="hidden group-hover/card:flex flex-col gap-1 mt-2 pt-2 border-t border-border/40 text-[10px] text-muted-foreground">
              {item.meta?.date_added && <span>📅 {item.meta.date_added}</span>}
              {item.embed?.provider && <span>🎬 {item.embed.provider}</span>}
              <span className="opacity-60">ID: {item.id}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-card/50 border border-border animate-pulse h-full min-h-[280px]" />
      )}
    </div>
  );
};

export default ContentCard;
