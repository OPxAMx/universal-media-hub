import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, X, Pencil, Play, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ContentItem } from "@/types/content";
import { useContentStore } from "@/store/contentStore";
const galleryImages: Record<string, string[]> = {};

interface GalleryViewerProps {
  gallery: ContentItem;
  onClose: () => void;
}

type Slide =
  | { kind: "image"; src: string; caption?: string }
  | { kind: "media"; item: ContentItem };

const getEmbedSrc = (item: ContentItem) => {
  const match = item.embed?.iframe?.match(/src="([^"]+)"/);
  return match ? match[1] : item.embed?.url || "";
};

const GalleryViewer = ({ gallery, onClose }: GalleryViewerProps) => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const { getItem } = useContentStore();

  const slides = useMemo<Slide[]>(() => {
    const result: Slide[] = [];
    // 1) Linked media items (any type)
    (gallery.galleryItems || []).forEach((id) => {
      const it = getItem(id);
      if (it) result.push({ kind: "media", item: it });
    });
    // 2) Legacy raw image URLs
    const legacy = galleryImages[gallery.id];
    if (legacy && legacy.length) {
      legacy.forEach((src) => result.push({ kind: "image", src }));
    }
    if (!result.length && gallery.thumbnail) {
      result.push({ kind: "image", src: gallery.thumbnail });
    }
    return result;
  }, [gallery, getItem]);

  const current = slides[index];
  const total = slides.length;

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  const renderSlide = () => {
    if (!current) return null;
    if (current.kind === "image") {
      return (
        <img
          src={current.src}
          alt={`${gallery.title} ${index + 1}`}
          className="w-full h-full object-contain bg-black"
        />
      );
    }
    const it = current.item;
    if (it.type === "gallery") {
      // Nested gallery — show its thumbnail with click to navigate
      return (
        <button
          onClick={() => navigate(`/viewer/${it.id}`)}
          className="w-full h-full relative group"
        >
          <img src={it.thumbnail} alt={it.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/60 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ImageIcon className="w-10 h-10 text-foreground" />
            <span className="text-sm font-semibold text-foreground">Ouvrir la galerie</span>
          </div>
        </button>
      );
    }
    // Embed (film, video, music, podcast, codepen, iframe, series)
    const src = getEmbedSrc(it);
    if (src) {
      return (
        <iframe
          src={src}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; encrypted-media"
          title={it.title}
        />
      );
    }
    // Fallback: thumbnail
    return <img src={it.thumbnail} alt={it.title} className="w-full h-full object-contain bg-black" />;
  };

  const captionTitle = current?.kind === "media" ? current.item.title : `${gallery.title} — ${index + 1}`;
  const captionType = current?.kind === "media" ? current.item.type : "image";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md overflow-y-auto py-6"
      onClick={onClose}
    >
      <div
        className="modal-cinematic w-full max-w-6xl mx-4 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div className="min-w-0">
            <h2 className="font-heading text-2xl font-bold text-foreground truncate">{gallery.title}</h2>
            {gallery.description && (
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{gallery.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {total ? index + 1 : 0} / {total}
            </span>
            <button
              onClick={() => navigate(`/editor/${gallery.id}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground text-xs font-semibold transition-colors"
              title="Modifier la galerie"
            >
              <Pencil className="w-3.5 h-3.5" /> Modifier
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stage */}
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted border border-border">
          {total > 0 ? renderSlide() : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              Galerie vide — ajoute des médias depuis l'éditeur.
            </div>
          )}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/70 text-foreground hover:bg-background/90 backdrop-blur-sm transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/70 text-foreground hover:bg-background/90 backdrop-blur-sm transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
          {current && (
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/90 to-transparent">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/80 text-primary-foreground">
                  {captionType}
                </span>
                <span className="text-sm font-semibold text-foreground truncate">{captionTitle}</span>
              </div>
            </div>
          )}
        </div>

        {/* Thumbnails strip */}
        {total > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {slides.map((s, i) => {
              const thumb = s.kind === "image" ? s.src : s.item.thumbnail;
              const label = s.kind === "media" ? s.item.title : `Image ${i + 1}`;
              const isVideo = s.kind === "media" && s.item.type !== "gallery";
              return (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  title={label}
                  className={`relative flex-shrink-0 w-24 h-16 rounded overflow-hidden border-2 transition-colors ${
                    i === index ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={thumb} alt="" className="w-full h-full object-cover" />
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/30">
                      <Play className="w-4 h-4 text-foreground" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryViewer;
