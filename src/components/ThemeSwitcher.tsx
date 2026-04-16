import { useState, useRef, useEffect } from "react";

const themes = [
  { id: "dark-crimson", label: "Dark Crimson", colors: ["hsl(220,20%,6%)", "hsl(350,80%,55%)"], class: "theme-dark-crimson" },
  { id: "dark-ocean", label: "Dark Ocean", colors: ["hsl(220,25%,8%)", "hsl(210,90%,50%)"], class: "theme-dark-ocean" },
  { id: "light-rose", label: "Light Rose", colors: ["hsl(0,0%,97%)", "hsl(340,75%,55%)"], class: "theme-light-rose" },
  { id: "light-sky", label: "Light Sky", colors: ["hsl(210,20%,96%)", "hsl(210,80%,50%)"], class: "theme-light-sky" },
  { id: "neon-cyber", label: "Neon Cyber", colors: ["hsl(240,15%,8%)", "hsl(180,100%,50%)"], class: "theme-neon-cyber" },
];

const ThemeSwitcher = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => localStorage.getItem("uem-theme") || "dark-crimson");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.className = root.className.replace(/theme-\S+/g, "").trim();
    const theme = themes.find(t => t.id === active);
    if (theme && theme.id !== "dark-crimson") {
      root.classList.add(theme.class);
    }
    localStorage.setItem("uem-theme", active);
  }, [active]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="font-heading text-xl font-bold gradient-text hover:opacity-80 transition-opacity"
      >
        UEM
      </button>
      <div
        className={`absolute top-full left-0 mt-2 flex gap-2 p-2 rounded-xl border border-border/50 backdrop-blur-xl z-50 transition-all duration-300 origin-top-left ${
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-75 pointer-events-none"
        }`}
        style={{ background: "hsl(220 18% 10% / 0.9)" }}
      >
        {themes.map(t => (
          <button
            key={t.id}
            title={t.label}
            onClick={() => { setActive(t.id); setOpen(false); }}
            className={`relative w-7 h-7 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
              active === t.id ? "border-white scale-110" : "border-transparent"
            } ${t.id === "neon-cyber" ? "neon-dot" : ""}`}
            style={{
              background: `linear-gradient(135deg, ${t.colors[0]} 50%, ${t.colors[1]} 50%)`,
              boxShadow: t.id === "neon-cyber" ? `0 0 8px ${t.colors[1]}, 0 0 16px ${t.colors[1]}40` : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
