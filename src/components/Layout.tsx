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
        className="sticky top-0 z-40 border-b border-border/50 backdrop-blur-xl overflow-hidden"
        style={{ background: "hsl(var(--background) / 0.85)" }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            left: mousePos.x - 100,
            top: mousePos.y - 100,
            width: 200,
            height: 200,
            background: "radial-gradient(circle, hsl(var(--primary) / 0.07) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        <div className="container flex items-center gap-3 h-16 relative z-10">
          <ThemeSwitcher />
          <div className="hidden md:flex flex-1 justify-center px-4">
            <SearchBar />
          </div>
          <div className="flex-1 md:flex-none flex justify-end">
            <HeaderToolbar />
          </div>
        </div>

        <nav className="container overflow-x-auto relative z-10">
          <div className="flex items-center gap-1 pb-2">
            {navItems.map(n => (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  location.pathname === n.to
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {n.icon} {n.label}
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
