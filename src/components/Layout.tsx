import { Link, useLocation } from "react-router-dom";
import { Film, Tv, Music, Mic, Code, Image, Heart, Home, Plus, ListMusic, Clock, Upload } from "lucide-react";
import SearchBar from "./SearchBar";

const navItems = [
  { to: "/", label: "Accueil", icon: <Home className="w-4 h-4" /> },
  { to: "/movies", label: "Films", icon: <Film className="w-4 h-4" /> },
  { to: "/series", label: "Séries", icon: <Tv className="w-4 h-4" /> },
  { to: "/music", label: "Musique", icon: <Music className="w-4 h-4" /> },
  { to: "/podcasts", label: "Podcasts", icon: <Mic className="w-4 h-4" /> },
  { to: "/code", label: "Code", icon: <Code className="w-4 h-4" /> },
  { to: "/gallery", label: "Galerie", icon: <Image className="w-4 h-4" /> },
  { to: "/favorites", label: "Favoris", icon: <Heart className="w-4 h-4" /> },
  { to: "/playlist", label: "Playlist", icon: <ListMusic className="w-4 h-4" /> },
  { to: "/history", label: "Historique", icon: <Clock className="w-4 h-4" /> },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="font-heading text-xl font-bold gradient-text">UEM</Link>
          <div className="hidden md:flex">
            <SearchBar />
          </div>
          <Link to="/editor" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Ajouter
          </Link>
        </div>
        <nav className="container overflow-x-auto">
          <div className="flex items-center gap-1 pb-2">
            {navItems.map(n => (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  location.pathname === n.to
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {n.icon} {n.label}
              </Link>
            ))}
          </div>
        </nav>
        <div className="md:hidden container pb-3">
          <SearchBar />
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  );
};

export default Layout;
