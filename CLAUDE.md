# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start development server at localhost:3000 |
| `npm run build` | Build production site to ./dist/ |
| `npm run preview` | Preview production build locally |
| `npm run format:check` | Check code formatting with Prettier |
| `npm run format` | Format code with Prettier |
| `npm run cz` | Commit with conventional changelog format |

## Architecture Overview

This is an Astro v4+ blog site based on the AstroPaper template, featuring:

- **Framework**: Astro v5+ with static site generation
- **Styling**: Tailwind CSS with custom base styles
- **Components**: Mix of Astro components and React components
- **Content**: Astro Content Collections for type-safe blog posts
- **Deployment**: Static site generation targeting brendonotto.com

### Key Architecture Patterns

1. **Content Collections**: Blog posts are managed through Astro's Content Collections system
   - Schema defined in `src/content/config.ts`
   - All posts stored in `src/content/blog/`
   - Type-safe access via `CollectionEntry<"blog">`

2. **Hybrid Component System**:
   - Astro components for layouts and static content
   - React components for interactive elements (Search, Card, Datetime)
   - Components use TypeScript with strict typing

3. **Configuration Architecture**:
   - Site configuration centralized in `src/config.ts`
   - Social media links and site metadata managed declaratively
   - Astro config uses integrations for React, Tailwind, Sitemap, and MDX

4. **Routing Strategy**:
   - File-based routing with Astro pages
   - Dynamic routes for blog posts (`[slug].astro`)
   - Tag-based categorization with dynamic tag pages

### Content Management

- Blog posts use frontmatter schema with required fields: title, description, pubDate
- Optional fields: updatedDate, heroImage, category, tags, draft
- Posts support MDX with remark plugins for TOC and collapsible sections
- OG image generation for social sharing

### Styling System

- Tailwind CSS with `applyBaseStyles: false` to prevent conflicts
- Custom base styles in `src/styles/base.css`
- Typography plugin for blog post content
- Light/dark mode support via toggle

### Utility Functions

- Post sorting and filtering utilities in `src/utils/`
- Slugification for URL generation
- Tag management and pagination
- RSS feed generation

## Branch Information

- Current branch: `astro-v4-migration`
- Main branch: `main`
- This codebase has been migrated from Astro v1.8 to v4+ with content collections