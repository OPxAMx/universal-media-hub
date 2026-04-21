import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, RotateCw, Loader2 } from "lucide-react";
import { LiveChannel } from "@/types/livetv";

interface Props {
  channel: LiveChannel;
}

const LivePlayer = ({ channel }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFs, setIsFs] = useState(false);
  const [levels, setLevels] = useState<{ height: number; index: number }[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(-1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !channel?.url) return;

    setLoading(true);
    setError(null);
    setLevels([]);

    const isHls = /\.m3u8(\?|$)/i.test(channel.url) || channel.url.toLowerCase().includes("m3u8");

    const cleanup = () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };

    cleanup();

    if (isHls && Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hlsRef.current = hls;
      hls.loadSource(channel.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        setLevels(hls.levels.map((l, i) => ({ height: l.height, index: i })));
        video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      });
      hls.on(Hls.Events.LEVEL_SWITCHED, (_e, data) => setCurrentLevel(data.level));
      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (data.fatal) {
          setError(`Erreur lecture: ${data.type} / ${data.details}`);
          setLoading(false);
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl") || !isHls) {
      // Native HLS (Safari) or direct media file
      video.src = channel.url;
      const onLoaded = () => {
        setLoading(false);
        video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      };
      const onErr = () => { setError("Impossible de lire ce flux"); setLoading(false); };
      video.addEventListener("loadedmetadata", onLoaded);
      video.addEventListener("error", onErr);
      return () => {
        video.removeEventListener("loadedmetadata", onLoaded);
        video.removeEventListener("error", onErr);
        cleanup();
      };
    } else {
      setError("HLS non supporté par ce navigateur");
      setLoading(false);
    }

    return cleanup;
  }, [channel?.url]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = muted;
    }
  }, [volume, muted]);

  useEffect(() => {
    const handler = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  const toggleFs = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) containerRef.current.requestFullscreen();
    else document.exitFullscreen();
  };

  const reload = () => {
    if (videoRef.current) {
      const url = channel.url;
      videoRef.current.src = "";
      // re-trigger effect by toggling
      setTimeout(() => {
        if (hlsRef.current) {
          hlsRef.current.loadSource(url);
        } else if (videoRef.current) {
          videoRef.current.src = url;
          videoRef.current.load();
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    }
  };

  const setLevel = (idx: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = idx;
      setCurrentLevel(idx);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full bg-black rounded-lg overflow-hidden group">
      <video ref={videoRef} className="w-full aspect-video bg-black" playsInline />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-center p-4 gap-3">
          <p className="text-destructive text-sm">{error}</p>
          <p className="text-xs text-muted-foreground break-all max-w-md">{channel.url}</p>
          <button onClick={reload} className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs flex items-center gap-1.5">
            <RotateCw className="w-3.5 h-3.5" /> Réessayer
          </button>
        </div>
      )}

      {/* Live badge */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded bg-destructive/90 text-destructive-foreground text-[10px] font-bold tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-3 text-white">
          <button onClick={togglePlay} className="p-1.5 hover:bg-white/10 rounded">
            {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button onClick={() => setMuted(m => !m)} className="p-1.5 hover:bg-white/10 rounded">
            {muted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input
            type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume}
            onChange={(e) => { setVolume(parseFloat(e.target.value)); setMuted(false); }}
            className="w-20 accent-primary"
          />
          <button onClick={reload} className="p-1.5 hover:bg-white/10 rounded ml-auto" title="Recharger">
            <RotateCw className="w-4 h-4" />
          </button>
          {levels.length > 0 && (
            <select
              value={currentLevel}
              onChange={(e) => setLevel(parseInt(e.target.value))}
              className="bg-black/60 border border-white/20 text-xs rounded px-1.5 py-1"
            >
              <option value={-1}>Auto</option>
              {levels.map(l => <option key={l.index} value={l.index}>{l.height}p</option>)}
            </select>
          )}
          <button onClick={toggleFs} className="p-1.5 hover:bg-white/10 rounded">
            {isFs ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LivePlayer;
