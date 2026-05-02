import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
// @ts-expect-error - plain JS module, no types
import { validateAndFix } from "./scripts/validateSampleContent.mjs";

// Runs the sampleContent validator at dev/build start.
// - Dev: auto-fixes recoverable issues, never blocks.
// - Production build: STRICT mode — any dropped entry or parse failure fails the build.
function sampleContentValidator(mode: string): Plugin {
  const isProdBuild = mode === "production";
  return {
    name: "validate-sample-content",
    enforce: "pre",
    buildStart() {
      try {
        const result = validateAndFix({ write: true, silent: false });
        if (isProdBuild && (!result.ok || result.dropped > 0)) {
          this.error(
            `[validate-sample-content] STRICT build failed: ` +
              `total=${result.total} valid=${result.valid} fixed=${result.fixed} dropped=${result.dropped}`
          );
        }
      } catch (e) {
        if (isProdBuild) throw e;
        console.warn("[validate-sample-content] skipped:", (e as Error).message);
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    sampleContentValidator(mode),
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
