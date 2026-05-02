import { useEffect } from "react";

/**
 * Fixed neon ambient beams covering the whole viewport.
 * Hue + intensity are driven by scroll position via CSS variables
 * (--scroll-hue in deg-units, --scroll-progress 0..1) set on <html>.
 */
const NeonBeams = () => {
  useEffect(() => {
    let ticking = false;
    const update = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / max));
      const hue = Math.round(progress * 360);
      doc.style.setProperty("--scroll-progress", progress.toFixed(3));
      doc.style.setProperty("--scroll-hue", String(hue));
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="neon-beams" aria-hidden="true">
      <div className="beam-core" />
      <div className="beam-grid" />
    </div>
  );
};

export default NeonBeams;
