import { ContentItem } from "@/types/content";
import { Heart, Plus, Check, Star, Film } from "lucide-react";
import { useContentStore } from "@/store/contentStore";
import { useNavigate } from "react-router-dom";
import { extractYear, visibleTags } from "@/lib/cardHelpers";
import { useEffect, useRef, useState } from "react";
import TrailerPreview from "./TrailerPreview";

interface Props { item: ContentItem }

/**
 * Netflix/Prime-style horizontal (16:9) hero card.
 * - Background image
 * - After 5s hover: play trailer video in background (if available)
 * - "See Preview" button opens trailer modal
 */
const HorizontalCard = ({ item }: Props) => {
  const { toggleFavorite, favorites, addToPlaylist, playlist } = useContentStore();
  const navigate = useNavigate();
  const isFav = favorites.includes(item.id);
  const inPlaylist = playlist.includes(item.id);
  const year = extractYear(item);
  const rating = item.meta?.vote_average;
  const trailerKey = item.meta?.trailer_key;

  const [showTrailerBg, setShowTrailerBg] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const timerRef = useRef<number | null>(null);

  const startHover = () => {
    if (!trailerKey || showTrailerBg) return;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setShowTrailerBg(true), 5000);
  };
  const endHover = () => {
    if (timerRef.current) { window.clearTimeout(timerRef.current); timerRef.current = null; }
    setShowTrailerBg(false);
  };
  useEffect(() => () => { if (timerRef.current) window.clearTimeout(timerRef.current); }, []);

  const bg = item.meta?.backdrop || item.thumbnail;

  return (
    <article
      onClick={() => navigate(`/viewer/${item.id}`)}
      onMouseEnter={startHover}
      onMouseLeave={endHover}
      className="movie-card-h group/hc relative overflow-hidden rounded-xl cursor-pointer bg-black text-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]"
      style={{ aspectRatio: "16 / 9" }}
    >
      <img
        src={bg}
        alt={item.title}
        loading="lazy"
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover/hc:scale-105 ${showTrailerBg ? "opacity-0" : "opacity-100"}`}
      />
      {showTrailerBg && trailerKey && (
        <iframe
          className="absolute inset-0 w-full h-full pointer-events-none"
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}&modestbranding=1&rel=0`}
          title={`${item.title} trailer`}
          allow="autoplay; encrypted-media"
        />
      )}
      {/* Bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      {/* Corner overlay */}
      <div
        className="absolute inset-0 opacity-70 mix-blend-overlay pointer-events-none"
        style={{ background: "radial-gradient(circle at 80% -50%, transparent 60%, rgba(0,0,0,0.6))" }}
      />

      {/* Rating badge — always visible */}
      {typeof rating === "number" && (
        <span className="absolute top-2 right-2 z-20 inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full bg-black/80 text-yellow-400 border border-yellow-400/30 shadow-sm backdrop-blur-sm">
          <span className="leading-none">⭐</span>
          {rating.toFixed(1)}
        </span>
      )}

      {/* Content */}
      <div
        className="absolute left-0 right-0 bottom-0 p-4 sm:p-6 transition-transform duration-700 ease-in-out"
        style={{
          transform: "translateY(calc(100% - 5.5em))",
        }}
        data-content
      >

        {item.meta?.logo ? (
          <img
            src={item.meta.logo}
            alt={item.title}
            loading="lazy"
            className="max-h-16 sm:max-h-20 w-auto max-w-[70%] object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
          />
        ) : (
          <h3 className="font-heading font-bold text-lg sm:text-2xl leading-tight line-clamp-1">
            {item.title}
          </h3>
        )}
        <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-white/85">
          {typeof rating === "number" && (
            <span className="inline-flex items-center gap-1 text-primary font-semibold">
              <Star className="w-3.5 h-3.5" fill="currentColor" />
              {rating.toFixed(1)}
            </span>
          )}
          {year && <><span>·</span><span>{year}</span></>}
          {item.meta?.duration && <><span>·</span><span>{item.meta.duration}</span></>}
        </div>

        <p
          className="text-xs sm:text-sm text-white/85 mt-2 line-clamp-3 opacity-0 translate-y-3 group-hover/hc:opacity-100 group-hover/hc:translate-y-0 transition-all duration-500"
          style={{ transitionDelay: "120ms" }}
        >
          {item.description}
        </p>

        <div className="flex gap-2 mt-3 opacity-0 group-hover/hc:opacity-100 translate-y-2 group-hover/hc:translate-y-0 transition-all duration-500" style={{ transitionDelay: "200ms" }}>
          <button
            onClick={e => { e.stopPropagation(); toggleFavorite(item.id); }}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 ${isFav ? "bg-primary" : "bg-black/50 hover:bg-black/80"}`}
            aria-label="Favori"
          >
            <Heart className="w-4 h-4" fill={isFav ? "currentColor" : "none"} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); addToPlaylist(item.id); }}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 ${inPlaylist ? "bg-primary" : "bg-black/50 hover:bg-black/80"}`}
            aria-label="Playlist"
          >
            {inPlaylist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
          {trailerKey && (
            <button
              onClick={e => { e.stopPropagation(); setPreviewOpen(true); }}
              className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground text-[11px] font-semibold backdrop-blur-sm border border-white/30"
            >
              <Film className="w-3.5 h-3.5" /> See Preview
            </button>
          )}
          {visibleTags(item.tags).slice(0, 2).map(t => (
            <span key={t} className="hidden sm:inline-flex items-center px-2.5 h-9 rounded-full bg-white/10 border border-white/20 text-[11px]">{t}</span>
          ))}
        </div>
      </div>

      <style>{`
        .movie-card-h:hover [data-content] { transform: translateY(0) !important; }
      `}</style>
      {trailerKey && (
        <TrailerPreview
          trailerKey={previewOpen ? trailerKey : null}
          title={item.title}
          onOpenChange={(o) => setPreviewOpen(o)}
        />
      )}
    </article>
  );
};

export default HorizontalCard;
