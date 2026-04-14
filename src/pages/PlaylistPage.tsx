import Layout from "@/components/Layout";
import ContentGrid from "@/components/ContentGrid";
import { useContentStore } from "@/store/contentStore";
import { X, GripVertical, Play, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PlaylistPage = () => {
  const { items, playlist, removeFromPlaylist } = useContentStore();
  const playlistItems = playlist.map(id => items.find(i => i.id === id)).filter(Boolean) as typeof items;
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-foreground">Ma Playlist</h2>
          <div className="flex items-center gap-3">
            {playlistItems.length > 0 && (
              <button
                onClick={() => navigate("/player")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
              >
                <PlayCircle className="w-3.5 h-3.5" /> Lecture continue
              </button>
            )}
            <span className="text-sm text-muted-foreground">{playlistItems.length} éléments</span>
          </div>
        </div>

        {playlistItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Votre playlist est vide. Ajoutez du contenu avec le bouton <span className="text-primary">+</span> sur les cartes.</p>
          </div>
        )}

        {playlistItems.length > 0 && (
          <div className="space-y-2 mb-6">
            {playlistItems.map((item, i) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors group"
              >
                <GripVertical className="w-4 h-4 text-muted-foreground/50" />
                <span className="text-xs text-muted-foreground w-6 text-center font-mono">{i + 1}</span>
                <div
                  className="relative w-20 h-12 rounded overflow-hidden cursor-pointer flex-shrink-0"
                  onClick={() => navigate(`/viewer/${item.id}`)}
                >
                  <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium text-foreground truncate cursor-pointer hover:text-primary transition-colors"
                    onClick={() => navigate(`/viewer/${item.id}`)}
                  >
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.type} {item.meta.duration ? `· ${item.meta.duration}` : ""}
                  </p>
                </div>
                <button
                  onClick={() => removeFromPlaylist(item.id)}
                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-destructive/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {playlistItems.length > 0 && (
          <ContentGrid items={playlistItems} title="Vue grille" />
        )}
      </div>
    </Layout>
  );
};

export default PlaylistPage;
