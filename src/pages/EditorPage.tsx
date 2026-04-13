import { useParams } from "react-router-dom";
import { useContentStore } from "@/store/contentStore";
import Layout from "@/components/Layout";
import ContentEditor from "@/components/ContentEditor";

const EditorPage = () => {
  const { id } = useParams();
  const { getItem } = useContentStore();
  const item = id ? getItem(id) : undefined;

  return (
    <Layout>
      <ContentEditor item={item} />
    </Layout>
  );
};

export default EditorPage;
