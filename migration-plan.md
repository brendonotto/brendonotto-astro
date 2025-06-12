# Astro Migration Plan (v1.8.0 to v4.x)

## Phase 1: Preparation and Backup
- [ ] 1. Create a new git branch for the migration
- [ ] 2. Backup your current `package.json` and `astro.config.mjs`
- [ ] 3. Document your current build and development commands

## Phase 2: Dependencies Update
- [ ] 1. Update core dependencies:
```bash
npm install astro@latest @astrojs/react@latest @astrojs/tailwind@latest @astrojs/sitemap@latest @astrojs/rss@latest
```

- [ ] 2. Update supporting dependencies:
```bash
npm install react@latest react-dom@latest tailwindcss@latest @tailwindcss/typography@latest
```

## Phase 3: Content Migration
- [ ] 1. Create new content collections structure:
  - [ ] Create `src/content/config.ts`:
  ```typescript
  import { defineCollection, z } from 'astro:content';
  
  const blog = defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.date(),
      updatedDate: z.date().optional(),
      heroImage: z.string().optional(),
      category: z.string().optional(),
      tags: z.array(z.string()).optional(),
      draft: z.boolean().optional(),
    })
  });
  
  export const collections = { blog };
  ```

- [ ] 2. Move content:
  - [ ] Create `src/content/blog/` directory
  - [ ] Move all `.md` files from `src/contents/` to `src/content/blog/`
  - [ ] Update frontmatter in all markdown files to match the new schema

## Phase 4: Configuration Updates
- [ ] 1. Update `astro.config.mjs`:
```javascript
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://brendonotto.com/",
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    react(),
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
  },
});
```

## Phase 5: Component Updates
- [ ] 1. Update React components:
  - [ ] Review and update `Search.tsx`
  - [ ] Review and update `Card.tsx`
  - [ ] Review and update `Datetime.tsx`
  - [ ] Review and update `external-link.tsx`
  - [ ] Ensure all React components use the latest React patterns
  - [ ] Update any deprecated React features

- [ ] 2. Update Astro components:
  - [ ] Review `Header.astro`
  - [ ] Review `Footer.astro`
  - [ ] Review other `.astro` files
  - [ ] Update any deprecated Astro features
  - [ ] Check for any client-side directives that might need updating

## Phase 6: Type Updates
- [ ] 1. Update `src/env.d.ts`:
```typescript
/// <reference types="astro/client" />
```

- [ ] 2. Update `src/types.ts` to include new content collection types:
```typescript
import type { CollectionEntry } from 'astro:content';

export type BlogEntry = CollectionEntry<'blog'>;
```

## Phase 7: Testing and Validation
- [ ] 1. Run development server:
```bash
npm run dev
```

- [ ] 2. Test the following functionality:
  - [ ] Blog post rendering
  - [ ] Search functionality
  - [ ] Navigation
  - [ ] RSS feed
  - [ ] Sitemap generation
  - [ ] React components
  - [ ] Tailwind styles

- [ ] 3. Build the site:
```bash
npm run build
```

- [ ] 4. Test the production build:
```bash
npm run preview
```

## Phase 8: Cleanup
- [ ] 1. Remove old content directory:
  - [ ] Delete `src/contents/` after confirming all content is properly migrated
- [ ] 2. Update any remaining references to old content paths
- [ ] 3. Clean up any unused dependencies

## Phase 9: Documentation
- [ ] 1. Update README.md with:
  - [ ] New version information
  - [ ] Updated development instructions
  - [ ] Any new features or changes in functionality

## Potential Issues to Watch For:
- [ ] 1. React hydration mismatches
- [ ] 2. Content collection type errors
- [ ] 3. Tailwind class conflicts
- [ ] 4. RSS feed generation issues
- [ ] 5. Sitemap generation problems 