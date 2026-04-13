import Layout from "@/components/Layout";
import ContentGrid from "@/components/ContentGrid";
import { useContentStore } from "@/store/contentStore";

const FavoritesPage = () => {
  const { items, favorites } = useContentStore();
  const favItems = items.filter(i => favorites.includes(i.id));

  return (
    <Layout>
      <ContentGrid items={favItems} title="Mes Favoris" />
    </Layout>
  );
};

export default FavoritesPage;
