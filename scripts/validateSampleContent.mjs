#!/usr/bin/env node
/**
 * Validates and auto-fixes common syntax issues in src/data/sampleContent.ts.
 *
 * The file is structured as:
 *   // @ts-nocheck
 *   import { ContentItem } from "@/types/content";
 *   export const sampleContent: ContentItem[] = [ { ...JSON-like objects... } ];
 *
 * We extract the array literal, treat each top-level `{ ... }` block as a
 * JSON object, attempt to JSON.parse it, and try a series of auto-fixes
 * when parsing fails. Unrecoverable entries are dropped (with a warning)
 * so the dev server can always start.
 *
 * Run manually:   node scripts/validateSampleContent.mjs
 * Run with fix:   node scripts/validateSampleContent.mjs --write
 *
 * Also invoked automatically by the Vite plugin in vite.config.ts.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.resolve(__dirname, "..", "src/data/sampleContent.ts");

const HEADER = `// @ts-nocheck
import { ContentItem } from "@/types/content";

export const sampleContent: ContentItem[] = `;
const FOOTER = ";\n";

/** Split the array body into top-level `{...}` object strings. */
function splitObjects(body) {
  const objects = [];
  let depth = 0;
  let start = -1;
  let inString = false;
  let escape = false;
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (escape) { escape = false; continue; }
    if (c === "\\") { escape = true; continue; }
    if (c === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (c === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (c === "}") {
      depth--;
      if (depth === 0 && start !== -1) {
        objects.push(body.slice(start, i + 1));
        start = -1;
      }
    }
  }
  return objects;
}

/** Try a sequence of fixes; return parsed JS object or null. */
function tryParse(raw) {
  const attempts = [
    raw,
    // Remove trailing commas before } or ]
    raw.replace(/,(\s*[}\]])/g, "$1"),
    // Escape stray unescaped double quotes inside string values:
    // pattern like  : "foo "bar" baz"  -> escape inner quotes
    fixStrayQuotes(raw),
    // Combine: stray quotes + trailing commas
    fixStrayQuotes(raw).replace(/,(\s*[}\]])/g, "$1"),
    // Remove control characters
    fixStrayQuotes(raw).replace(/[\u0000-\u001F]+/g, " ").replace(/,(\s*[}\]])/g, "$1"),
  ];
  for (const attempt of attempts) {
    try { return JSON.parse(attempt); } catch { /* try next */ }
  }
  return null;
}

/**
 * Heuristic: walk character-by-character; when inside a JSON string, if we
 * see a `"` that is NOT followed by a valid string-terminator context
 * (`,` `}` `]` `:` whitespace then those), assume it's a stray quote and
 * escape it.
 */
function fixStrayQuotes(s) {
  let out = "";
  let inString = false;
  let escape = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (!inString) {
      out += c;
      if (c === '"') inString = true;
      continue;
    }
    if (escape) { out += c; escape = false; continue; }
    if (c === "\\") { out += c; escape = true; continue; }
    if (c === '"') {
      // Look ahead past whitespace
      let j = i + 1;
      while (j < s.length && (s[j] === " " || s[j] === "\t")) j++;
      const next = s[j];
      if (next === "," || next === "}" || next === "]" || next === ":" || next === "\n" || next === "\r" || j >= s.length) {
        out += c;
        inString = false;
      } else {
        out += '\\"';
      }
      continue;
    }
    out += c;
  }
  return out;
}

export function validateAndFix({ write = false, silent = false } = {}) {
  if (!fs.existsSync(FILE)) {
    if (!silent) console.warn(`[validateSampleContent] File not found: ${FILE}`);
    return { ok: true, total: 0, valid: 0, dropped: 0, fixed: 0 };
  }
  const src = fs.readFileSync(FILE, "utf8");
  const arrStart = src.indexOf("[");
  const arrEnd = src.lastIndexOf("]");
  if (arrStart === -1 || arrEnd === -1) {
    if (!silent) console.warn("[validateSampleContent] Could not locate array literal.");
    return { ok: false, total: 0, valid: 0, dropped: 0, fixed: 0 };
  }
  const body = src.slice(arrStart + 1, arrEnd);
  const rawObjects = splitObjects(body);

  const valid = [];
  let dropped = 0;
  let fixed = 0;

  for (let i = 0; i < rawObjects.length; i++) {
    const raw = rawObjects[i];
    let parsed;
    try { parsed = JSON.parse(raw); }
    catch {
      parsed = tryParse(raw);
      if (parsed) fixed++;
    }
    if (parsed && typeof parsed === "object" && parsed.id) {
      valid.push(parsed);
    } else {
      dropped++;
      if (!silent) {
        const preview = raw.slice(0, 80).replace(/\s+/g, " ");
        console.warn(`[validateSampleContent] Dropped entry #${i}: ${preview}…`);
      }
    }
  }

  const stats = {
    ok: dropped === 0,
    total: rawObjects.length,
    valid: valid.length,
    dropped,
    fixed,
  };

  if (write && (fixed > 0 || dropped > 0)) {
    const json = JSON.stringify(valid, null, 2);
    fs.writeFileSync(FILE, HEADER + json + FOOTER, "utf8");
    if (!silent) console.log(`[validateSampleContent] Rewrote ${FILE} with ${valid.length} entries.`);
  }

  if (!silent) {
    console.log(
      `[validateSampleContent] total=${stats.total} valid=${stats.valid} fixed=${stats.fixed} dropped=${stats.dropped}`
    );
  }
  return stats;
}

// CLI entry
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const write = process.argv.includes("--write");
  const result = validateAndFix({ write });
  process.exit(result.ok ? 0 : (write ? 0 : 1));
}
