import { useState, useRef } from "react";
import { useContentStore } from "@/store/contentStore";
import { ContentItem } from "@/types/content";
import { Upload, FileJson, Search, Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const TMDB_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NDAwODY3YWVmNGU1OWZhM2IyMjUxNWEzYmE0MzA4YiIsIm5iZiI6MTc3NjI4NDk3OS4zNjMwMDAyLCJzdWIiOiI2OWRmZjUzMzQxMzA0YTM0ZGQzOTQ4NTYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.6bfDm-Rdmk7K5-teBKkZTKmfBX-8WTN2IvZlr2OxAR0";

interface VerificationResult {
  item: ContentItem;
  status: "valid" | "invalid" | "not_found" | "skipped" | "duplicate";
  tmdbData?: { title: string; overview: string; poster: string; release_date: string };
}

const JsonUploader = () => {
  const { addItem, items } = useContentStore();
  const [dragOver, setDragOver] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [results, setResults] = useState<VerificationResult[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const validateItem = (obj: any): obj is ContentItem => {
    return (
      typeof obj.id === "string" &&
      typeof obj.type === "string" &&
      typeof obj.title === "string" &&
      typeof obj.description === "string" &&
      Array.isArray(obj.tags) &&
      typeof obj.thumbnail === "string" &&
      obj.embed && typeof obj.embed.iframe === "string" &&
      obj.meta && typeof obj.meta.date_added === "string"
    );
  };

  const searchTMDB = async (title: string, type: string): Promise<VerificationResult["tmdbData"] | null> => {
    try {
      const mediaType = type === "series" ? "tv" : "movie";
      const res = await fetch(
        `https://api.themoviedb.org/3/search/${mediaType}?query=${encodeURIComponent(title)}&language=fr-FR`,
        { headers: { Authorization: `Bearer ${TMDB_TOKEN}` } }
      );
      if (!res.ok) return null;
      const data = await res.json();
      const first = data.results?.[0];
      if (!first) return null;
      return {
        title: first.title || first.name,
        overview: first.overview,
        poster: first.poster_path ? `https://image.tmdb.org/t/p/w500${first.poster_path}` : "",
        release_date: first.release_date || first.first_air_date || "",
      };
    } catch {
      return null;
    }
  };

  const processAndVerify = async (text: string, fileName: string) => {
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      toast({ title: "Erreur de parsing", description: `${fileName} n'est pas un JSON valide.`, variant: "destructive" });
      return;
    }

    const entries: any[] = Array.isArray(parsed) ? parsed : [parsed];
    const verificationResults: VerificationResult[] = [];

    setVerifying(true);
    setResults([]);

    for (const entry of entries) {
      if (!validateItem(entry)) {
        verificationResults.push({ item: entry as ContentItem, status: "invalid" });
        continue;
      }
      if (items.some(i => i.id === entry.id)) {
        verificationResults.push({ item: entry, status: "duplicate" });
        continue;
      }

      // Verify against TMDB for films and series
      if (entry.type === "film" || entry.type === "series") {
        const tmdbData = await searchTMDB(entry.title, entry.type);
        if (tmdbData) {
          verificationResults.push({ item: entry, status: "valid", tmdbData });
        } else {
          verificationResults.push({ item: entry, status: "not_found" });
        }
      } else {
        verificationResults.push({ item: entry, status: "skipped" });
      }
    }

    setResults(verificationResults);
    setVerifying(false);
  };

  const importResults = () => {
    let added = 0;
    for (const r of results) {
      if (r.status === "valid" || r.status === "skipped" || r.status === "not_found") {
        if (!items.some(i => i.id === r.item.id)) {
          addItem(r.item);
          added++;
        }
      }
    }
    const duplicates = results.filter(r => r.status === "duplicate").length;
    const invalid = results.filter(r => r.status === "invalid").length;
    toast({
      title: `Import terminé`,
      description: `${added} ajouté(s), ${duplicates} doublon(s), ${invalid} invalide(s)`,
    });
    setResults([]);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const file = files[0];
    if (!file?.name.endsWith(".json")) {
      toast({ title: "Format invalide", description: `Seuls les fichiers .json sont acceptés`, variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => processAndVerify(e.target?.result as string, file.name);
    reader.readAsText(file);
  };

  const statusIcon = (status: VerificationResult["status"]) => {
    switch (status) {
      case "valid": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "duplicate": return <XCircle className="w-4 h-4 text-yellow-500" />;
      case "invalid": return <XCircle className="w-4 h-4 text-destructive" />;
      case "not_found": return <Search className="w-4 h-4 text-orange-400" />;
      case "skipped": return <CheckCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const statusLabel = (status: VerificationResult["status"]) => {
    switch (status) {
      case "valid": return "Vérifié TMDB ✓";
      case "duplicate": return "Doublon";
      case "invalid": return "Format invalide";
      case "not_found": return "Non trouvé sur TMDB";
      case "skipped": return "Non vérifié (type non supporté)";
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
          dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {verifying ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm font-medium text-foreground">Vérification via TMDB en cours…</p>
          </div>
        ) : (
          <>
            <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground">Glissez votre fichier .json ici</p>
            <p className="text-xs text-muted-foreground mt-1">ou cliquez pour sélectionner — vérification TMDB automatique</p>
          </>
        )}
        <div className="mt-4 p-3 rounded-lg bg-secondary/50 text-left">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
            <FileJson className="w-3.5 h-3.5" /> Format attendu :
          </p>
          <pre className="text-[10px] text-muted-foreground font-mono leading-relaxed">
{`{
  "id": "unique-id",
  "type": "film|series|video|music|...",
  "title": "Titre",
  "description": "...",
  "tags": ["tag1", "tag2"],
  "thumbnail": "https://...",
  "embed": { "provider": "...", "iframe": "<iframe ...>", "url": "..." },
  "meta": { "duration": "", "author": "", "date_added": "", "source": "" }
}`}
          </pre>
        </div>
      </div>

      {results.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-secondary/30 backdrop-blur-sm overflow-hidden">
          <div className="p-4 border-b border-border/50 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Résultats de vérification ({results.length} élément{results.length > 1 ? "s" : ""})
            </h3>
            <button
              onClick={importResults}
              className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Importer les valides
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-border/30">
            {results.map((r, i) => (
              <div key={i} className="flex items-start gap-3 p-3 hover:bg-secondary/50 transition-colors">
                <div className="mt-0.5">{statusIcon(r.status)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{r.item?.title || "Sans titre"}</p>
                  <p className="text-xs text-muted-foreground">{statusLabel(r.status)}</p>
                  {r.tmdbData && (
                    <div className="mt-2 flex gap-2 p-2 rounded-lg bg-background/50">
                      {r.tmdbData.poster && (
                        <img src={r.tmdbData.poster} alt="" className="w-10 h-14 rounded object-cover flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground">{r.tmdbData.title}</p>
                        <p className="text-[10px] text-muted-foreground">{r.tmdbData.release_date}</p>
                        <p className="text-[10px] text-muted-foreground line-clamp-2">{r.tmdbData.overview}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JsonUploader;
