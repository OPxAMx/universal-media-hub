import Layout from "@/components/Layout";
import ContentCard from "@/components/ContentCard";
import { useContentStore } from "@/store/contentStore";
import { Film, Tv, Music, Mic, Code, Image, ChevronLeft, ChevronRight, Clock, AlertTriangle } from "lucide-react";
import { useMemo, useRef, useEffect, useState } from "react";

const stats = [
  { type: "film", label: "Films", icon: <Film className="w-5 h-5" /> },
  { type: "series", label: "Séries", icon: <Tv className="w-5 h-5" /> },
  { type: "music", label: "Musique", icon: <Music className="w-5 h-5" /> },
  { type: "podcast", label: "Podcasts", icon: <Mic className="w-5 h-5" /> },
  { type: "codepen", label: "Code", icon: <Code className="w-5 h-5" /> },
  { type: "gallery", label: "Galerie", icon: <Image className="w-5 h-5" /> },
];

// Animated counter component
const AnimatedCounter = ({ target }: { target: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const duration = 1500;
        const step = (timestamp: number) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          setCount(Math.floor(progress * target));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

// Horizontal carousel component
const Carousel = ({ title, items, icon }: { title: string; items: any[]; icon: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <section className="relative group/carousel">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-primary">{icon}</div>
        <h2 className="font-heading text-xl font-bold text-foreground">{title}</h2>
        <span className="text-sm text-muted-foreground">({items.length})</span>
      </div>
      <div className="relative">
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
          {items.slice(0, 20).map(item => (
            <div key={item.id} className="min-w-[200px] max-w-[200px] snap-start flex-shrink-0">
              <ContentCard item={item} />
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-[5]" />
        <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-[5]" />
      </div>
    </section>
  );
};

const Index = () => {
  const { items, filteredItems, favorites, history, searchQuery, activeType, activeTags, filterId, filterDateFrom, filterDateTo, sortKey } = useContentStore();
  const filtered = filteredItems();

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    items.forEach(i => { map[i.type] = (map[i.type] || 0) + 1; });
    return map;
  }, [items]);

  const byType = useMemo(() => {
    const map: Record<string, any[]> = {};
    items.forEach(i => { (map[i.type] = map[i.type] || []).push(i); });
    return map;
  }, [items]);

  const recentHistory = useMemo(() => {
    const recent = [...history].reverse().slice(0, 12);
    return recent.map(h => items.find(i => i.id === h.id)).filter(Boolean);
  }, [history, items]);

  const recentlyAdded = useMemo(() => [...items].reverse().slice(0, 20), [items]);

  const totalTags = useMemo(() => new Set(items.flatMap(i => i.tags)).size, [items]);
  const totalProviders = useMemo(() => new Set(items.map(i => i.embed.provider)).size, [items]);

  const isFiltering = !!(searchQuery || activeType || activeTags.length || filterId || filterDateFrom || filterDateTo || sortKey !== "none");

  return (
    <Layout>
      <div className="space-y-12">
        {isSearching ? (
          <div className="space-y-6">
            <h2 className="font-heading text-xl font-bold text-foreground">
              Résultats pour "{searchQuery}" ({filtered.length})
            </h2>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {filtered.map((item, i) => (
                  <div key={item.id} className="fade-up" style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}>
                    <ContentCard item={item} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">Aucun contenu trouvé</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* HERO CINEMATIC */}
            <section className="relative text-center py-20 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/15 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[150px]" />
              </div>
              <div className="relative z-10">
                <div className="inline-block mb-6">
                  <div
                    className="w-24 h-24 mx-auto rounded-2xl flex items-center justify-center text-3xl font-bold font-heading text-primary-foreground relative"
                    style={{
                      background: "linear-gradient(135deg, hsl(350 80% 55%), hsl(260 60% 55%))",
                      boxShadow: "0 20px 60px hsl(350 80% 55% / 0.3), 0 0 80px hsl(260 60% 55% / 0.15), inset 0 1px 0 hsl(0 0% 100% / 0.2)",
                      transform: "perspective(800px) rotateY(-5deg) rotateX(5deg)",
                    }}
                  >
                    UEM
                    <div className="absolute inset-0 rounded-2xl" style={{
                      background: "linear-gradient(135deg, hsl(0 0% 100% / 0.15), transparent 50%)",
                    }} />
                  </div>
                </div>
                <h1 className="font-heading text-5xl md:text-6xl font-bold gradient-text mb-4">Universal Embed Manager</h1>
                <p className="text-muted-foreground max-w-xl mx-auto text-lg">Gérez, classez et partagez tous vos contenus multimédia en un seul endroit.</p>
              </div>
            </section>

            {/* STATS TICKER */}
            <section className="relative overflow-hidden py-4">
              <div className="stats-ticker flex gap-8">
                {[...Array(2)].map((_, loop) => (
                  <div key={loop} className="flex gap-8 shrink-0 stats-ticker-inner">
                    <StatChip label="Contenus" value={items.length} />
                    {stats.map(s => (
                      <StatChip key={s.type + loop} label={s.label} value={counts[s.type] || 0} icon={s.icon} />
                    ))}
                    <StatChip label="Favoris" value={favorites.length} />
                    <StatChip label="Tags" value={totalTags} />
                    <StatChip label="Providers" value={totalProviders} />
                  </div>
                ))}
              </div>
            </section>

            {/* RECENTLY ADDED */}
            <Carousel title="Récemment Ajouté" items={recentlyAdded} icon={<Clock className="w-5 h-5" />} />

            {/* RECENT HISTORY */}
            {recentHistory.length > 0 && (
              <section className="relative rounded-2xl p-6 overflow-hidden" style={{
                background: "linear-gradient(145deg, hsl(260 30% 12% / 0.6), hsl(220 18% 8% / 0.8))",
                border: "1px solid hsl(260 40% 30% / 0.3)",
                boxShadow: "0 0 80px hsl(260 60% 55% / 0.08), inset 0 1px 0 hsl(0 0% 100% / 0.03)",
              }}>
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent/8 rounded-full blur-[100px]" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-[80px]" />
                </div>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4 relative z-10">🕒 Historique Récent</h2>
                <div className="flex gap-4 overflow-x-auto pb-2 relative z-10" style={{ scrollbarWidth: "none" }}>
                  {recentHistory.map(item => item && (
                    <div key={item.id} className="min-w-[180px] max-w-[180px] flex-shrink-0">
                      <ContentCard item={item} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CAROUSELS per type */}
            {stats.map(s => (
              <Carousel key={s.type} title={s.label} items={byType[s.type] || []} icon={s.icon} />
            ))}
          </>
        )}

        {/* FOOTER */}
        <footer className="relative mt-16 pt-8 pb-6 border-t border-border/30">
          <div className="flex items-start gap-3 p-5 rounded-xl" style={{
            background: "linear-gradient(135deg, hsl(220 18% 10% / 0.6), hsl(220 18% 8% / 0.8))",
            border: "1px solid hsl(220 14% 20% / 0.4)",
          }}>
            <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Avertissement légal</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                UEM n'héberge aucun fichier sur ses serveurs. Nous fournissons uniquement des liens vers des services externes.
                Nous ne sommes pas responsables du contenu hébergé par ces services tiers.
                En cas de problème avec la justice, veuillez contacter directement les hébergeurs des contenus concernés.
              </p>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">© {new Date().getFullYear()} Universal Embed Manager</p>
        </footer>
      </div>
    </Layout>
  );
};

// Stat chip for the ticker
const StatChip = ({ label, value, icon }: { label: string; value: number; icon?: React.ReactNode }) => (
  <div className="flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap group/stat cursor-default transition-all duration-300 hover:scale-105"
    style={{
      background: "linear-gradient(135deg, hsl(220 18% 12% / 0.7), hsl(220 18% 8% / 0.8))",
      border: "1px solid hsl(220 14% 22% / 0.5)",
      boxShadow: "0 4px 20px hsl(0 0% 0% / 0.2)",
    }}
  >
    {icon && <span className="text-primary group-hover/stat:text-accent transition-colors">{icon}</span>}
    <span className="font-heading font-bold text-foreground text-lg group-hover/stat:text-primary transition-colors">
      <AnimatedCounter target={value} />
    </span>
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);

export default Index;
