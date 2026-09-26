// ============================================================
// Content Categories & App Definitions
// Used by Policy Engine to know what domains to block
// ============================================================

import { ContentCategory, AppBlock } from "./types";

export const CONTENT_CATEGORIES: ContentCategory[] = [
  {
    id: "adult",
    name: "Adult Content",
    description: "Pornography and explicit sexual content",
    emoji: "🔞",
    examples: ["pornhub.com", "xvideos.com", "onlyfans.com"],
    defaultBlocked: true,
  },
  {
    id: "gambling",
    name: "Gambling",
    description: "Online casinos, betting, and gambling sites",
    emoji: "🎰",
    examples: ["bet365.com", "pokerstars.com", "draftkings.com"],
    defaultBlocked: true,
  },
  {
    id: "violence",
    name: "Violence & Gore",
    description: "Graphic violence, gore, and disturbing content",
    emoji: "⚠️",
    examples: ["liveleak.com", "bestgore.com"],
    defaultBlocked: true,
  },
  {
    id: "drugs",
    name: "Drugs & Alcohol",
    description: "Drug use, drug purchasing, and alcohol promotion",
    emoji: "💊",
    examples: ["silkroad.com", "leafly.com"],
    defaultBlocked: true,
  },
  {
    id: "social_media",
    name: "Social Media",
    description: "Social networking platforms",
    emoji: "📱",
    examples: ["tiktok.com", "instagram.com", "snapchat.com"],
    defaultBlocked: false,
  },
  {
    id: "gaming",
    name: "Online Gaming",
    description: "Online games and gaming platforms",
    emoji: "🎮",
    examples: ["roblox.com", "fortnite.com", "minecraft.net"],
    defaultBlocked: false,
  },
  {
    id: "streaming",
    name: "Video Streaming",
    description: "Video and streaming platforms",
    emoji: "▶️",
    examples: ["youtube.com", "netflix.com", "twitch.tv"],
    defaultBlocked: false,
  },
  {
    id: "vpn",
    name: "VPN & Proxies",
    description: "VPN services and proxy bypass tools",
    emoji: "🔓",
    examples: ["nordvpn.com", "expressvpn.com", "hide.me"],
    defaultBlocked: true,
  },
  {
    id: "dating",
    name: "Dating Apps",
    description: "Online dating and hookup platforms",
    emoji: "💕",
    examples: ["tinder.com", "bumble.com", "grindr.com"],
    defaultBlocked: true,
  },
  {
    id: "weapons",
    name: "Weapons",
    description: "Illegal weapons and extremist content",
    emoji: "🔫",
    examples: ["darkweblinks.com"],
    defaultBlocked: true,
  },
];

// App-level blocks with ALL domains each app uses
export const APP_BLOCKS: AppBlock[] = [
  {
    name: "TikTok",
    emoji: "🎵",
    category: "social_media",
    domains: [
      "tiktok.com",
      "tiktokv.com",
      "musical.ly",
      "bytedance.com",
      "byteoversea.com",
      "tik.tok",
      "sgsnssdk.com",
      "ibytedtos.com",
    ],
  },
  {
    name: "Instagram",
    emoji: "📸",
    category: "social_media",
    domains: [
      "instagram.com",
      "cdninstagram.com",
      "i.instagram.com",
    ],
  },
  {
    name: "Snapchat",
    emoji: "👻",
    category: "social_media",
    domains: [
      "snapchat.com",
      "snap.com",
      "sc-prod.net",
      "snapkit.com",
    ],
  },
  {
    name: "YouTube",
    emoji: "▶️",
    category: "streaming",
    domains: [
      "youtube.com",
      "youtu.be",
      "ytimg.com",
      "googlevideo.com",
      "yt3.ggpht.com",
    ],
  },
  {
    name: "WhatsApp",
    emoji: "💬",
    category: "social_media",
    domains: [
      "whatsapp.com",
      "whatsapp.net",
      "wa.me",
    ],
  },
  {
    name: "Discord",
    emoji: "🎮",
    category: "gaming",
    domains: [
      "discord.com",
      "discordapp.com",
      "discord.gg",
      "discordcdn.com",
    ],
  },
  {
    name: "Roblox",
    emoji: "🟥",
    category: "gaming",
    domains: [
      "roblox.com",
      "rbxcdn.com",
      "robloxlabs.com",
    ],
  },
  {
    name: "Fortnite",
    emoji: "🏆",
    category: "gaming",
    domains: [
      "epicgames.com",
      "fortnite.com",
      "epicgames.dev",
    ],
  },
  {
    name: "Twitter / X",
    emoji: "🐦",
    category: "social_media",
    domains: [
      "twitter.com",
      "x.com",
      "t.co",
      "twimg.com",
    ],
  },
  {
    name: "Reddit",
    emoji: "🤖",
    category: "social_media",
    domains: [
      "reddit.com",
      "redd.it",
      "redditmedia.com",
      "reddituploads.com",
    ],
  },
];

// Filter profile presets
export const FILTER_PROFILES: Record<
  string,
  { name: string; emoji: string; blockedCategories: string[]; description: string }
> = {
  YOUNG_CHILD: {
    name: "Young Child",
    emoji: "🧒",
    description: "Ages 6-9 — Strictest filtering",
    blockedCategories: [
      "adult", "gambling", "violence", "drugs",
      "social_media", "dating", "vpn", "weapons",
    ],
  },
  TWEEN: {
    name: "Tween",
    emoji: "👦",
    description: "Ages 10-12 — Moderate filtering",
    blockedCategories: [
      "adult", "gambling", "violence", "drugs",
      "dating", "vpn", "weapons",
    ],
  },
  TEEN: {
    name: "Teen",
    emoji: "🧑",
    description: "Ages 13-16 — Light filtering",
    blockedCategories: [
      "adult", "gambling", "violence",
      "drugs", "dating", "weapons",
    ],
  },
  CUSTOM: {
    name: "Custom",
    emoji: "⚙️",
    description: "Parent-configured filtering",
    blockedCategories: [],
  },
};

// DNS blocklists per category (used when no Gigs API)
export const CATEGORY_DOMAINS: Record<string, string[]> = {
  adult: [
    "pornhub.com", "xvideos.com", "xnxx.com", "redtube.com",
    "youporn.com", "tube8.com", "onlyfans.com", "chaturbate.com",
  ],
  gambling: [
    "bet365.com", "betway.com", "draftkings.com", "fanduel.com",
    "pokerstars.com", "888casino.com", "williamhill.com",
  ],
  violence: [
    "liveleak.com", "bestgore.com", "goregrish.com",
  ],
  drugs: [
    "erowid.org", "leafly.com", "weedmaps.com",
  ],
  vpn: [
    "nordvpn.com", "expressvpn.com", "surfshark.com", "cyberghost.com",
    "protonvpn.com", "hide.me", "tunnelbear.com", "hotspotshield.com",
    "torproject.org", "hidemyass.com",
  ],
  dating: [
    "tinder.com", "bumble.com", "grindr.com", "hinge.co",
    "okcupid.com", "match.com", "pof.com",
  ],
};
