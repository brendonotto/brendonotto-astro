import { SITE } from "src/config";
import rss from "@astrojs/rss";
import type { Frontmatter } from "src/types";
import type { MarkdownInstance } from "astro";
import slugify from "@utils/slugify";
import { getCollection } from 'astro:content';

const posts = (await getCollection('blog')).map((post: any) => ({
  frontmatter: post.data,
  file: post.id,
  url: post.slug,
  Content: post.render,
  rawContent: post.body,
  compiledContent: post.body,
  getHeadings: () => [],
  default: post.render,
})) as unknown as MarkdownInstance<Frontmatter>[];

export const GET = () =>
  rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: posts
      .filter(({ frontmatter }) => !frontmatter.draft)
      .map(({ frontmatter }) => ({
        link: `posts/${slugify(frontmatter)}`,
        title: frontmatter.title,
        description: frontmatter.description,
        pubDate: new Date(frontmatter.pubDate),
      })),
  });
