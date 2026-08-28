import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import { unified } from "@astrojs/markdown-remark";
import fs from "node:fs";
import remarkPythonRefs from "./src/plugins/remark-python-refs";

// URL map preserving the MkDocs Material blog URLs this site migrated from
let redirects: Record<string, string> = {};
try {
  const redirectsPath = new URL("./src/data/redirects.json", import.meta.url);
  redirects = JSON.parse(fs.readFileSync(redirectsPath, "utf-8"));
} catch {
  // No redirects file yet (run migration first)
}

// The MkDocs-era feed URL is handled by src/pages/feed_rss_created.xml.ts so
// RSS readers get actual XML instead of an HTML meta-refresh redirect.

export default defineConfig({
  // blog.pypi.org serves from the domain root, but a GitHub Pages *project*
  // site serves from /<repo>/. The deploy workflow passes the real values from
  // actions/configure-pages; without them the defaults below are used.
  site: process.env.ASTRO_SITE ?? "https://blog.pypi.org",
  base: process.env.ASTRO_BASE || "/",
  integrations: [mdx(), sitemap(), react()],
  output: "static",
  markdown: {
    processor: unified({ remarkPlugins: [remarkPythonRefs] }),
  },
  redirects,
});
