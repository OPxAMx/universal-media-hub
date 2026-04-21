import { LiveChannel } from "@/types/livetv";

/**
 * Parse a M3U / M3U8 playlist string into LiveChannel objects.
 * Supports #EXTINF tvg-id, tvg-name, tvg-logo, tvg-language, tvg-country, group-title,
 * #EXTVLCOPT http-user-agent / http-referrer, and #EXTGRP fallback.
 */
export function parseM3U(content: string): LiveChannel[] {
  const lines = content.split(/\r?\n/);
  const channels: LiveChannel[] = [];

  let current: Partial<LiveChannel> | null = null;
  let pendingGroup: string | undefined;
  let userAgent: string | undefined;
  let referer: string | undefined;

  const attr = (line: string, key: string): string | undefined => {
    const re = new RegExp(`${key}="([^"]*)"`, "i");
    const m = line.match(re);
    return m ? m[1] : undefined;
  };

  for (let raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith("#EXTM3U")) continue;

    if (line.startsWith("#EXTINF")) {
      const commaIdx = line.indexOf(",");
      const name = commaIdx >= 0 ? line.slice(commaIdx + 1).trim() : "Sans titre";
      current = {
        name,
        tvgId: attr(line, "tvg-id"),
        tvgLanguage: attr(line, "tvg-language"),
        tvgCountry: attr(line, "tvg-country"),
        logo: attr(line, "tvg-logo"),
        group: attr(line, "group-title") || pendingGroup,
        raw: line,
      };
      const tvgName = attr(line, "tvg-name");
      if (tvgName && (!name || name === "Sans titre")) current.name = tvgName;
      pendingGroup = undefined;
      userAgent = undefined;
      referer = undefined;
      continue;
    }

    if (line.startsWith("#EXTGRP:")) {
      const g = line.slice(8).trim();
      if (current) current.group = current.group || g;
      else pendingGroup = g;
      continue;
    }

    if (line.startsWith("#EXTVLCOPT:")) {
      const opt = line.slice(11);
      const [k, v] = opt.split("=");
      if (k && v) {
        if (/http-user-agent/i.test(k)) userAgent = v.trim();
        else if (/http-referrer|http-referer/i.test(k)) referer = v.trim();
      }
      continue;
    }

    if (line.startsWith("#")) continue;

    // URL line
    if (current) {
      const ch: LiveChannel = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        name: current.name || "Sans titre",
        url: line,
        logo: current.logo,
        group: current.group,
        tvgId: current.tvgId,
        tvgLanguage: current.tvgLanguage,
        tvgCountry: current.tvgCountry,
        userAgent,
        referer,
        raw: current.raw,
      };
      channels.push(ch);
      current = null;
    } else {
      // Bare URL without EXTINF
      channels.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        name: line.split("/").pop() || "Sans titre",
        url: line,
      });
    }
  }

  return channels;
}

/** Serialize channels back to M3U format. */
export function serializeM3U(channels: LiveChannel[]): string {
  const out: string[] = ["#EXTM3U"];
  for (const ch of channels) {
    const attrs: string[] = [];
    if (ch.tvgId) attrs.push(`tvg-id="${ch.tvgId}"`);
    if (ch.tvgLanguage) attrs.push(`tvg-language="${ch.tvgLanguage}"`);
    if (ch.tvgCountry) attrs.push(`tvg-country="${ch.tvgCountry}"`);
    if (ch.logo) attrs.push(`tvg-logo="${ch.logo}"`);
    if (ch.group) attrs.push(`group-title="${ch.group}"`);
    out.push(`#EXTINF:-1 ${attrs.join(" ")},${ch.name}`);
    if (ch.userAgent) out.push(`#EXTVLCOPT:http-user-agent=${ch.userAgent}`);
    if (ch.referer) out.push(`#EXTVLCOPT:http-referrer=${ch.referer}`);
    out.push(ch.url);
  }
  return out.join("\n");
}
