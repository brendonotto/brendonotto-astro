---
title: "Setting Up MDX with Next.js"
date: "2021-09-11"
author:
  name: "Brendon Otto"
  picture: "/assets/blog/authors/brendon.jpg"
slug: "setting-up-mdx-with-nextjs"
coverImage:
  path: "/assets/blog/setting-up-mdx-with-nextjs/mdx-logo.png"
  height: "200"
  width: "200"
ogImage:
  url: "/assets/blog/setting-up-mdx-with-nextjs/mdx-logo.png"
imageAttribution: ""
excerpt: "How I set up MDX for this blog"
---

import ExternalLink from '../components/external-link.tsx'

This blog was generated using Next.js <ExternalLink url={`https://github.com/vercel/next.js/tree/canary/examples/blog-starter-typescript`}>Typescript blog template</ExternalLink> which was fantastic to use to get everything up and running. I also wanted to be able to embed componets on top of writing posts. To do so I chose `mdx-enhanced` by Kent C. Dodds as it works as a compiler and a transpiler. It was also recommneded by Josh W. Comeau in <ExternalLink url={`https://www.joshwcomeau.com/blog/how-i-built-my-blog/`}>this post</ExternalLink> talking about how he set up his blog.

### What is MDX?

<ExternalLink url={`https://mdxjs.com/`}>MDX</ExternalLink> is an enhancement to Markdown that supports writing JSX in Markdown documents. For my purposes it means that I can write React components and render them in my blog! All the links on this page are using a component for just this purpose!

### Changes in order to get it working

By default the blog starter template uses `grey-matter` which will be swapped out for `mdx-bundler`. First step, get the dependencies:

```bash
npm install --save mdx-bundler esbuild
```

`esbuild` is required per the docs on `mdx-bundlers` <ExternalLink url={`https://github.com/kentcdodds/mdx-bundler#installation`}>site</ExternalLink>

Now that we have our dependencies set up, we need to switch from `remark` to `mdx-bundler`.

First, let's crack open `lib/api.ts` where all the code lives to find all posts and generate an individual post. We'll start with changing the function `getPostBySlug` from:

```typescript
export function getPostBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  type Items = {
    [key: string]: string;
      items[field] = realSlug;
    }
    if (field === "content") {
      items[field] = content;
    }

    if (data[field]) {
      items[field] = data[field];
    if (frontmatter[field]) {
      items[field] = frontmatter[field];
    }
  });

  return items;
}
```

to this:

```typescript
export async function getPostBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const { code, frontmatter } = await bundleMDX(fileContents, {
    cwd: dirname(fullPath),
  });

  type Items = {
    [key: string]: string;
      items[field] = realSlug;
    }
    if (field === "content") {
      items[field] = code;
    }

    if (data[field]) {
      items[field] = data[field];
    if (frontmatter[field]) {
      items[field] = frontmatter[field];
    }
  });

  return items;
}
```

First thing was to `import { bundleMDX } from 'mdx-bundler'` and then call `bundleMDX` with the contents of a given blog post. This is an `async` function so it needs to be `await`-ed in order to get the result. Let's change the signature of `getPostBySlug` to be `async` also. `bundleMDX` returns an object with properties of `code` and `frontmatter`. `code` contains the contents of the Markdown post with any `JSX` already injected into it. `frontmatter` contains all our metadata of a post and uses `grey-matter` to retrieve it all. This made for a simple transition to support all the existing frontmatter properties I was already using. I did take an extra step to ensure that `mdx-bundler` would work when building on a Unix system or Windows system and included this code:

```typescript
if (process.platform === "win32") {
  process.env.ESBUILD_BINARY_PATH = join(
    process.cwd(),
    "node_modules",
    "esbuild",
    "esbuild.exe"
  );
} else {
  process.env.ESBUILD_BINARY_PATH = join(
    process.cwd(),
    "node_modules",
    "esbuild",
    "bin",
    "esbuild"
  );
}
```

This tells `node` to find the proper binary from `node_modules` regardless of which system it's run on.

Now that's set up we need to change any locations that call this function to `await` a result. The first one I changed was `getAllPosts` which is in `lib/api.ts`. Before:

```typescript
export function getAllPosts(fields: string[] = []) {
  const slugs = getPostSlugs();
  const posts = slugs.map((slug) => getPostBySlug(slug, fields));
  posts
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));

  return posts;
}
```

after:

```typescript
export async function getAllPosts(fields: string[] = []) {
  const slugs = getPostSlugs();
  let posts = (
    await Promise.all(slugs.map((slug) => getPostBySlug(slug, fields)))
  ).filter((p) => p);

  posts
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));

  return posts;
}
```

Here we need to update the function to be `async` too so we can `await Promise.all()`. We'll take all the post slugs that were found on the filesystem from `getPostSlugs()` and send each one into the updated `getPostBySlug()` function. Using `Promise.all()` means we can execute them all in parallel and `await` the final result. The extra `filter()` function applied removes and empty entries in the array. From there the sort by data logic is unchanges as the `posts` array is already populated. You'll now need to search for all other calling locations of these two functions to update them to be `await`-ed. This included `pages/index.tsx` and `pages/posts/[slug].tsx` from the template.

Now to update our `[slug].tsx` file to render the MDX post. We'll need to `import { getMDXComponent } from "mdx-bundler/client"` and in our `Post` component we'll wrap the call to `getMDXComponent` in a `useMemo()` like this:

```typescript
const Component = React.useMemo(() => getMDXComponent(post?.content), [post]);
```

This will reduce re-render calls when the data hasn't changed. The post and post.content that's being passed in come from `getStaticProps` which as been `async`-ified along with `getStaticPaths`. With this complete `mdx-bundler` is now parsing JSX from within Markdown files and rendering them out! 🎉

### Troubleshooting

If you see any errors around `Unexpected token '<'` that most likely means that somewhere along your Markdown processing pipeline you trying to convert to HTML still. I ran into this when I forgot that `getStaticProps` was still being called with the markdown content.

### Shout outs

I leaned very heavily on a couple of posts in order to get this all set up. One from <ExternalLink url={`https://www.joshwcomeau.com/blog/how-i-built-my-blog/`}>Josh W. Comeau</ExternalLink> and the other from <ExternalLink url={`https://www.notjust.dev/blog/2021-06-21-how-i-built-the-new-notjustdev-platoform-using-nextjs`}>notJustDev</ExternalLink>. They helped immensily in deciding what technology to use and thank you to notjustDev for having their <ExternalLink url={`https://github.com/Savinvadim1312/notjustdev`}>site open source</ExternalLink> so I could review how it was implemented.

✌
