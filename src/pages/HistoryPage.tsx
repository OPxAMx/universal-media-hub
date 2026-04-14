import Layout from "@/components/Layout";
import ContentGrid from "@/components/ContentGrid";
import { useContentStore } from "@/store/contentStore";
import { Clock, Trash2 } from "lucide-react";

const HistoryPage = () => {
  const { items, history, clearHistory } = useContentStore();
  const historyItems = history
    .map(h => {
      const item = items.find(i => i.id === h.id);
      return item ? { ...item, watchedAt: h.watchedAt } : null;
    })
    .filter(Boolean)
    .reverse() as typeof items;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-xl font-bold text-foreground">Historique de lecture</h2>
          </div>
          {historyItems.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Effacer
            </button>
          )}
        </div>

        {historyItems.length === 0 ? (
          <div className="text-center py-16">
            <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Aucun historique de lecture</p>
          </div>
        ) : (
          <ContentGrid items={historyItems} title={`${historyItems.length} vus récemment`} />
        )}
      </div>
    </Layout>
  );
};

export default HistoryPage;
