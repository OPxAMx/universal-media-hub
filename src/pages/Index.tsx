import Layout from "@/components/Layout";
import ContentGrid from "@/components/ContentGrid";
import FilterBar from "@/components/FilterBar";
import TagList from "@/components/TagList";
import { useContentStore } from "@/store/contentStore";
import { Film, Tv, Music, Mic, Code, Image } from "lucide-react";
import { useMemo } from "react";

const stats = [
  { type: "film", label: "Films", icon: <Film className="w-5 h-5" /> },
  { type: "series", label: "Séries", icon: <Tv className="w-5 h-5" /> },
  { type: "music", label: "Musique", icon: <Music className="w-5 h-5" /> },
  { type: "podcast", label: "Podcasts", icon: <Mic className="w-5 h-5" /> },
  { type: "codepen", label: "Code", icon: <Code className="w-5 h-5" /> },
  { type: "gallery", label: "Galerie", icon: <Image className="w-5 h-5" /> },
];

const Index = () => {
  const { items, filteredItems, favorites } = useContentStore();
  const filtered = filteredItems();

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    items.forEach(i => { map[i.type] = (map[i.type] || 0) + 1; });
    return map;
  }, [items]);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero */}
        <section className="text-center py-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold gradient-text mb-3">Universal Embed Manager</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Gérez, classez et partagez tous vos contenus multimédia en un seul endroit.</p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {stats.map(s => (
            <div key={s.type} className="flex flex-col items-center p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
              <div className="text-primary mb-1">{s.icon}</div>
              <span className="font-heading text-lg font-bold text-foreground">{counts[s.type] || 0}</span>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </section>

        {/* Dashboard info */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-lg bg-card border border-border">
            <p className="text-2xl font-heading font-bold text-foreground">{items.length}</p>
            <p className="text-xs text-muted-foreground">Total contenus</p>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border">
            <p className="text-2xl font-heading font-bold text-foreground">{favorites.length}</p>
            <p className="text-xs text-muted-foreground">Favoris</p>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border">
            <p className="text-2xl font-heading font-bold text-foreground">{new Set(items.flatMap(i => i.tags)).size}</p>
            <p className="text-xs text-muted-foreground">Tags uniques</p>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border">
            <p className="text-2xl font-heading font-bold text-foreground">{new Set(items.map(i => i.embed.provider)).size}</p>
            <p className="text-xs text-muted-foreground">Providers</p>
          </div>
        </section>

        <FilterBar />
        <TagList />
        <ContentGrid items={filtered} title="Tous les contenus" />
      </div>
    </Layout>
  );
};

export default Index;
