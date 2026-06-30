import { useMemo } from "react";
import Layout from "@/components/Layout";
import CollectionsSection from "@/components/CollectionsSection";
import ContentCard from "@/components/ContentCard";
import { useContentStore } from "@/store/contentStore";
import { visibleTags } from "@/lib/cardHelpers";
import { Layers, FolderHeart } from "lucide-react";

const GenresCollectionsPage = () => {
  const items = useContentStore(s => s.items);

  // Group films & series by detected genre tags.
  const byGenre = useMemo(() => {
    const map: Record<string, typeof items> = {};
    const relevant = items.filter(i => i.type === "film" || i.type === "series");
    for (const it of relevant) {
      const genres = visibleTags(it.tags).filter(t => !/^(19|20)\d{2}$/.test(t));
      for (const g of genres) {
        (map[g] = map[g] || []).push(it);
      }
    }
    // Keep only genres with at least 3 items, sort by popularity.
    return Object.entries(map)
      .filter(([, list]) => list.length >= 3)
      .sort((a, b) => b[1].length - a[1].length);
  }, [items]);

  return (
    <Layout>
      <div className="space-y-12">
        {/* GENRES */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Layers className="w-6 h-6 text-primary" />
            <h2 className="font-heading text-2xl font-bold text-foreground">Genres</h2>
            <span className="text-sm text-muted-foreground">({byGenre.length})</span>
          </div>

          {byGenre.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun genre détecté dans la bibliothèque.</p>
          ) : (
            <div className="space-y-10">
              {byGenre.map(([genre, list]) => (
                <div key={genre}>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-3">
                    {genre} <span className="text-xs text-muted-foreground font-normal">({list.length})</span>
                  </h3>
                  <div className="flex gap-4 overflow-x-auto pb-3 snap-x scrollbar-hide" style={{ scrollbarWidth: "none" }}>
                    {list.slice(0, 20).map(item => (
                      <div key={item.id} className="min-w-[180px] max-w-[180px] snap-start flex-shrink-0">
                        <ContentCard item={item} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* COLLECTIONS */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <FolderHeart className="w-6 h-6 text-primary" />
            <h2 className="font-heading text-2xl font-bold text-foreground">Collections</h2>
          </div>
          <CollectionsSection />
        </section>
      </div>
    </Layout>
  );
};

export default GenresCollectionsPage;
