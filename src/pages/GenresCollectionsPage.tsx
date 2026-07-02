import { useMemo, useCallback, useState, useEffect } from "react";
import Layout from "@/components/Layout";
import CollectionsSection from "@/components/CollectionsSection";
import ContentCard from "@/components/ContentCard";
import ContentGrid from "@/components/ContentGrid";
import AdvancedFilters from "@/components/AdvancedFilters";
import { useContentStore } from "@/store/contentStore";
import { visibleTags } from "@/lib/cardHelpers";
import { Layers, FolderHeart, ArrowLeft } from "lucide-react";

// Build a stable, URL-safe anchor id for a genre name.
const genreAnchor = (name: string) =>
  "genre-" + name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const GenresCollectionsPage = () => {
  const filteredItems = useContentStore(s => s.filteredItems);
  const filtered = filteredItems();
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(60);

  const byGenre = useMemo(() => {
    const map: Record<string, typeof filtered> = {};
    const relevant = filtered.filter(i => i.type === "film" || i.type === "series");
    for (const it of relevant) {
      const genres = visibleTags(it.tags).filter(t => !/^(19|20)\d{2}$/.test(t));
      for (const g of genres) {
        (map[g] = map[g] || []).push(it);
      }
    }
    return Object.entries(map)
      .filter(([, list]) => list.length >= 3)
      .sort((a, b) => b[1].length - a[1].length);
  }, [filtered]);

  const openGenre = useCallback((name: string) => {
    setSelectedGenre(name);
    setVisibleCount(60);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const scrollToGenre = useCallback((name: string) => {
    const el = document.getElementById(genreAnchor(name));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => { setVisibleCount(60); }, [selectedGenre]);

  const selectedList = selectedGenre ? (byGenre.find(([g]) => g === selectedGenre)?.[1] ?? []) : [];

  return (
    <Layout>
      <div className="space-y-10">
        <AdvancedFilters />

        {selectedGenre ? (
          /* SELECTED GENRE — full grid */
          <section>
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <button
                onClick={() => setSelectedGenre(null)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Retour aux genres
              </button>
              <Layers className="w-6 h-6 text-primary" />
              <h2 className="font-heading text-2xl font-bold text-foreground">{selectedGenre}</h2>
              <span className="text-sm text-muted-foreground">({selectedList.length})</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {selectedList.slice(0, visibleCount).map(item => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>

            {visibleCount < selectedList.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setVisibleCount(c => c + 60)}
                  className="px-6 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition text-sm font-medium"
                >
                  Charger plus ({selectedList.length - visibleCount} restants)
                </button>
              </div>
            )}
          </section>
        ) : (
          <>
            {/* GENRES OVERVIEW */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Layers className="w-6 h-6 text-primary" />
                <h2 className="font-heading text-2xl font-bold text-foreground">Genres</h2>
                <span className="text-sm text-muted-foreground">({byGenre.length})</span>
              </div>

              {byGenre.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {byGenre.map(([genre, list]) => (
                    <button
                      key={genre}
                      onClick={() => openGenre(genre)}
                      className="px-3 py-1 rounded-full text-xs bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {genre} <span className="opacity-70">({list.length})</span>
                    </button>
                  ))}
                </div>
              )}

              {byGenre.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun genre ne correspond à la recherche / aux filtres actuels.</p>
              ) : (
                <div className="space-y-10">
                  {byGenre.map(([genre, list]) => (
                    <div key={genre} id={genreAnchor(genre)} className="scroll-mt-24">
                      <div className="flex items-center justify-between mb-3">
                        <button
                          onClick={() => openGenre(genre)}
                          className="font-heading text-lg font-bold text-foreground hover:text-primary transition-colors"
                        >
                          {genre} <span className="text-xs text-muted-foreground font-normal">({list.length})</span>
                        </button>
                        {list.length > 20 && (
                          <button
                            onClick={() => openGenre(genre)}
                            className="text-xs text-primary hover:underline"
                          >
                            Tout afficher →
                          </button>
                        )}
                      </div>
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
          </>
        )}
      </div>
    </Layout>
  );
};

export default GenresCollectionsPage;
