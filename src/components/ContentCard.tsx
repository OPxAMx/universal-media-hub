import { ContentItem } from "@/types/content";
import { Heart, Play, Plus } from "lucide-react";
import { useContentStore } from "@/store/contentStore";
import { getTagColor } from "@/lib/colors";
import { useNavigate } from "react-router-dom";

interface ContentCardProps {
  item: ContentItem;
  onView?: () => void;
}

const ContentCard = ({ item, onView }: ContentCardProps) => {
  const { toggleFavorite, favorites, addToPlaylist } = useContentStore();
  const isFav = favorites.includes(item.id);
  const navigate = useNavigate();

  const handleView = () => {
    if (onView) onView();
    else navigate(`/viewer/${item.id}`);
  };

  return (
    <div className="card-3d group relative overflow-hidden rounded-lg bg-card border border-border cursor-pointer" onClick={handleView}>
      <div className="relative aspect-video overflow-hidden">
        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm">
            <Play className="w-6 h-6 text-primary-foreground ml-1" />
          </div>
        </div>
        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }} className={`p-1.5 rounded-full backdrop-blur-sm transition-colors ${isFav ? "bg-primary text-primary-foreground" : "bg-background/50 text-foreground hover:bg-background/80"}`}>
            <Heart className="w-4 h-4" fill={isFav ? "currentColor" : "none"} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); addToPlaylist(item.id); }} className="p-1.5 rounded-full bg-background/50 text-foreground hover:bg-background/80 backdrop-blur-sm transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <span className="absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/80 text-primary-foreground backdrop-blur-sm">
          {item.type}
        </span>
      </div>
      <div className="p-3">
        <h3 className="font-heading font-semibold text-sm text-foreground truncate">{item.title}</h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {item.tags.slice(0, 3).map(tag => (
            <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded-full ${getTagColor(tag)}`}>{tag}</span>
          ))}
        </div>
        {item.meta.duration && (
          <p className="text-[10px] text-muted-foreground mt-2">{item.meta.duration} · {item.meta.author}</p>
        )}
      </div>
    </div>
  );
};

export default ContentCard;
