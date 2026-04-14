import ContentCard from "./ContentCard";
import { ContentItem } from "@/types/content";

interface ContentGridProps {
  items: ContentItem[];
  title?: string;
}

const ContentGrid = ({ items, title }: ContentGridProps) => {
  if (!items.length) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Aucun contenu trouvé</p>
      </div>
    );
  }

  return (
    <section>
      {title && <h2 className="font-heading text-xl font-bold text-foreground mb-4">{title}</h2>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {items.map((item, i) => (
          <div key={item.id} className="fade-up" style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}>
            <ContentCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContentGrid;
