import { useState } from "react";
import { ContentItem, ContentType } from "@/types/content";
import { useContentStore } from "@/store/contentStore";
import { Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ContentEditorProps {
  item?: ContentItem;
}

const emptyItem: ContentItem = {
  id: "", type: "film", title: "", description: "", tags: [], thumbnail: "",
  embed: { provider: "", iframe: "", url: "", iframe_fr: "", url_fr: "" },
  meta: { duration: "", author: "", date_added: new Date().toISOString().split("T")[0], source: "" },
};

const ContentEditor = ({ item }: ContentEditorProps) => {
  const [data, setData] = useState<ContentItem>(item || { ...emptyItem, id: `custom-${Date.now()}` });
  const [tagInput, setTagInput] = useState("");
  const { updateItem, addItem } = useContentStore();
  const navigate = useNavigate();

  const set = (field: string, value: string) => {
    const keys = field.split(".");
    setData(prev => {
      const next = { ...prev } as any;
      if (keys.length === 2) {
        next[keys[0]] = { ...next[keys[0]], [keys[1]]: value };
      } else {
        next[keys[0]] = value;
      }
      return next;
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
      setData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => setData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));

  const save = () => {
    if (!data.title) { toast.error("Le titre est requis"); return; }
    if (item) updateItem(data);
    else addItem(data);
    toast.success(item ? "Contenu mis à jour" : "Contenu ajouté");
    navigate(`/viewer/${data.id}`);
  };

  const inputCls = "w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold text-foreground">{item ? "Modifier" : "Nouveau contenu"}</h2>
        <div className="flex gap-2">
          <button onClick={() => navigate(item ? `/viewer/${item.id}` : "/")} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm transition-colors">
            <X className="w-4 h-4" /> Annuler
          </button>
          <button onClick={save} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm transition-colors">
            <Save className="w-4 h-4" /> Sauvegarder
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Titre</label>
          <input value={data.title} onChange={e => set("title", e.target.value)} className={inputCls} placeholder="Titre du contenu" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Type</label>
          <select value={data.type} onChange={e => set("type", e.target.value)} className={inputCls}>
            {(["film","series","video","music","podcast","codepen","gallery","iframe"] as ContentType[]).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
          <textarea value={data.description} onChange={e => set("description", e.target.value)} className={inputCls + " min-h-[80px]"} placeholder="Description..." />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Thumbnail URL</label>
          <input value={data.thumbnail} onChange={e => set("thumbnail", e.target.value)} className={inputCls} placeholder="https://..." />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Tags</label>
          <div className="flex gap-2">
            <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())} className={inputCls} placeholder="Ajouter un tag..." />
            <button onClick={addTag} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm">+</button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {data.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground flex items-center gap-1">
                {tag} <button onClick={() => removeTag(tag)}><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Provider</label>
            <input value={data.embed.provider} onChange={e => set("embed.provider", e.target.value)} className={inputCls} placeholder="youtube, codepen..." />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">URL</label>
            <input value={data.embed.url} onChange={e => set("embed.url", e.target.value)} className={inputCls} placeholder="https://..." />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Iframe HTML (EN — principal)</label>
          <textarea value={data.embed.iframe} onChange={e => set("embed.iframe", e.target.value)} className={inputCls + " min-h-[60px] font-mono text-xs"} placeholder='<iframe src="..." ...>' />
        </div>
        <div className="grid grid-cols-2 gap-4 p-3 rounded-lg border border-dashed border-border/60 bg-secondary/20">
          <div className="col-span-2">
            <label className="text-xs font-medium text-muted-foreground block">Version française (facultatif)</label>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">URL FR</label>
            <input value={data.embed.url_fr || ""} onChange={e => set("embed.url_fr", e.target.value)} className={inputCls} placeholder="https://..." />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Iframe FR</label>
            <textarea value={data.embed.iframe_fr || ""} onChange={e => set("embed.iframe_fr", e.target.value)} className={inputCls + " min-h-[60px] font-mono text-xs"} placeholder='<iframe src="..." ...>' />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Auteur</label>
            <input value={data.meta.author} onChange={e => set("meta.author", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Durée</label>
            <input value={data.meta.duration} onChange={e => set("meta.duration", e.target.value)} className={inputCls} />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Source</label>
          <input value={data.meta.source} onChange={e => set("meta.source", e.target.value)} className={inputCls} />
        </div>
      </div>

      <div className="p-4 rounded-lg bg-muted border border-border">
        <h3 className="text-xs font-medium text-muted-foreground mb-2">Aperçu JSON</h3>
        <pre className="text-xs text-foreground/80 overflow-auto max-h-48 font-mono">{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ContentEditor;
