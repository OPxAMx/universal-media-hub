import Layout from "@/components/Layout";
import ContentGrid from "@/components/ContentGrid";
import { useContentStore } from "@/store/contentStore";
import { X } from "lucide-react";

const PlaylistPage = () => {
  const { items, playlist, removeFromPlaylist } = useContentStore();
  const playlistItems = items.filter(i => playlist.includes(i.id));

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-foreground">Ma Playlist</h2>
          <span className="text-sm text-muted-foreground">{playlistItems.length} éléments</span>
        </div>
        {playlistItems.length > 0 && (
          <div className="space-y-2 mb-6">
            {playlistItems.map((item, i) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                <span className="text-xs text-muted-foreground w-6">{i + 1}</span>
                <img src={item.thumbnail} alt="" className="w-16 h-10 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.meta.duration}</p>
                </div>
                <button onClick={() => removeFromPlaylist(item.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        <ContentGrid items={playlistItems} title="" />
      </div>
    </Layout>
  );
};

export default PlaylistPage;
