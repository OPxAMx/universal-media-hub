import { ContentType } from "@/types/content";

const typeColors: Record<ContentType, string> = {
  film: "bg-tag-film",
  series: "bg-tag-series",
  video: "bg-tag-series",
  music: "bg-tag-music",
  podcast: "bg-tag-podcast",
  codepen: "bg-tag-code",
  gallery: "bg-tag-gallery",
  iframe: "bg-muted",
};

export function getTypeColor(type: ContentType): string {
  return typeColors[type] || "bg-muted";
}

export function getTagColor(tag: string): string {
  const colors = [
    "bg-tag-film/20 text-tag-film",
    "bg-tag-series/20 text-tag-series",
    "bg-tag-music/20 text-tag-music",
    "bg-tag-podcast/20 text-tag-podcast",
    "bg-tag-code/20 text-tag-code",
    "bg-tag-gallery/20 text-tag-gallery",
  ];
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}
