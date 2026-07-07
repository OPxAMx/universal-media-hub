import { useEffect } from "react";
import Layout from "@/components/Layout";
import ContentGrid from "@/components/ContentGrid";

import { useContentStore } from "@/store/contentStore";

const CategoryPage = ({ type, title }: { type: string; title: string }) => {
  const setActiveType = useContentStore(s => s.setActiveType);
  // Subscribe to filter state so component re-renders on changes
  useContentStore(s => s.searchQuery);
  useContentStore(s => s.activeTags);
  useContentStore(s => s.filterId);
  useContentStore(s => s.filterDateFrom);
  useContentStore(s => s.filterDateTo);
  useContentStore(s => s.sortKey);
  useContentStore(s => s.sortDir);
  useContentStore(s => s.activeGenres);
  useContentStore(s => s.activeType);
  useContentStore(s => s.items);
  const filteredItems = useContentStore(s => s.filteredItems);

  useEffect(() => {
    setActiveType(type);
    return () => setActiveType(null);
  }, [type, setActiveType]);

  const filtered = filteredItems().filter(i => i.type === type);

  return (
    <Layout>
      <div className="space-y-4">
        <ContentGrid items={filtered} title={`${title} (${filtered.length})`} />
      </div>

    </Layout>
  );
};

export const MoviesPage = () => <CategoryPage type="film" title="Films" />;
export const SeriesPage = () => <CategoryPage type="series" title="Séries" />;
export const MusicPage = () => <CategoryPage type="music" title="Musique" />;
export const PodcastsPage = () => <CategoryPage type="podcast" title="Podcasts" />;
export const CodePage = () => <CategoryPage type="codepen" title="Code & CodePen" />;
export const GalleryPage = () => <CategoryPage type="gallery" title="Galeries" />;
