export type ContentType = "film" | "series" | "video" | "music" | "podcast" | "codepen" | "gallery" | "iframe";

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  tags: string[];
  thumbnail: string;
  embed: {
    provider: string;
    iframe: string;
    url: string;
  };
  meta: {
    duration: string;
    author: string;
    date_added: string;
    source: string;
  };
}
