import { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import ContentGrid from "@/components/ContentGrid";
import PreviewsCarousel from "@/components/PreviewsCarousel";
import { useContentStore } from "@/store/contentStore";
import { PROVIDERS, buildProviderHaystack } from "@/lib/providers";


const ProviderPage = () => {
  const [params] = useSearchParams();
  const id = params.get("id") || "";
  const items = useContentStore(s => s.items);
  const applyFilters = useContentStore(s => s.applyFilters);
  const searchQuery = useContentStore(s => s.searchQuery);
  const activeType = useContentStore(s => s.activeType);
  const activeTags = useContentStore(s => s.activeTags);
  const filterId = useContentStore(s => s.filterId);
  const filterDateFrom = useContentStore(s => s.filterDateFrom);
  const filterDateTo = useContentStore(s => s.filterDateTo);
  const sortKey = useContentStore(s => s.sortKey);
  const sortDir = useContentStore(s => s.sortDir);

  const provider = PROVIDERS.find(p => p.key === id);

  const providerItems = useMemo(() => {
    if (!provider) return [];
    return items
      .filter(i => i.type === "film" || i.type === "series")
      .filter(i => {
        const hay = buildProviderHaystack(i);
        return provider.aliases.some(a => hay.includes(a));
      });
  }, [items, provider]);

  const filtered = useMemo(
    () => applyFilters(providerItems),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [providerItems, applyFilters, searchQuery, activeType, activeTags, filterId, filterDateFrom, filterDateTo, sortKey, sortDir]
  );


  if (!provider) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4">Fournisseur inconnu</h1>
          <Link to="/" className="text-primary hover:underline">Retour à l'accueil</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-white p-8 flex items-center gap-6 shadow-lg">
          <img src={provider.logo} alt={provider.name} className="h-20 object-contain" />
          <div>
            <h1 className="font-heading text-3xl font-bold text-black">{provider.name}</h1>
            <p className="text-black/70 text-sm mt-1">
              {filtered.length.toLocaleString("fr-FR")} films &amp; séries disponibles
            </p>
          </div>
        </div>
        <PreviewsCarousel items={filtered} providerName={provider.name} providerLogo={provider.logo} />
        <ContentGrid items={filtered} title={`Catalogue ${provider.name}`} />
      </div>
    </Layout>

  );
};

export default ProviderPage;
