import { Link, useLocation } from "react-router-dom";
import { Film, Tv, Music, Mic, Code, Image, Heart, Home, ListMusic, Clock, Radio, Plus, X, Upload, Layers } from "lucide-react";
import SearchBar from "./SearchBar";
import ThemeSwitcher from "./ThemeSwitcher";
import NeonBeams from "./NeonBeams";
import HeaderToolbar from "./HeaderToolbar";
import { useState, useEffect } from "react";

const navItems = [
  { to: "/", label: "Accueil", icon: <Home className="w-4 h-4" /> },
  { to: "/movies", label: "Films", icon: <Film className="w-4 h-4" /> },
  { to: "/series", label: "Séries", icon: <Tv className="w-4 h-4" /> },
  { to: "/music", label: "Musique", icon: <Music className="w-4 h-4" /> },
  { to: "/podcasts", label: "Podcasts", icon: <Mic className="w-4 h-4" /> },
  { to: "/code", label: "Code", icon: <Code className="w-4 h-4" /> },
  { to: "/gallery", label: "Galerie", icon: <Image className="w-4 h-4" /> },
  { to: "/livetv", label: "LiveTV", icon: <Radio className="w-4 h-4" /> },
  { to: "/favorites", label: "Favoris", icon: <Heart className="w-4 h-4" /> },
  { to: "/playlist", label: "Playlist", icon: <ListMusic className="w-4 h-4" /> },
  { to: "/history", label: "Historique", icon: <Clock className="w-4 h-4" /> },
  { to: "/import", label: "Import", icon: <Upload className="w-4 h-4" /> },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-background relative">
      <NeonBeams />

      <header
        className="sticky top-0 z-40 backdrop-blur-md"
        style={{ background: "linear-gradient(180deg, hsl(0 0% 0% / 0.95) 0%, hsl(0 0% 0% / 0.85) 100%)" }}
      >
        <div className="container flex items-center gap-3 sm:gap-6 h-16 relative z-10">
          {/* Burger - shown when nav links don't fit (below xl) */}
          <button
            onClick={() => setMenuOpen(true)}
            className="xl:hidden p-2 rounded-md text-foreground hover:bg-white/10 transition-colors shrink-0"
            aria-label="Ouvrir le menu"
          >
            <Plus className="w-6 h-6" />
          </button>

          <Link to="/" className="flex items-center shrink-0">
            <span
              className="font-heading font-black tracking-tighter text-2xl md:text-3xl text-primary"
              style={{ letterSpacing: "-0.05em" }}
            >
              UEM
            </span>
          </Link>

          {/* Inline nav only on very wide screens */}
          <nav className="hidden xl:flex items-center gap-5 flex-1 min-w-0 overflow-x-auto scrollbar-hide">
            {navItems.map(n => (
              <Link
                key={n.to}
                to={n.to}
                className={`text-sm whitespace-nowrap transition-colors ${
                  location.pathname === n.to
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex-1 xl:flex-none xl:w-64 min-w-0">
            <SearchBar />
          </div>
          <div className="flex justify-end shrink-0">
            <HeaderToolbar />
          </div>
          <div className="shrink-0">
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Side drawer */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-in fade-in"
            onClick={() => setMenuOpen(false)}
          />
          <aside
            className="fixed top-0 left-0 z-50 h-full w-72 max-w-[85vw] bg-background border-r border-border shadow-2xl flex flex-col animate-in slide-in-from-left duration-200"
          >
            <div className="flex items-center justify-between px-5 h-16 border-b border-border">
              <span className="font-heading font-black text-2xl text-primary tracking-tighter" style={{ letterSpacing: "-0.05em" }}>UEM</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-md text-foreground hover:bg-white/10"
                aria-label="Fermer le menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-3">
              {navItems.map(n => {
                const active = location.pathname === n.to;
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors border-l-2 ${
                      active
                        ? "text-foreground font-semibold border-primary bg-white/5"
                        : "text-muted-foreground hover:text-foreground border-transparent hover:bg-white/5"
                    }`}
                  >
                    {n.icon}
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </>
      )}

      <main className="container py-8 relative z-10">{children}</main>
    </div>
  );
};

export default Layout;
