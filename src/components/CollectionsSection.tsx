import { Bookmark, Heart, Plus, Film, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import collections from "@/data/collections.json";
import { useContentStore } from "@/store/contentStore";

const TMDB_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NDAwODY3YWVmNGU1OWZhM2IyMjUxNWEzYmE0MzA4YiIsIm5iZiI6MTc3NjI4NDk3OS4zNjMwMDAyLCJzdWIiOiI2OWRmZjUzMzQxMzA0YTM0ZGQzOTQ4NTYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.6bfDm-Rdmk7K5-teBKkZTKmfBX-8WTN2IvZlr2OxAR0";

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
  const items = useContentStore(s => s.items);
  const setPlaylist = useContentStore(s => s.setPlaylist);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/collection/${c.id}?language=fr-FR`,
        { headers: { Authorization: `Bearer ${TMDB_TOKEN}` } }
      );
      if (!res.ok) throw new Error("TMDB error");
      const json = await res.json();
      const parts: Array<{ id: number; release_date?: string }> = json.parts || [];
      const sorted = [...parts].sort((a, b) => (a.release_date || "").localeCompare(b.release_date || ""));
      const ids = sorted.map(p => String(p.id)).filter(id => items.some(i => i.id === id));
      if (ids.length === 0) {
        toast.error(`Aucun film de "${c.title}" trouvé dans la bibliothèque. Importez d'abord AllCollection.json.`);
        return;
      }
      setPlaylist(ids);
      toast.success(`${ids.length} films chargés depuis ${c.title}`);
      navigate("/player");
    } catch (e) {
      toast.error("Impossible de charger la collection depuis TMDB.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="group relative rounded-xl overflow-hidden border border-border/50 bg-card/50 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10"
      onClick={handleClick}
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
          className="absolute inset-0 bg-background/95 backdrop-blur-sm p-4 flex flex-col justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"
        >
          <h3 className="font-heading font-bold text-foreground mb-2">{c.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-6">
            {c.description || "Aucune description disponible."}
          </p>
        </div>

        {loading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}
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
