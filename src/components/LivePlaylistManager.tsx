import { useRef, useState } from "react";
import { useLiveTVStore } from "@/store/liveTVStore";
import { serializeM3U } from "@/lib/m3uParser";
import { Upload, Link2, Trash2, Download, Pencil, Check, X, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const LivePlaylistManager = () => {
  const {
    playlists, activePlaylistId, setActivePlaylist,
    addPlaylistFromText, importPlaylistFromUrl, removePlaylist, renamePlaylist,
  } = useLiveTVStore();

  const fileRef = useRef<HTMLInputElement>(null);
  const [remoteUrl, setRemoteUrl] = useState("");
  const [remoteName, setRemoteName] = useState("");
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleFile = async (file: File) => {
    const text = await file.text();
    const name = file.name.replace(/\.(m3u8?|txt)$/i, "");
    addPlaylistFromText(name, text);
    toast({ title: "Playlist importée", description: name });
  };

  const handleUrlImport = async () => {
    if (!remoteUrl.trim()) return;
    setBusy(true);
    try {
      await importPlaylistFromUrl(remoteName.trim() || remoteUrl, remoteUrl.trim());
      toast({ title: "Playlist chargée", description: remoteUrl });
      setRemoteUrl(""); setRemoteName("");
    } catch (e) {
      toast({ title: "Erreur de chargement", description: (e as Error).message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const handleExport = (id: string) => {
    const pl = playlists.find(p => p.id === id);
    if (!pl) return;
    const blob = new Blob([serializeM3U(pl.channels)], { type: "application/vnd.apple.mpegurl" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pl.name}.m3u`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 p-4 rounded-lg border border-border bg-card/50">
      <h2 className="font-heading font-bold text-lg flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" /> Bibliothèque M3U / M3U8
      </h2>

      {/* Import controls */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Importer un fichier</label>
          <input
            ref={fileRef}
            type="file"
            accept=".m3u,.m3u8,.txt,audio/x-mpegurl,application/vnd.apple.mpegurl"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-secondary hover:bg-secondary/80 text-sm transition-colors"
          >
            <Upload className="w-4 h-4" /> Choisir .m3u / .m3u8
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Charger depuis une URL</label>
          <div className="flex gap-2">
            <input
              type="text" placeholder="Nom (optionnel)" value={remoteName}
              onChange={(e) => setRemoteName(e.target.value)}
              className="flex-1 px-3 py-2 rounded-md bg-secondary border border-border text-sm"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="url" placeholder="https://example.com/playlist.m3u8" value={remoteUrl}
              onChange={(e) => setRemoteUrl(e.target.value)}
              className="flex-1 px-3 py-2 rounded-md bg-secondary border border-border text-sm"
            />
            <button
              onClick={handleUrlImport} disabled={busy || !remoteUrl}
              className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm disabled:opacity-50 flex items-center gap-1.5"
            >
              <Link2 className="w-4 h-4" /> Charger
            </button>
          </div>
        </div>
      </div>

      {/* Playlists list */}
      {playlists.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">Aucune playlist. Importez un fichier M3U ou collez une URL.</p>
      ) : (
        <div className="space-y-2">
          {playlists.map(pl => (
            <div
              key={pl.id}
              className={`flex items-center gap-2 p-2 rounded-md border transition-colors ${
                activePlaylistId === pl.id ? "border-primary bg-primary/10" : "border-border bg-secondary/40"
              }`}
            >
              <button
                onClick={() => setActivePlaylist(pl.id)}
                className="flex-1 text-left min-w-0"
              >
                {editingId === pl.id ? (
                  <input
                    autoFocus value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full px-2 py-1 rounded bg-background border border-border text-sm"
                  />
                ) : (
                  <>
                    <div className="font-medium text-sm truncate">{pl.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {pl.channels.length} chaînes · {new Date(pl.importedAt).toLocaleDateString()}
                    </div>
                  </>
                )}
              </button>

              {editingId === pl.id ? (
                <>
                  <button onClick={() => { renamePlaylist(pl.id, editName); setEditingId(null); }} className="p-1.5 rounded hover:bg-secondary">
                    <Check className="w-4 h-4 text-primary" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="p-1.5 rounded hover:bg-secondary">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { setEditingId(pl.id); setEditName(pl.name); }} className="p-1.5 rounded hover:bg-secondary" title="Renommer">
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button onClick={() => handleExport(pl.id)} className="p-1.5 rounded hover:bg-secondary" title="Exporter">
                    <Download className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => { if (confirm(`Supprimer "${pl.name}" ?`)) removePlaylist(pl.id); }}
                    className="p-1.5 rounded hover:bg-destructive/20" title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LivePlaylistManager;
