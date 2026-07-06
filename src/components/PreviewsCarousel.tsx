import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Info, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ContentItem } from "@/types/content";

interface Props {
  items: ContentItem[];
  providerName: string;
  providerLogo?: string;
}

/** "Previews for you" style carousel: big trailer + description card. */
const PreviewsCarousel = ({ items, providerName, providerLogo }: Props) => {
  const navigate = useNavigate();
  const withTrailers = useMemo(() => {
    const trailered = items.filter(i => i.meta?.trailer_key);
    return (trailered.length ? trailered : items).slice(0, 20);
  }, [items]);

  const [idx, setIdx] = useState(0);
  const [muted, setMuted] = useState(true);

  if (withTrailers.length === 0) return null;

  const current = withTrailers[idx];
  const trailerKey = current.meta?.trailer_key;
  const rating = current.meta?.vote_average;
  const genres = Array.isArray(current.meta?.genres) ? current.meta!.genres : [];

  const prev = () => setIdx(i => (i - 1 + withTrailers.length) % withTrailers.length);
  const next = () => setIdx(i => (i + 1) % withTrailers.length);

  return (
    <section className="relative">
      <div className="flex items-center gap-2 mb-3">
        {providerLogo && <img src={providerLogo} alt={providerName} className="h-6 object-contain" />}
        <h2 className="font-heading text-xl font-bold text-foreground">Previews for you</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">Selected for you based on your viewing</p>

      <div className="relative group/preview rounded-2xl overflow-hidden bg-black shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          {/* Left: info panel */}
          <div className="relative p-6 md:p-8 flex flex-col justify-center min-h-[280px] bg-gradient-to-br from-black via-black/95 to-black/70">
            {current.thumbnail && (
              <img
                src={current.thumbnail}
                alt=""
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover opacity-30 blur-xl scale-110"
              />
            )}
            <div className="relative z-10 space-y-4">
              <h3 className="font-heading font-bold text-white text-3xl md:text-4xl leading-tight drop-shadow-lg">
                {current.title}
              </h3>
              <p className="text-white/90 text-sm md:text-base line-clamp-5 drop-shadow">
                {current.description}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => navigate(`/viewer/${current.id}`)}
                  aria-label="Détails"
                  className="w-10 h-10 rounded-full border-2 border-white/70 flex items-center justify-center text-white hover:bg-white/10 transition"
                >
                  <Info className="w-4 h-4" />
                </button>
                {typeof rating === "number" && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded bg-yellow-400/20 text-yellow-300 border border-yellow-400/40">
                    ⭐ {rating.toFixed(1)}
                  </span>
                )}
                {genres.slice(0, 2).map(g => (
                  <span key={g} className="text-white/80 text-sm">{g}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: trailer */}
          <div className="relative bg-black aspect-video md:aspect-auto min-h-[280px]">
            {trailerKey ? (
              <iframe
                key={trailerKey}
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&loop=1&playlist=${trailerKey}&modestbranding=1&rel=0`}
                title={`${current.title} trailer`}
                allow="autoplay; encrypted-media"
              />
            ) : (
              <img
                src={current.meta?.backdrop || current.thumbnail}
                alt={current.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Controls */}
            <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
              <button
                onClick={() => setMuted(m => !m)}
                aria-label={muted ? "Activer le son" : "Couper le son"}
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 border border-white/30 text-white flex items-center justify-center backdrop-blur-sm"
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => navigate(`/viewer/${current.id}`)}
                aria-label="Plein écran"
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 border border-white/30 text-white flex items-center justify-center backdrop-blur-sm"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          aria-label="Précédent"
          className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition z-20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={next}
          aria-label="Suivant"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition z-20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Thumbnails strip */}
      <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
        {withTrailers.map((it, i) => (
          <button
            key={it.id}
            onClick={() => setIdx(i)}
            className={`flex-none w-28 aspect-video rounded-md overflow-hidden border-2 transition ${
              i === idx ? "border-primary scale-105" : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <img src={it.meta?.backdrop || it.thumbnail} alt={it.title} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </section>
  );
};

export default PreviewsCarousel;
