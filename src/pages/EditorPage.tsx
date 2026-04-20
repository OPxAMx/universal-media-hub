import { useParams } from "react-router-dom";
import { useContentStore } from "@/store/contentStore";
import Layout from "@/components/Layout";
import ContentEditor from "@/components/ContentEditor";
import JsonUploader from "@/components/JsonUploader";
import ContentAuditor from "@/components/ContentAuditor";
import GalleryOrganizer from "@/components/GalleryOrganizer";

const EditorPage = () => {
  const { id } = useParams();
  const { getItem } = useContentStore();
  const item = id ? getItem(id) : undefined;

  return (
    <Layout>
      <div className="space-y-8">
        <JsonUploader />
        <ContentAuditor />
        {item?.type === "gallery" && <GalleryOrganizer gallery={item} />}
        <ContentEditor item={item} />
      </div>
    </Layout>
  );
};

export default EditorPage;
