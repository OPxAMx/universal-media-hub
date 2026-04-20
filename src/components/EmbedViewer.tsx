import { ContentItem } from "@/types/content";
import { X, Heart, ExternalLink, ListPlus, Star, Languages } from "lucide-react";
import { useContentStore } from "@/store/contentStore";
import { useState } from "react";

interface EmbedViewerProps {
  item: ContentItem;
  onClose: () => void;
}

const EmbedViewer = ({ item, onClose }: EmbedViewerProps) => {
  const { toggleFavorite, favorites, addToPlaylist } = useContentStore();
  const isFav = favorites.includes(item.id);
  const hasFr = !!(item.embed.iframe_fr || item.embed.url_fr);
  const [lang, setLang] = useState<"en" | "fr">("en");

  const getEmbedSrc = () => {
    const iframe = lang === "fr" && item.embed.iframe_fr ? item.embed.iframe_fr : item.embed.iframe;
    const fallbackUrl = lang === "fr" && item.embed.url_fr ? item.embed.url_fr : item.embed.url;
    const match = iframe?.match(/src="([^"]+)"/);
    return match ? match[1] : fallbackUrl || "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl" onClick={onClose}>
      {/* Ambient glow background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-accent/10 rounded-full blur-[100px]" />
      </div>

      <div
        className="relative w-full max-w-5xl mx-4 rounded-2xl overflow-hidden modal-cinematic"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(145deg, hsl(220 18% 12% / 0.8), hsl(220 18% 6% / 0.9))",
          border: "1px solid hsl(220 14% 22% / 0.5)",
          boxShadow: "0 0 60px hsl(350 80% 55% / 0.15), 0 0 120px hsl(260 60% 55% / 0.1), inset 0 1px 0 hsl(0 0% 100% / 0.05)",
        }}
      >
        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
          background: "linear-gradient(135deg, hsl(350 80% 55% / 0.2), transparent 40%, transparent 60%, hsl(260 60% 55% / 0.2))",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "xor",
          WebkitMaskComposite: "xor",
          padding: "1px",
          borderRadius: "1rem",
        }} />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">U</span>
            </div>
            <span className="font-heading font-bold text-foreground tracking-wide">UEM <span className="text-muted-foreground font-normal">PLAYER</span></span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground">
              <Star className="w-5 h-5" />
            </button>
            <button
              onClick={() => toggleFavorite(item.id)}
              className={`p-2 rounded-full transition-colors ${isFav ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}
            >
              <Heart className="w-5 h-5" fill={isFav ? "currentColor" : "none"} />
            </button>
            <button
              onClick={() => addToPlaylist(item.id)}
              className="p-2 rounded-full hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
            >
              <ListPlus className="w-5 h-5" />
            </button>
            {item.embed.url && (
              <a href={item.embed.url} target="_blank" rel="noreferrer" className="p-2 rounded-full hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground">
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-destructive/20 transition-colors text-muted-foreground hover:text-destructive"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video area */}
        <div className="mx-4 mb-2 rounded-xl overflow-hidden border border-border/30" style={{
          boxShadow: "inset 0 0 30px hsl(0 0% 0% / 0.3)",
        }}>
          <div className="aspect-video w-full">
            <iframe src={getEmbedSrc()} className="w-full h-full" allowFullScreen allow="autoplay; encrypted-media" title={item.title} />
          </div>
        </div>

        {/* Footer info */}
        <div className="px-5 py-4 text-center">
          <h2 className="font-heading text-xl font-bold text-foreground tracking-wide uppercase">{item.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{item.embed.provider} · {item.meta.duration}</p>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {item.tags.slice(0, 5).map(tag => (
              <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full bg-secondary/50 text-muted-foreground border border-border/30 backdrop-blur-sm">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbedViewer;
