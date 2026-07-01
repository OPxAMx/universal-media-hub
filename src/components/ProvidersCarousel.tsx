import { useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Tv } from "lucide-react";
import { useContentStore } from "@/store/contentStore";
import { PROVIDERS, buildProviderHaystack, type Provider } from "@/lib/providers";

const ProvidersCarousel = () => {
  const items = useContentStore(s => s.items);
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    const relevant = items.filter(i => i.type === "film" || i.type === "series");
    for (const p of PROVIDERS) map[p.key] = 0;
    for (const item of relevant) {
      const hay = buildProviderHaystack(item);
      for (const p of PROVIDERS) {
        if (p.aliases.some(a => hay.includes(a))) map[p.key]++;
      }
    }
    return map;
  }, [items]);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  const handleClick = (p: Provider) => {
    navigate(`/provider?id=${p.key}`);
  };

  return (
    <section className="relative group/carousel">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-primary"><Tv className="w-5 h-5" /></div>
        <h2 className="font-heading text-xl font-bold text-foreground">Rechercher par fournisseur</h2>
      </div>
      <div className="relative">
        <button
          onClick={() => scroll(-1)}
          aria-label="Précédent"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {PROVIDERS.map(p => {
            const count = counts[p.key] || 0;
            return (
              <button
                key={p.key}
                onClick={() => handleClick(p)}
                className="group/prov flex-none w-[250px] h-[150px] relative bg-white rounded-xl overflow-hidden select-none shadow-lg hover:shadow-primary/30 hover:scale-[1.02] transition-all snap-start"
              >
                <img
                  src={p.logo}
                  alt={p.name}
                  loading="lazy"
                  className="w-full h-full object-contain p-8 group-hover/prov:opacity-0 transition-opacity duration-300"
                />
                <video
                  src={p.video}
                  muted
                  loop
                  playsInline
                  autoPlay
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover/prov:opacity-100 transition-opacity duration-300"
                />
                <p className="absolute bottom-2 left-0 right-0 text-center text-white text-xs font-bold bg-black/70 py-1 px-2 mx-4 rounded-lg z-10">
                  {count.toLocaleString("fr-FR")} FILMS &amp; SÉRIES
                </p>
              </button>
            );
          })}
        </div>
        <button
          onClick={() => scroll(1)}
          aria-label="Suivant"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-[5]" />
        <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-[5]" />
      </div>
    </section>
  );
};

export default ProvidersCarousel;
