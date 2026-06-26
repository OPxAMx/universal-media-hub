import { useEffect, useState } from "react";
import ContentCard from "./ContentCard";
import { ContentItem } from "@/types/content";
import { useViewMode } from "@/hooks/useViewMode";
import { useNavigate } from "react-router-dom";

interface ContentGridProps {
  items: ContentItem[];
  title?: string;
}

const PAGE_SIZE = 50;

const ListRow = ({ item }: { item: ContentItem }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/viewer/${item.id}`)}
      className="flex gap-4 p-3 rounded-lg border border-border/40 bg-card/40 hover:bg-card/80 hover:border-primary/40 transition-all cursor-pointer group"
    >
      <img
        src={item.thumbnail}
        alt={item.title}
        loading="lazy"
        className="w-20 h-28 sm:w-24 sm:h-32 object-cover rounded-md flex-shrink-0 group-hover:scale-[1.02] transition-transform"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-heading font-bold text-foreground line-clamp-1">{item.title}</h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{item.description}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {item.tags.slice(0, 4).map(t => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/70 text-secondary-foreground">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

const ContentGrid = ({ items, title }: ContentGridProps) => {
  const [viewMode] = useViewMode();
  const [visible, setVisible] = useState(PAGE_SIZE);

  // Reset visible count when the filtered list changes (search/filters)
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [items]);

  if (!items.length) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Aucun contenu trouvé</p>
      </div>
    );
  }

  const shown = items.slice(0, visible);
  const remaining = items.length - shown.length;

  return (
    <section>
      {title && <h2 className="font-heading text-xl font-bold text-foreground mb-4">{title}</h2>}
      {viewMode === "list" ? (
        <div className="flex flex-col gap-3">
          {shown.map((item, i) => (
            <div key={item.id} className="fade-up" style={{ animationDelay: `${Math.min(i, 10) * 30}ms` }}>
              <ListRow item={item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {shown.map((item, i) => (
            <div key={item.id} className="fade-up" style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}>
              <ContentCard item={item} />
            </div>
          ))}
        </div>
      )}

      {remaining > 0 && (
        <div className="flex flex-col items-center gap-2 mt-8">
          <p className="text-xs text-muted-foreground">
            {shown.length} sur {items.length} affichés
          </p>
          <button
            onClick={() => setVisible(v => v + PAGE_SIZE)}
            className="px-6 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Charger {Math.min(PAGE_SIZE, remaining)} de plus
          </button>
          {remaining > PAGE_SIZE && (
            <button
              onClick={() => setVisible(items.length)}
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
            >
              Tout afficher ({remaining} restants)
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default ContentGrid;
