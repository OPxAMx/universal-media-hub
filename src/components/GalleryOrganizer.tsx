import { useState, useMemo } from "react";
import { ContentItem } from "@/types/content";
import { useContentStore } from "@/store/contentStore";
import { ArrowDown, ArrowUp, Plus, Trash2, Search, Image as ImageIcon, Save } from "lucide-react";
import { toast } from "sonner";

interface GalleryOrganizerProps {
  gallery: ContentItem;
}

const GalleryOrganizer = ({ gallery }: GalleryOrganizerProps) => {
  const { items, updateItem } = useContentStore();
  const [ids, setIds] = useState<string[]>(gallery.galleryItems || []);
  const [query, setQuery] = useState("");

  const idSet = useMemo(() => new Set(ids), [ids]);
  const galleryItems = useMemo(
    () => ids.map((id) => items.find((i) => i.id === id)).filter(Boolean) as ContentItem[],
    [ids, items],
  );
  const candidates = useMemo(() => {
    const q = query.toLowerCase().trim();
    return items
      .filter((i) => i.id !== gallery.id && !idSet.has(i.id))
      .filter((i) => {
        if (!q) return true;
        return (
          (i.title || "").toLowerCase().includes(q) ||
          (i.id || "").toLowerCase().includes(q) ||
          i.type.includes(q) ||
          (i.tags || []).some((t) => t.toLowerCase().includes(q))
        );
      })
      .slice(0, 30);
  }, [items, query, idSet, gallery.id]);

  const add = (id: string) => setIds((s) => [...s, id]);
  const remove = (id: string) => setIds((s) => s.filter((x) => x !== id));
  const move = (i: number, dir: -1 | 1) => {
    setIds((s) => {
      const next = [...s];
      const j = i + dir;
      if (j < 0 || j >= next.length) return s;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const save = () => {
    updateItem({ ...gallery, galleryItems: ids });
    toast.success(`Galerie « ${gallery.title} » mise à jour (${ids.length} médias)`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 p-4 rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-primary" />
          <h2 className="font-heading text-lg font-bold text-foreground">Organiser la galerie</h2>
          <span className="text-xs text-muted-foreground">({ids.length} médias)</span>
        </div>
        <button
          onClick={save}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm transition-colors"
        >
          <Save className="w-4 h-4" /> Sauvegarder l'ordre
        </button>
      </div>

      {/* Current items list */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contenu de la galerie</h3>
        {galleryItems.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">Aucun média. Ajoutes-en depuis la liste ci-dessous.</p>
        ) : (
          <ul className="space-y-1.5">
            {galleryItems.map((it, i) => (
              <li
                key={it.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 border border-border"
              >
                <span className="text-xs font-mono text-muted-foreground w-6 text-right">{i + 1}.</span>
                <img src={it.thumbnail} alt="" className="w-12 h-12 rounded object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{it.title}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {it.type} · #{it.id}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="p-1.5 rounded hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed text-foreground transition-colors"
                    title="Monter"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={i === galleryItems.length - 1}
                    className="p-1.5 rounded hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed text-foreground transition-colors"
                    title="Descendre"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => remove(it.id)}
                    className="p-1.5 rounded hover:bg-destructive/20 text-destructive transition-colors"
                    title="Retirer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add picker */}
      <div className="space-y-2 pt-3 border-t border-border">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ajouter un média</h3>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un titre, un id, un type ou un tag..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
          {candidates.length === 0 ? (
            <p className="text-xs text-muted-foreground italic px-2 py-3">Aucun résultat.</p>
          ) : (
            candidates.map((it) => (
              <button
                key={it.id}
                onClick={() => add(it.id)}
                className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-secondary border border-transparent hover:border-border text-left transition-colors"
              >
                <img src={it.thumbnail} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{it.title}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {it.type} · #{it.id}
                  </div>
                </div>
                <Plus className="w-4 h-4 text-primary flex-shrink-0" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryOrganizer;
