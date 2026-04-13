import { ContentItem } from "@/types/content";
import { X, Heart, ExternalLink, ListPlus } from "lucide-react";
import { useContentStore } from "@/store/contentStore";

interface EmbedViewerProps {
  item: ContentItem;
  onClose: () => void;
}

const EmbedViewer = ({ item, onClose }: EmbedViewerProps) => {
  const { toggleFavorite, favorites, addToPlaylist } = useContentStore();
  const isFav = favorites.includes(item.id);

  const getEmbedSrc = () => {
    const match = item.embed.iframe.match(/src="([^"]+)"/);
    return match ? match[1] : "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md" onClick={onClose}>
      <div className="modal-cinematic w-full max-w-5xl mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">{item.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{item.meta.author} · {item.meta.duration}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => toggleFavorite(item.id)} className={`p-2 rounded-full transition-colors ${isFav ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
              <Heart className="w-5 h-5" fill={isFav ? "currentColor" : "none"} />
            </button>
            <button onClick={() => addToPlaylist(item.id)} className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
              <ListPlus className="w-5 h-5" />
            </button>
            {item.embed.url && (
              <a href={item.embed.url} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
            <button onClick={onClose} className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted border border-border">
          <iframe src={getEmbedSrc()} className="w-full h-full" allowFullScreen allow="autoplay; encrypted-media" title={item.title} />
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">{item.description}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {item.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbedViewer;
