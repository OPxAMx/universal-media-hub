import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { validateAndFix } from "./scripts/validateSampleContent.mjs";

// Runs the sampleContent validator once at dev/build start.
// Auto-fixes recoverable issues; logs and drops unrecoverable entries.
function sampleContentValidator(): Plugin {
  return {
    name: "validate-sample-content",
    enforce: "pre",
    buildStart() {
      try {
        validateAndFix({ write: true, silent: false });
      } catch (e) {
        // Never block the dev server on validator errors.
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
    sampleContentValidator(),
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
