import Layout from "@/components/Layout";
import ContentGrid from "@/components/ContentGrid";
import { useContentStore } from "@/store/contentStore";

const FavoritesPage = () => {
  const { favorites, filteredItems } = useContentStore();
  const favItems = filteredItems().filter(i => favorites.includes(i.id));

  return (
    <Layout>
      <ContentGrid items={favItems} title="Mes Favoris" />
    </Layout>
  );
};

export default FavoritesPage;
