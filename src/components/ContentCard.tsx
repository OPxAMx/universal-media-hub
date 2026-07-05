import { ContentItem } from "@/types/content";
import { Heart, Play, Plus, Check, Calendar, Film } from "lucide-react";
import { useContentStore } from "@/store/contentStore";
import { useNavigate } from "react-router-dom";
import { useLazyLoad } from "@/hooks/use-lazy-load";
import { extractYear, visibleTags } from "@/lib/cardHelpers";
import { useState } from "react";
import TrailerPreview from "./TrailerPreview";


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
  const [previewOpen, setPreviewOpen] = useState(false);
  const trailerKey = item.meta?.trailer_key;

  const handleView = () => {
    if (onView) onView();
    else navigate(`/viewer/${item.id}`);
  };

  return (
    <div ref={ref} className="min-h-[280px] relative">
      {isVisible ? (
        <div
          className="card-3d group/card relative rounded-sm bg-card cursor-pointer h-full overflow-hidden"
          onClick={handleView}
        >
          <div className="relative aspect-[2/3] overflow-hidden">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Netflix-style bottom gradient + info on hover */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

            {/* Play icon center on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                <Play className="w-6 h-6 text-black ml-1" fill="currentColor" />
              </div>
            </div>

            {/* Action buttons */}
            <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 z-20">
              <button
                onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                className={`p-1.5 rounded-full backdrop-blur-sm border border-white/30 transition-colors ${isFav ? "bg-primary text-white" : "bg-black/60 text-white hover:bg-black/80"}`}
              >
                <Heart className="w-4 h-4" fill={isFav ? "currentColor" : "none"} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); addToPlaylist(item.id); }}
                className={`p-1.5 rounded-full backdrop-blur-sm border border-white/30 transition-colors ${inPlaylist ? "bg-primary text-white" : "bg-black/60 text-white hover:bg-black/80"}`}
              >
                {inPlaylist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
            </div>

            {/* Type badge - Netflix red */}
            {/* Type badge - Netflix red */}
            <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-primary text-white z-10">
              {item.type}
            </span>

            {/* Rating badge */}
            {typeof item.meta?.vote_average === "number" && (
              <span className="absolute bottom-2 left-2 z-10 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-black/80 text-yellow-400 border border-yellow-400/30 shadow-sm backdrop-blur-sm">
                <span className="leading-none">⭐</span>
                {item.meta.vote_average.toFixed(1)}
              </span>
            )}

            {/* Bottom title + description overlay on hover */}
            <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
              <h4 className="font-heading font-bold text-sm text-white mb-1 line-clamp-1">{item.title}</h4>
              <p className="text-[11px] text-white/80 leading-snug line-clamp-3">
                {item.description || ""}
              </p>
            </div>
          </div>
          <div className="p-3">
            <h3 className="font-heading font-semibold text-sm text-foreground truncate">{item.title}</h3>
            <div className="flex flex-wrap gap-1 mt-2">
              {extractYear(item) && (
                <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-sm bg-primary/15 text-primary font-semibold">
                  <Calendar className="w-2.5 h-2.5" />
                  {extractYear(item)}
                </span>
              )}
              {visibleTags(item.tags).slice(0, 2).map(tag => (
                <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-sm bg-secondary text-secondary-foreground">{tag}</span>
              ))}
            </div>
            {(item.meta?.duration || item.meta?.author) && (
              <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1.5 flex-wrap">
                {item.meta.duration && <span>{item.meta.duration}</span>}
                {item.meta.duration && item.meta.author && <span>·</span>}
                {item.meta.author && <span className="truncate">{item.meta.author}</span>}
              </p>
            {trailerKey && (
              <button
                onClick={(e) => { e.stopPropagation(); setPreviewOpen(true); }}
                className="mt-3 w-full inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold px-2 py-1.5 rounded-sm bg-primary/15 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Film className="w-3 h-3" /> See Preview
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-sm bg-card/50 animate-pulse h-full min-h-[280px]" />
      )}
      {trailerKey && previewOpen && (
        <TrailerPreview
          trailerKey={previewOpen ? trailerKey : null}
          title={item.title}
          onOpenChange={(o) => setPreviewOpen(o)}
        />
      )}
    </div>
  );
};

export default ContentCard;
