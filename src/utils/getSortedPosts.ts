import type { BlogEntry } from "../types";

const getSortedPosts = (posts: BlogEntry[]) => {
  return posts
    .filter(({ data }) => !data.draft)
    .sort(
      (a, b) =>
        Math.floor(new Date(b.data.pubDate).getTime() / 1000) -
        Math.floor(new Date(a.data.pubDate).getTime() / 1000)
    );
};

export default getSortedPosts;
