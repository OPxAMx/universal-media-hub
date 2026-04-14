import { useParams, useNavigate } from "react-router-dom";
import { useContentStore } from "@/store/contentStore";
import Layout from "@/components/Layout";
import EmbedViewer from "@/components/EmbedViewer";
import GalleryViewer from "@/components/GalleryViewer";
import { galleryImages } from "@/data/sampleContent";
import { useEffect } from "react";

const ViewerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getItem, addToHistory } = useContentStore();
  const item = id ? getItem(id) : undefined;

  useEffect(() => {
    if (item) addToHistory(item.id);
  }, [item?.id]);

  if (!item) {
    return (
      <Layout>
        <div className="text-center py-16">
          <p className="text-muted-foreground">Contenu introuvable</p>
        </div>
      </Layout>
    );
  }

  if (item.type === "gallery") {
    const images = galleryImages[item.id] || [item.thumbnail];
    return <GalleryViewer images={images} title={item.title} onClose={() => navigate(-1)} />;
  }

  return <EmbedViewer item={item} onClose={() => navigate(-1)} />;
};

export default ViewerPage;
