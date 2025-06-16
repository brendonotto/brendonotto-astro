import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";

// https://astro.build/config
export default defineConfig({
  site: "https://brendonotto.com/",
  output: "static",
  integrations: [
    tailwind({
      config: { applyBaseStyles: false },
    }),
    react(),
    sitemap({
      i18n: { defaultLocale: "en" },
    }),
    mdx(),
  ],
  markdown: {
    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
  },
});
