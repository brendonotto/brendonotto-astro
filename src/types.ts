import type { CollectionEntry } from "astro:content";

export type BlogEntry = CollectionEntry<"blog">;

export interface Frontmatter {
  title: string;
  author?: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  heroImage?: string;
  category?: string;
  tags?: string[];
  draft?: boolean;
  slug?: string;
}

export type SocialObjects = {
  name: SocialMedia;
  href: string;
  active: boolean;
  linkTitle: string;
}[];

export type SocialIcons = {
  [social in SocialMedia]: string;
};

export type SocialMedia =
  | "Github"
  | "Facebook"
  | "Instagram"
  | "LinkedIn"
  | "Mail"
  | "Twitter"
  | "Twitch"
  | "YouTube"
  | "WhatsApp"
  | "Snapchat"
  | "Pinterest"
  | "TikTok"
  | "CodePen"
  | "Discord"
  | "GitLab"
  | "Reddit"
  | "Skype"
  | "Steam"
  | "Telegram"
  | "Mastodon";
