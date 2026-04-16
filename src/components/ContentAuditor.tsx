import { useState } from "react";
import { useContentStore } from "@/store/contentStore";
import { ContentItem } from "@/types/content";
import { RefreshCw, AlertTriangle, CheckCircle, XCircle, Loader2, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const TMDB_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NDAwODY3YWVmNGU1OWZhM2IyMjUxNWEzYmE0MzA4YiIsIm5iZiI6MTc3NjI4NDk3OS4zNjMwMDAyLCJzdWIiOiI2OWRmZjUzMzQxMzA0YTM0ZGQzOTQ4NTYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.6bfDm-Rdmk7K5-teBKkZTKmfBX-8WTN2IvZlr2OxAR0";

interface AuditIssue {
  field: string;
  current: string;
  suggested: string;
}

interface AuditResult {
  item: ContentItem;
  issues: AuditIssue[];
  tmdbData?: { title: string; overview: string; poster: string; release_date: string };
  status: "ok" | "issues" | "not_found" | "skipped";
  selected: boolean;
}

const REQUIRED_FIELDS: (keyof ContentItem | string)[] = [
  "title", "description", "thumbnail", "type"
];

const checkMissing = (item: ContentItem): AuditIssue[] => {
  const issues: AuditIssue[] = [];
  if (!item.title?.trim()) issues.push({ field: "title", current: "(vide)", suggested: "" });
  if (!item.description?.trim()) issues.push({ field: "description", current: "(vide)", suggested: "" });
  if (!item.thumbnail?.trim()) issues.push({ field: "thumbnail", current: "(vide)", suggested: "" });
  if (!item.tags?.length) issues.push({ field: "tags", current: "(aucun)", suggested: "" });
  if (!item.meta?.date_added?.trim()) issues.push({ field: "meta.date_added", current: "(vide)", suggested: "" });
  if (!item.meta?.duration?.trim()) issues.push({ field: "meta.duration", current: "(vide)", suggested: "" });
  return issues;
};

const searchTMDB = async (title: string, type: string) => {
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
      title: first.title || first.name || "",
      overview: first.overview || "",
      poster: first.poster_path ? `https://image.tmdb.org/t/p/w500${first.poster_path}` : "",
      release_date: first.release_date || first.first_air_date || "",
    };
  } catch {
    return null;
  }
};

