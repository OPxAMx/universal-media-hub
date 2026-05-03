import { Search, X } from "lucide-react";
import { useContentStore } from "@/store/contentStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useContentStore();
  const navigate = useNavigate();

  useEffect(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (trimmed === "/add") {
      setSearchQuery("");
      navigate("/editor");
    }
  }, [searchQuery, navigate, setSearchQuery]);

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type="text"
        placeholder="Rechercher… (tapez /add pour ajouter)"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-9 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
      />
      {searchQuery && (
        <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
