import { useEffect, useState } from "react";

const subs = new Set<(v: boolean) => void>();
let current = false;

export function useFiltersOpen(): [boolean, (v: boolean) => void, () => void] {
  const [open, setOpenState] = useState(current);

  useEffect(() => {
    const handler = (v: boolean) => setOpenState(v);
    subs.add(handler);
    return () => { subs.delete(handler); };
  }, []);

  const setOpen = (v: boolean) => {
    current = v;
    subs.forEach(fn => fn(v));
  };
  const toggle = () => setOpen(!current);

  return [open, setOpen, toggle];
}
