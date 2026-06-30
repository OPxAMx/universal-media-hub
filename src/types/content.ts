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
    /** Optional French version of the embed (iframe + url). Primary embed (above) is English by convention. */
    iframe_fr?: string;
    url_fr?: string;
  };
  meta: {
    duration: string;
    author: string;
    date_added: string;
    source: string;
    backdrop?: string;
    vote_average?: number;
    production_companies?: string[] | string;
    cast?: string[] | string;
    director?: string;
    producers?: string[] | string;
    genres?: string[];
    [key: string]: any;
  };
  /** For type === "gallery": ordered list of media IDs (any type) included in the gallery. */
  galleryItems?: string[];
}
