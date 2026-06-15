import { Link, useLocation } from "react-router-dom";
import { Film, Tv, Music, Mic, Code, Image, Heart, Home, ListMusic, Clock, Radio } from "lucide-react";
import SearchBar from "./SearchBar";
import ThemeSwitcher from "./ThemeSwitcher";
import NeonBeams from "./NeonBeams";
import HeaderToolbar from "./HeaderToolbar";
import { useRef, useEffect, useState } from "react";

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
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const handler = (e: MouseEvent) => {
      const rect = header.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    header.addEventListener("mousemove", handler);
    return () => header.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <NeonBeams />

      <header
        ref={headerRef}
        className="sticky top-0 z-40 backdrop-blur-md"
        style={{ background: "linear-gradient(180deg, hsl(0 0% 0% / 0.95) 0%, hsl(0 0% 0% / 0.85) 100%)" }}
      >
        <div className="container flex items-center gap-6 h-16 relative z-10">
          <Link to="/" className="flex items-center shrink-0">
            <span
              className="font-heading font-black tracking-tighter text-2xl md:text-3xl text-primary"
              style={{ letterSpacing: "-0.05em" }}
            >
              UEM
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-5 overflow-x-auto scrollbar-hide flex-1">
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

          <div className="hidden md:block w-64">
            <SearchBar />
          </div>
          <div className="flex-1 md:flex-none flex justify-end">
            <HeaderToolbar />
          </div>
          <ThemeSwitcher />
        </div>

        {/* Mobile nav */}
        <nav className="md:hidden container overflow-x-auto scrollbar-hide relative z-10">
          <div className="flex items-center gap-4 pb-2">
            {navItems.map(n => (
              <Link
                key={n.to}
                to={n.to}
                className={`text-xs whitespace-nowrap transition-colors ${
                  location.pathname === n.to
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
        <div className="md:hidden container relative z-10 pb-3">
          <SearchBar />
        </div>
      </header>
      <main className="container py-8 relative z-10">{children}</main>
    </div>
  );
};

export default Layout;
