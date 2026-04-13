import Layout from "@/components/Layout";
import ContentGrid from "@/components/ContentGrid";
import { useContentStore } from "@/store/contentStore";

const CategoryPage = ({ type, title }: { type: string; title: string }) => {
  const { items } = useContentStore();
  const filtered = items.filter(i => i.type === type);

  return (
    <Layout>
      <ContentGrid items={filtered} title={title} />
    </Layout>
  );
};

export const MoviesPage = () => <CategoryPage type="film" title="Films" />;
export const SeriesPage = () => <CategoryPage type="series" title="Séries" />;
export const MusicPage = () => <CategoryPage type="music" title="Musique" />;
export const PodcastsPage = () => <CategoryPage type="podcast" title="Podcasts" />;
export const CodePage = () => <CategoryPage type="codepen" title="Code & CodePen" />;
export const GalleryPage = () => <CategoryPage type="gallery" title="Galeries" />;
