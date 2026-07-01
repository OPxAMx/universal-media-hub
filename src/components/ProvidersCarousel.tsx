import { useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight, Tv } from "lucide-react";
import { useContentStore } from "@/store/contentStore";

interface Provider {
  key: string;
  name: string;
  /** Aliases used to detect this provider in item metadata. */
  aliases: string[];
  logo: string;
  video: string;
}

const PROVIDERS: Provider[] = [
  { key: "netflix", name: "Netflix", aliases: ["netflix"], logo: "https://u.cubeupload.com/mystic/8df6ce62504c1ab31aab.png", video: "https://media.tenor.com/hd7jyV_dMS8AAAPo/netflix-media-services-provider.mp4" },
  { key: "prime", name: "Prime Video", aliases: ["prime video", "amazon"], logo: "https://u.cubeupload.com/mystic/b222691607d658c2fa52.png", video: "https://media.tenor.com/T7L_NCdPIvAAAAPo/prime-video.mp4" },
  { key: "paramount", name: "Paramount+", aliases: ["paramount"], logo: "https://u.cubeupload.com/mystic/35734306149c1a6eb0a9.png", video: "https://media4.giphy.com/media/qCEXQzkScYOBIRusVA/giphy.mp4" },
  { key: "disney", name: "Disney+", aliases: ["disney"], logo: "https://u.cubeupload.com/mystic/c40fe782c450e170eea6.png", video: "https://media.tenor.com/h6-0yzk8pbAAAAPo/disney-disney-plus.mp4" },
  { key: "marvel", name: "Marvel Studios", aliases: ["marvel"], logo: "https://u.cubeupload.com/mystic/hUzeosd33nzE5MCNsZxC.png", video: "https://i.giphy.com/media/vBjLa5DQwwxbi/giphy.mp4" },
  { key: "apple", name: "Apple TV+", aliases: ["apple tv", "apple studios"], logo: "https://u.cubeupload.com/mystic/b2fb6956993e2ee5b4e3.png", video: "https://media.tenor.com/Oxl9xEn7kTEAAAPo/applo-tv.mp4" },
  { key: "warner", name: "Warner Bros", aliases: ["warner"], logo: "https://u.cubeupload.com/mystic/ky0xOc5OrhzkZ1N6KyUx.png", video: "https://i.giphy.com/media/3o7TKt3pMpzozdUsus/giphy.mp4" },
  { key: "dc", name: "DC Comics", aliases: ["dc comics", "dc entertainment", "dc studios"], logo: "https://u.cubeupload.com/mystic/2Tc1P3Ac8M479naPp1kY.png", video: "https://media.tenor.com/ag74wyAzYkMAAAPo/dc-comics-dceu.mp4" },
  { key: "hbo", name: "HBO Max", aliases: ["hbo", "max"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/HBO_Max_%282025%29.svg/250px-HBO_Max_%282025%29.svg.png", video: "https://media.tenor.com/7xmvr-fKGLMAAAAd/hbo-max-warner-bros-pictures.gif" },
];

const buildHaystack = (item: any): string => {
  const pc = item.meta?.production_companies;
  const pcStr = Array.isArray(pc) ? pc.join(" ") : (pc || "");
  const networks = item.meta?.networks;
  const nwStr = Array.isArray(networks) ? networks.join(" ") : (networks || "");
  return [
    pcStr,
    nwStr,
    item.embed?.provider || "",
    (item.tags || []).join(" "),
  ].join(" ").toLowerCase();
};

const ProvidersCarousel = () => {
  const { items, setSearchQuery } = useContentStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    const relevant = items.filter(i => i.type === "film" || i.type === "series");
    for (const p of PROVIDERS) map[p.key] = 0;
    for (const item of relevant) {
      const hay = buildHaystack(item);
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
    setSearchQuery(p.name);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
