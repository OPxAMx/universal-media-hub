import { useState } from "react";
import { LiveChannel } from "@/types/livetv";
import { useLiveTVStore } from "@/store/liveTVStore";
import { Plus, X } from "lucide-react";

interface Props {
  playlistId: string;
  channel?: LiveChannel;
  onClose: () => void;
}

const empty: Omit<LiveChannel, "id"> = {
  name: "", url: "", logo: "", group: "", tvgCountry: "", tvgLanguage: "",
};

const LiveChannelEditor = ({ playlistId, channel, onClose }: Props) => {
  const { addChannel, updateChannel } = useLiveTVStore();
  const [form, setForm] = useState<Omit<LiveChannel, "id">>(channel ? { ...channel } : empty);

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.name.trim() || !form.url.trim()) return;
    if (channel) updateChannel(playlistId, { ...form, id: channel.id });
    else addChannel(playlistId, form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-card border border-border rounded-xl p-5 space-y-3 modal-cinematic">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold">{channel ? "Modifier la chaîne" : "Ajouter une chaîne"}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-secondary"><X className="w-4 h-4" /></button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="col-span-2 text-xs space-y-1">
            <span className="text-muted-foreground">Nom *</span>
            <input value={form.name} onChange={(e) => set("name", e.target.value)} className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-sm" />
          </label>
          <label className="col-span-2 text-xs space-y-1">
            <span className="text-muted-foreground">URL du flux *</span>
            <input value={form.url} onChange={(e) => set("url", e.target.value)} placeholder="https://.../stream.m3u8" className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-sm" />
          </label>
          <label className="col-span-2 text-xs space-y-1">
            <span className="text-muted-foreground">Logo (URL)</span>
            <input value={form.logo || ""} onChange={(e) => set("logo", e.target.value)} className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-sm" />
          </label>
          <label className="text-xs space-y-1">
            <span className="text-muted-foreground">Groupe</span>
            <input value={form.group || ""} onChange={(e) => set("group", e.target.value)} className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-sm" />
          </label>
          <label className="text-xs space-y-1">
            <span className="text-muted-foreground">Pays</span>
            <input value={form.tvgCountry || ""} onChange={(e) => set("tvgCountry", e.target.value)} className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-sm" />
          </label>
          <label className="text-xs space-y-1">
            <span className="text-muted-foreground">Langue</span>
            <input value={form.tvgLanguage || ""} onChange={(e) => set("tvgLanguage", e.target.value)} className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-sm" />
          </label>
          <label className="text-xs space-y-1">
            <span className="text-muted-foreground">User-Agent</span>
            <input value={form.userAgent || ""} onChange={(e) => set("userAgent", e.target.value)} className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-sm" />
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-3 py-2 rounded-md bg-secondary text-sm">Annuler</button>
          <button onClick={submit} className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> {channel ? "Enregistrer" : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveChannelEditor;
