import Layout from "@/components/Layout";
import ContentGrid from "@/components/ContentGrid";
import AdvancedFilters from "@/components/AdvancedFilters";
import { useContentStore } from "@/store/contentStore";

const CategoryPage = ({ type, title }: { type: string; title: string }) => {
  const filteredItems = useContentStore(s => s.filteredItems);
  const filtered = filteredItems().filter(i => i.type === type);

  return (
    <Layout>
      <div className="space-y-4">
        <AdvancedFilters />
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
