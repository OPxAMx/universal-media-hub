import { useState, useRef } from "react";
import { useContentStore } from "@/store/contentStore";
import { ContentItem } from "@/types/content";
import { Upload, FileJson, Check, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const JsonUploader = () => {
  const { addItem, items } = useContentStore();
  const [dragOver, setDragOver] = useState(false);
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

  const processJson = (text: string, fileName: string) => {
    try {
      const parsed = JSON.parse(text);
      const entries: any[] = Array.isArray(parsed) ? parsed : [parsed];
      let added = 0;
      let skipped = 0;
      let invalid = 0;

      for (const entry of entries) {
        if (!validateItem(entry)) {
          invalid++;
          continue;
        }
        if (items.some(i => i.id === entry.id)) {
          skipped++;
          continue;
        }
        addItem(entry);
        added++;
      }

      toast({
        title: `Import: ${fileName}`,
        description: `${added} ajouté(s), ${skipped} doublon(s), ${invalid} invalide(s)`,
      });
    } catch {
      toast({
        title: "Erreur de parsing",
        description: `Le fichier ${fileName} n'est pas un JSON valide.`,
        variant: "destructive",
      });
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      if (!file.name.endsWith(".json")) {
        toast({ title: "Format invalide", description: `${file.name} n'est pas un .json`, variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => processJson(e.target?.result as string, file.name);
      reader.readAsText(file);
    });
  };

  return (
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
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
      <p className="text-sm font-medium text-foreground">
        Glissez vos fichiers .json ici
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        ou cliquez pour sélectionner — un ou plusieurs fichiers
      </p>
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
  );
};

export default JsonUploader;
