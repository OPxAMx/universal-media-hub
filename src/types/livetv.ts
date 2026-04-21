export interface LiveChannel {
  id: string;
  name: string;
  url: string;
  logo?: string;
  group?: string;
  tvgId?: string;
  tvgLanguage?: string;
  tvgCountry?: string;
  userAgent?: string;
  referer?: string;
  /** Original raw EXTINF line, useful for re-export */
  raw?: string;
}

export interface LivePlaylist {
  id: string;
  name: string;
  /** Source URL if loaded from remote, empty if imported from file/text */
  source?: string;
  /** ISO date */
  importedAt: string;
  channels: LiveChannel[];
}
