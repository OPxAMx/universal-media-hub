import { useEffect, useState } from "react";

export type ViewMode = "grid" | "list" | "horizontal";
const KEY = "uem-view-mode";

const subs = new Set<(m: ViewMode) => void>();

export function useViewMode(): [ViewMode, (m: ViewMode) => void] {
  const [mode, setModeState] = useState<ViewMode>(() => {
    if (typeof window === "undefined") return "grid";
    return (localStorage.getItem(KEY) as ViewMode) || "grid";
  });

  useEffect(() => {
    const handler = (m: ViewMode) => setModeState(m);
    subs.add(handler);
    return () => { subs.delete(handler); };
  }, []);

  const setMode = (m: ViewMode) => {
    localStorage.setItem(KEY, m);
    subs.forEach(fn => fn(m));
  };

  return [mode, setMode];
}