const ContentAuditor = () => {
  const { items, updateItem } = useContentStore();
  const [auditing, setAuditing] = useState(false);
  const [results, setResults] = useState<AuditResult[]>([]);
  const [filterType, setFilterType] = useState<string>("all");

  const runAudit = async () => {
    setAuditing(true);
    setResults([]);
    const auditResults: AuditResult[] = [];

    for (const item of items) {
      const issues = checkMissing(item);

      if (item.type === "film" || item.type === "series") {
        const tmdbData = await searchTMDB(item.title, item.type);
        if (tmdbData) {
          // Check for corrections
          if (!item.description?.trim() && tmdbData.overview)
            issues.push({ field: "description", current: "(vide)", suggested: tmdbData.overview });
          else if (item.description?.trim() && tmdbData.overview && item.description.length < 20)
            issues.push({ field: "description", current: item.description, suggested: tmdbData.overview });

          if (!item.thumbnail?.trim() && tmdbData.poster)
            issues.push({ field: "thumbnail", current: "(vide)", suggested: tmdbData.poster });

          if (!item.meta?.date_added?.trim() && tmdbData.release_date)
            issues.push({ field: "meta.date_added", current: "(vide)", suggested: tmdbData.release_date });

          // Deduplicate issues by field
          const seen = new Set<string>();
          const deduped = issues.filter(i => {
            if (seen.has(i.field)) return false;
            seen.add(i.field);
            return true;
          });

          auditResults.push({
            item, issues: deduped, tmdbData,
            status: deduped.length > 0 ? "issues" : "ok",
            selected: deduped.some(i => i.suggested),
          });
        } else {
          auditResults.push({ item, issues, status: issues.length ? "not_found" : "ok", selected: false });
        }
      } else {
        auditResults.push({
          item, issues, status: issues.length ? "issues" : "ok", selected: false,
          tmdbData: undefined,
        });
      }
    }

    setResults(auditResults);
    setAuditing(false);
  };

  const toggleSelect = (idx: number) => {
    setResults(prev => prev.map((r, i) => i === idx ? { ...r, selected: !r.selected } : r));
  };

  const applyFixes = () => {
    let fixed = 0;
    for (const r of results) {
      if (!r.selected || !r.issues.some(i => i.suggested)) continue;
      const updated = { ...r.item };
      for (const issue of r.issues) {
        if (!issue.suggested) continue;
        if (issue.field === "description") updated.description = issue.suggested;
        else if (issue.field === "thumbnail") updated.thumbnail = issue.suggested;
        else if (issue.field === "meta.date_added") updated.meta = { ...updated.meta, date_added: issue.suggested };
      }
      updateItem(updated);
      fixed++;
    }
    toast({ title: "Corrections appliquées", description: `${fixed} contenu(s) mis à jour.` });
    setResults([]);
  };

  const filtered = results.filter(r => {
    if (filterType === "issues") return r.status === "issues" || r.status === "not_found";
    if (filterType === "ok") return r.status === "ok";
    return true;
  });

  const issueCount = results.filter(r => r.status === "issues" || r.status === "not_found").length;
  const fixableCount = results.filter(r => r.issues.some(i => i.suggested)).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Audit & Correction de la bibliothèque
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Vérifie les données manquantes et corrige via themoviedb.org
          </p>
        </div>
        <button
          onClick={runAudit}
          disabled={auditing}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
        >
          {auditing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          {auditing ? "Analyse en cours…" : `Analyser (${items.length} contenus)`}
        </button>
      </div>

      {results.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-secondary/30 backdrop-blur-sm overflow-hidden">
          {/* Summary bar */}
          <div className="p-3 border-b border-border/50 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-green-500">
                <CheckCircle className="w-3.5 h-3.5" /> {results.filter(r => r.status === "ok").length} OK
              </span>
              <span className="flex items-center gap-1 text-orange-400">
                <AlertTriangle className="w-3.5 h-3.5" /> {issueCount} problème(s)
              </span>
              <span className="flex items-center gap-1 text-primary">
                <Download className="w-3.5 h-3.5" /> {fixableCount} corrigeable(s)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="text-xs bg-background border border-border rounded-md px-2 py-1"
              >
                <option value="all">Tous</option>
                <option value="issues">Problèmes</option>
                <option value="ok">OK</option>
              </select>
              {fixableCount > 0 && (
                <button
                  onClick={applyFixes}
                  className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors"
                >
                  Appliquer les corrections ({results.filter(r => r.selected).length})
                </button>
              )}
            </div>
          </div>

          {/* Results list */}
          <div className="max-h-96 overflow-y-auto divide-y divide-border/30">
            {filtered.map((r, i) => {
              const realIdx = results.indexOf(r);
              return (
                <div key={r.item.id} className="flex items-start gap-3 p-3 hover:bg-secondary/50 transition-colors">
                  {r.issues.some(is => is.suggested) && (
                    <input
                      type="checkbox"
                      checked={r.selected}
                      onChange={() => toggleSelect(realIdx)}
                      className="mt-1 accent-primary"
                    />
                  )}
                  <div className="mt-0.5">
                    {r.status === "ok" && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {r.status === "issues" && <AlertTriangle className="w-4 h-4 text-orange-400" />}
                    {r.status === "not_found" && <XCircle className="w-4 h-4 text-red-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">{r.item.title}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{r.item.type}</span>
                    </div>
                    {r.issues.length > 0 && (
                      <div className="mt-1.5 space-y-1">
                        {r.issues.map((issue, j) => (
                          <div key={j} className="text-[11px] flex items-start gap-1.5">
                            <span className="text-muted-foreground font-mono">{issue.field}:</span>
                            {issue.suggested ? (
                              <span className="text-green-400 truncate">→ {issue.suggested.slice(0, 80)}{issue.suggested.length > 80 ? "…" : ""}</span>
                            ) : (
                              <span className="text-orange-400">{issue.current}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {r.tmdbData && (
                      <div className="mt-2 flex gap-2 p-2 rounded-lg bg-background/50">
                        {r.tmdbData.poster && (
                          <img src={r.tmdbData.poster} alt="" className="w-8 h-12 rounded object-cover flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium text-foreground">{r.tmdbData.title}</p>
                          <p className="text-[10px] text-muted-foreground">{r.tmdbData.release_date}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentAuditor;
