import { ContentItem } from "@/types/content";
import { X, Heart, ExternalLink, ListPlus, Star, Languages, Pencil, Calendar, Clock, User, Tag, Info, Globe, Building2, Users, Megaphone, Clapperboard } from "lucide-react";
import { useContentStore } from "@/store/contentStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const toList = (v: unknown): string[] => {
  if (!v) return [];
  if (Array.isArray(v)) return v.map(x => (typeof x === "string" ? x : (x as any)?.name || "")).filter(Boolean);
  if (typeof v === "string") return v.split(/[,;]\s*/).filter(Boolean);
  return [];
};

interface EmbedViewerProps {
  item: ContentItem;
  onClose: () => void;
}

const EmbedViewer = ({ item, onClose }: EmbedViewerProps) => {
  const { toggleFavorite, favorites, addToPlaylist } = useContentStore();
  const navigate = useNavigate();
  const isFav = favorites.includes(item.id);
  const hasFr = !!(item.embed.iframe_fr || item.embed.url_fr);
  const [lang, setLang] = useState<"en" | "fr">("en");

  const handleEdit = () => {
    navigate(`/editor/${item.id}`);
  };

  const getEmbedSrc = () => {
    const iframe = lang === "fr" && item.embed.iframe_fr ? item.embed.iframe_fr : item.embed.iframe;
    const fallbackUrl = lang === "fr" && item.embed.url_fr ? item.embed.url_fr : item.embed.url;
    const match = iframe?.match(/src="([^"]+)"/);
    return match ? match[1] : fallbackUrl || "";
  };

  const backdrop = item.meta?.backdrop;
  const vote = item.meta?.vote_average;
  const cast = toList(item.meta?.cast);
  const producers = toList(item.meta?.producers);
  const companies = toList(item.meta?.production_companies);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/90 backdrop-blur-xl overflow-y-auto py-6" onClick={onClose}>
      {/* Backdrop image (low opacity) */}
      {backdrop && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("${backdrop}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.18,
            filter: "blur(2px)",
          }}
        />
      )}
      {/* Ambient glow background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-accent/10 rounded-full blur-[100px]" />
      </div>

      <div
        className="relative w-full max-w-5xl mx-4 rounded-2xl overflow-hidden modal-cinematic my-auto"
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
            {hasFr && (
              <button
                onClick={() => setLang(lang === "en" ? "fr" : "en")}
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-secondary/50 hover:bg-secondary text-foreground border border-border/40 flex items-center gap-1.5 transition-colors"
                title="Changer de langue"
              >
                <Languages className="w-3.5 h-3.5" />
                {lang}
              </button>
            )}
            <button
              onClick={() => toggleFavorite(item.id)}
              className={`p-2 rounded-full transition-colors ${isFav ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}
            >
              <Heart className="w-5 h-5" fill={isFav ? "currentColor" : "none"} />
            </button>
            <button
              onClick={() => addToPlaylist(item.id)}
              className="p-2 rounded-full hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
              title="Ajouter à la playlist"
            >
              <ListPlus className="w-5 h-5" />
            </button>
            <button
              onClick={handleEdit}
              className="p-2 rounded-full hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
              title="Modifier ce média"
            >
              <Pencil className="w-5 h-5" />
            </button>
            {item.embed.url && (
              <a href={item.embed.url} target="_blank" rel="noreferrer" className="p-2 rounded-full hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground" title="Ouvrir la source">
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

        {/* Title block */}
        <div className="px-5 pt-3 pb-4 text-center border-b border-border/30">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">{item.type}</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">#{item.id}</span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground tracking-wide uppercase">{item.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{item.embed.provider} · {item.meta.duration}</p>
        </div>

        {/* Detailed info card */}
        <div className="px-6 py-5 space-y-5">
          {/* Description */}
          {item.description && (
            <section>
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                <Info className="w-3.5 h-3.5" /> Synopsis
              </h3>
              <p className="text-sm text-foreground/90 leading-relaxed">{item.description}</p>
            </section>
          )}

          {/* Meta grid */}
          <section>
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              <Info className="w-3.5 h-3.5" /> Informations
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Clock, label: "Durée", value: item.meta.duration },
                { icon: User, label: "Auteur", value: item.meta.author },
                { icon: Calendar, label: "Ajouté le", value: item.meta.date_added },
                { icon: Globe, label: "Source", value: item.meta.source || item.embed.provider },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-xl p-3 bg-secondary/30 border border-border/30 backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                    <Icon className="w-3 h-3" /> {label}
                  </div>
                  <div className="text-sm font-medium text-foreground truncate">{value || "—"}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Tags */}
          {item.tags.length > 0 && (
            <section>
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                <Tag className="w-3.5 h-3.5" /> Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full bg-secondary/50 text-foreground/80 border border-border/40 backdrop-blur-sm">{tag}</span>
                ))}
              </div>
            </section>
          )}

          {/* Languages availability */}
          <section>
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              <Languages className="w-3.5 h-3.5" /> Versions disponibles
            </h3>
            <div className="flex gap-2">
              <span className="text-[11px] px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/30">EN</span>
              {hasFr ? (
                <span className="text-[11px] px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/30">FR</span>
              ) : (
                <span className="text-[11px] px-3 py-1 rounded-full bg-secondary/30 text-muted-foreground border border-border/30">FR indisponible</span>
              )}
            </div>
          </section>

          {/* Edit CTA */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              <Pencil className="w-4 h-4" /> Modifier ce média
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbedViewer;
