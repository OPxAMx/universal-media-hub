import { Bookmark, Heart, Plus, Film } from "lucide-react";
import collections from "@/data/collections.json";
import { useContentStore } from "@/store/contentStore";

interface Poster { src: string; alt: string }
interface Collection {
  id: string;
  title: string;
  cover: string;
  count: string;
  description: string;
  posters: Poster[];
  extra: number;
}

const data = collections as Collection[];

const CollectionCard = ({ c }: { c: Collection }) => {
  const [tapped, setTapped] = useState(false);

  return (
    <div
      className="group relative rounded-xl overflow-hidden border border-border/50 bg-card/50 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10"
      onClick={() => setTapped(t => !t)}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={c.cover}
          alt={c.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-lg font-bold font-heading text-foreground mb-1 line-clamp-1">{c.title}</h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Film className="w-3.5 h-3.5" />
            <span>{c.count}</span>
          </div>
        </div>

        {/* Description overlay (desktop hover / mobile tap) */}
        <div
          className={`absolute inset-0 bg-background/95 backdrop-blur-sm p-4 flex flex-col justify-center transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 ${
            tapped ? "opacity-100" : "opacity-0 pointer-events-none md:pointer-events-auto"
          }`}
        >
          <h3 className="font-heading font-bold text-foreground mb-2">{c.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-6">
            {c.description || "Aucune description disponible."}
          </p>
        </div>
      </div>

      <div className="p-3 space-y-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button className="flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-md bg-primary/15 text-primary hover:bg-primary/25 transition-colors">
            <Bookmark className="w-3 h-3" />Watchlist
          </button>
          <button className="flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-md bg-destructive/15 text-destructive hover:bg-destructive/25 transition-colors">
            <Heart className="w-3 h-3" />Favoris
          </button>
          <button className="flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/70 transition-colors">
            <Plus className="w-3 h-3" />Liste
          </button>
        </div>

        <div className="flex items-end gap-1.5">
          {c.posters.slice(0, 4).map((p, i) => (
            <div key={i} className="w-10 h-14 rounded overflow-hidden border border-border/50 hover:scale-110 transition-transform">
              <img src={p.src} alt={p.alt} loading="lazy" className="w-full h-full object-cover" />
            </div>
          ))}
          {c.extra > 0 && (
            <div className="w-10 h-14 rounded bg-secondary/60 border border-border/50 flex items-center justify-center text-[11px] text-muted-foreground">
              +{c.extra}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CollectionsSection = () => {
  return (
    <section>
      <h2 className="font-heading text-xl font-bold text-foreground mb-6 text-center md:text-left">
        Collections populaires
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        {data.map(c => <CollectionCard key={c.id} c={c} />)}
      </div>
    </section>
  );
};

export default CollectionsSection;
