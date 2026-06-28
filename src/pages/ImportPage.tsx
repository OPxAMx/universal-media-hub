import { useState } from "react";
import Layout from "@/components/Layout";
import JsonUploader from "@/components/JsonUploader";
import { Link2, Loader2, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useContentStore } from "@/store/contentStore";
import { ContentItem } from "@/types/content";

const ImportPage = () => {
  const { items, addItem } = useContentStore();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const normalize = (raw: any): ContentItem | null => {
    if (!raw || typeof raw !== "object") return null;
    const id = raw.id != null ? String(raw.id) : "";
    if (!id) return null;
    const embedSrc = raw.embed || {};
    const metaSrc = raw.meta || {};
    return {
      id,
      type: (raw.type || "film") as ContentItem["type"],
      title: String(raw.title || raw.original_title || ""),
      description: String(raw.description || raw.overview || ""),
      tags: Array.isArray(raw.tags) ? raw.tags.map(String) : Array.isArray(raw.genres) ? raw.genres.map(String) : [],
      thumbnail: String(raw.thumbnail || raw.poster || ""),
      embed: {
        provider: String(embedSrc.provider || ""),
        iframe: String(embedSrc.iframe || ""),
        url: String(embedSrc.url || ""),
        iframe_fr: embedSrc.iframe_fr ? String(embedSrc.iframe_fr) : undefined,
        url_fr: embedSrc.url_fr ? String(embedSrc.url_fr) : undefined,
      },
      meta: {
        duration: String(metaSrc.duration || (raw.runtime ? `${raw.runtime}min` : "")),
        author: String(metaSrc.author || raw.director || ""),
        date_added: String(metaSrc.date_added || raw.release_date || new Date().toISOString().slice(0, 10)),
        source: String(metaSrc.source || raw.source || ""),
      },
    };
  };

  const fetchFromUrl = async () => {
    if (!url.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(url.trim());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      let data: any;
      try { data = JSON.parse(text); }
      catch { data = JSON.parse("[" + text.replace(/}\s*{/g, "},{") + "]"); }
      const arr = Array.isArray(data) ? data : [data];
      const existing = new Set(items.map(i => i.id));
      let added = 0, dup = 0, bad = 0;
      for (const raw of arr) {
        const n = normalize(raw);
        if (!n) { bad++; continue; }
        if (existing.has(n.id)) { dup++; continue; }
        addItem(n);
        existing.add(n.id);
        added++;
      }
      toast({ title: "Import URL terminé", description: `${added} ajouté(s), ${dup} doublon(s), ${bad} invalide(s).` });
    } catch (e: any) {
      toast({ title: "Échec de l'import", description: e.message || "URL invalide ou CORS bloqué", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const exportTs = () => {
    const json = JSON.stringify(items, null, 2);
    const ts = `import { ContentItem } from "@/types/content";\n\nexport const sampleContent: ContentItem[] = ${json};\n`;
    const blob = new Blob([ts], { type: "text/typescript" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "sampleContent.ts";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Import de contenu</h1>
          <p className="text-sm text-muted-foreground">
            Importez des médias depuis un fichier <code>.json</code> ou directement depuis une URL distante.
          </p>
        </header>

        {/* URL import */}
        <section className="rounded-xl border border-border/50 bg-secondary/30 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Mise à jour via URL</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Collez l'URL d'un JSON public (raw GitHub, gist, CDN…). Les doublons sont ignorés.
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://exemple.com/medias.json"
              className="flex-1 h-10 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            />
            <button
              onClick={fetchFromUrl}
              disabled={loading || !url.trim()}
              className="px-4 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
              Importer
            </button>
          </div>
        </section>

        {/* File import */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Import via fichier</h2>
          <JsonUploader />
        </section>

        {/* Export */}
        <section className="rounded-xl border border-border/50 bg-secondary/30 p-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Exporter la bibliothèque</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Génère un <code>sampleContent.ts</code> à committer dans le repo.
            </p>
          </div>
          <button
            onClick={exportTs}
            className="px-4 h-10 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-semibold inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Exporter
          </button>
        </section>
      </div>
    </Layout>
  );
};

export default ImportPage;
