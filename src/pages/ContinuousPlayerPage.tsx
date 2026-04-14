import { useState, useEffect, useCallback } from "react";
import { useContentStore } from "@/store/contentStore";
import { useNavigate } from "react-router-dom";
import { X, SkipBack, SkipForward, Pause, Play, ListMusic } from "lucide-react";

const ContinuousPlayerPage = () => {
  const { items, playlist, addToHistory } = useContentStore();
  const navigate = useNavigate();
  const playlistItems = playlist.map(id => items.find(i => i.id === id)).filter(Boolean) as typeof items;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(true);

  const current = playlistItems[currentIndex];

  useEffect(() => {
    if (current) {
      addToHistory(current.id);
    }
  }, [current?.id]);

  // Auto-advance timer for non-video content (30s)
  useEffect(() => {
    if (!autoAdvance || !isPlaying || !current) return;
    if (current.type === "gallery" || current.type === "codepen" || current.type === "iframe") {
      const timer = setTimeout(() => {
        if (currentIndex < playlistItems.length - 1) {
          setCurrentIndex(i => i + 1);
        }
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, autoAdvance, isPlaying, current]);

  const next = useCallback(() => {
    if (currentIndex < playlistItems.length - 1) setCurrentIndex(i => i + 1);
  }, [currentIndex, playlistItems.length]);

  const prev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex(i => i - 1);
  }, [currentIndex]);

  const getEmbedSrc = (iframe: string) => {
    const match = iframe.match(/src="([^"]+)"/);
    return match ? match[1] : "";
  };

  if (playlistItems.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <ListMusic className="w-16 h-16 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Playlist vide. Ajoutez du contenu d'abord.</p>
          <button onClick={() => navigate("/")} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs text-muted-foreground font-mono">{currentIndex + 1}/{playlistItems.length}</span>
          <h2 className="font-heading font-bold text-foreground truncate">{current?.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={autoAdvance}
              onChange={(e) => setAutoAdvance(e.target.checked)}
              className="rounded border-border"
            />
            Auto
          </label>
          <button onClick={() => navigate("/playlist")} className="p-2 rounded-full hover:bg-secondary transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        {current && (
          <div className="w-full max-w-6xl aspect-video rounded-lg overflow-hidden bg-muted border border-border">
            <iframe
              key={current.id}
              src={getEmbedSrc(current.embed.iframe)}
              className="w-full h-full"
              allowFullScreen
              allow="autoplay; encrypted-media"
              title={current.title}
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 px-4 py-4 border-t border-border bg-background/90 backdrop-blur-sm">
        <button
          onClick={prev}
          disabled={currentIndex === 0}
          className="p-3 rounded-full hover:bg-secondary transition-colors disabled:opacity-30"
        >
          <SkipBack className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
        </button>
        <button
          onClick={next}
          disabled={currentIndex === playlistItems.length - 1}
          className="p-3 rounded-full hover:bg-secondary transition-colors disabled:opacity-30"
        >
          <SkipForward className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Mini playlist */}
      <div className="max-h-32 overflow-y-auto border-t border-border bg-card/50">
        {playlistItems.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setCurrentIndex(i)}
            className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm transition-colors ${
              i === currentIndex ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary/50"
            }`}
          >
            <span className="font-mono text-xs w-6 text-center">{i + 1}</span>
            <span className="truncate">{item.title}</span>
            {item.meta.duration && <span className="text-xs ml-auto flex-shrink-0">{item.meta.duration}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ContinuousPlayerPage;
