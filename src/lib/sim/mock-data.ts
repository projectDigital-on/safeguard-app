// ============================================================
// Mock Data for SIM features
// Used when GIGS_API_KEY is not configured
// Realistic data matching the SafeGuard demo family
// ============================================================

import { SimCard, SimPolicy, SimLocation, SimUsageStats, SimAlert } from "./types";

export const MOCK_SIMS: SimCard[] = [
  {
    id: "sim_emma_001",
    iccid: "8944110068001234567",
    msisdn: "+447700123456",
    childId: "child-emma-001",
    childName: "Emma",
    status: "active",
    dataUsedMb: 412,
    dataLimitMb: 1024,
    activatedAt: "2026-09-01T00:00:00Z",
    lastSeenAt: new Date(Date.now() - 2 * 60000).toISOString(),
    currentPolicyId: "policy_emma_001",
  },
  {
    id: "sim_lucas_001",
    iccid: "8944110068007654321",
    msisdn: "+447700654321",
    childId: "child-lucas-001",
    childName: "Lucas",
    status: "active",
    dataUsedMb: 687,
    dataLimitMb: 2048,
    activatedAt: "2026-08-15T00:00:00Z",
    lastSeenAt: new Date(Date.now() - 5 * 60000).toISOString(),
    currentPolicyId: "policy_lucas_001",
  },
];

export const MOCK_POLICIES: SimPolicy[] = [
  {
    id: "policy_emma_001",
    simId: "sim_emma_001",
    childId: "child-emma-001",
    name: "Emma's Protection",
    blockedCategories: ["adult", "gambling", "violence", "drugs", "vpn", "dating", "weapons"],
    blockedApps: ["TikTok", "Instagram", "Snapchat"],
    allowedDomains: ["khanacademy.org", "bbc.co.uk", "natgeokids.com"],
    blockedDomains: [],
    schedules: [
      {
        id: "sched_bedtime_emma",
        name: "Bedtime",
        days: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
        startTime: "21:00",
        endTime: "07:00",
        action: "block_all",
      },
      {
        id: "sched_school_emma",
        name: "School Hours",
        days: ["MON", "TUE", "WED", "THU", "FRI"],
        startTime: "08:00",
        endTime: "15:00",
        action: "block_categories",
        categories: ["social_media", "gaming", "streaming"],
      },
    ],
    isPaused: false,
    blockVpn: true,
    blockProxy: true,
    blockTor: true,
    safeSarchEnabled: true,
    youtubeRestricted: true,
    dailyDataLimitMb: 512,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "policy_lucas_001",
    simId: "sim_lucas_001",
    childId: "child-lucas-001",
    name: "Lucas's Protection",
    blockedCategories: ["adult", "gambling", "violence", "drugs", "vpn", "dating", "weapons"],
    blockedApps: ["TikTok"],
    allowedDomains: [],
    blockedDomains: [],
    schedules: [
      {
        id: "sched_bedtime_lucas",
        name: "Bedtime",
        days: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
        startTime: "22:00",
        endTime: "07:30",
        action: "block_all",
      },
      {
        id: "sched_school_lucas",
        name: "School Hours",
        days: ["MON", "TUE", "WED", "THU", "FRI"],
        startTime: "08:00",
        endTime: "15:00",
        action: "block_categories",
        categories: ["social_media", "gaming"],
      },
    ],
    isPaused: false,
    blockVpn: true,
    blockProxy: true,
    blockTor: true,
    safeSarchEnabled: true,
    youtubeRestricted: false,
    dailyDataLimitMb: 1024,
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_LOCATIONS: SimLocation[] = [
  {
    simId: "sim_emma_001",
    latitude: 51.5074,
    longitude: -0.1278,
    accuracy: 15,
    address: "123 Oak Street, London",
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    source: "gps",
  },
  {
    simId: "sim_lucas_001",
    latitude: 51.5080,
    longitude: -0.1290,
    accuracy: 20,
    address: "123 Oak Street, London",
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    source: "gps",
  },
];

export const MOCK_USAGE: SimUsageStats[] = [
  {
    simId: "sim_emma_001",
    period: "today",
    totalDataMb: 412,
    blockedRequests: 47,
    allowedRequests: 832,
    daily: [],
    topApps: [
      { domain: "youtube.com", appName: "YouTube", category: "streaming", requestCount: 245, dataMb: 180, firstSeen: "2026-09-25T08:00:00Z", lastSeen: "2026-09-25T18:00:00Z", blocked: false },
      { domain: "khanacademy.org", appName: "Khan Academy", category: "education", requestCount: 120, dataMb: 45, firstSeen: "2026-09-25T09:00:00Z", lastSeen: "2026-09-25T15:00:00Z", blocked: false },
      { domain: "roblox.com", appName: "Roblox", category: "gaming", requestCount: 89, dataMb: 95, firstSeen: "2026-09-25T16:00:00Z", lastSeen: "2026-09-25T18:30:00Z", blocked: false },
      { domain: "tiktok.com", appName: "TikTok", category: "social_media", requestCount: 34, dataMb: 0, firstSeen: "2026-09-25T14:00:00Z", lastSeen: "2026-09-25T16:00:00Z", blocked: true },
      { domain: "instagram.com", appName: "Instagram", category: "social_media", requestCount: 13, dataMb: 0, firstSeen: "2026-09-25T15:00:00Z", lastSeen: "2026-09-25T17:00:00Z", blocked: true },
    ],
    categoryBreakdown: {
      streaming: 180,
      education: 45,
      gaming: 95,
      social_media: 0,
      other: 92,
    },
  },
  {
    simId: "sim_lucas_001",
    period: "today",
    totalDataMb: 687,
    blockedRequests: 23,
    allowedRequests: 1204,
    daily: [],
    topApps: [
      { domain: "minecraft.net", appName: "Minecraft", category: "gaming", requestCount: 312, dataMb: 220, firstSeen: "2026-09-25T16:00:00Z", lastSeen: "2026-09-25T19:00:00Z", blocked: false },
      { domain: "youtube.com", appName: "YouTube", category: "streaming", requestCount: 189, dataMb: 310, firstSeen: "2026-09-25T07:30:00Z", lastSeen: "2026-09-25T21:00:00Z", blocked: false },
      { domain: "discord.com", appName: "Discord", category: "gaming", requestCount: 98, dataMb: 45, firstSeen: "2026-09-25T16:00:00Z", lastSeen: "2026-09-25T21:00:00Z", blocked: false },
      { domain: "tiktok.com", appName: "TikTok", category: "social_media", requestCount: 23, dataMb: 0, firstSeen: "2026-09-25T17:00:00Z", lastSeen: "2026-09-25T19:00:00Z", blocked: true },
    ],
    categoryBreakdown: {
      gaming: 265,
      streaming: 310,
      social_media: 0,
      other: 112,
    },
  },
];

export const MOCK_ALERTS: SimAlert[] = [
  {
    id: "sim_alert_001",
    simId: "sim_emma_001",
    childId: "child-emma-001",
    type: "blocked_app_attempt",
    severity: "info",
    title: "TikTok Blocked",
    message: "Emma tried to open TikTok — blocked by SIM policy",
    data: { domain: "tiktok.com", count: 34 },
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    isRead: false,
  },
  {
    id: "sim_alert_002",
    simId: "sim_emma_001",
    childId: "child-emma-001",
    type: "vpn_attempt",
    severity: "warning",
    title: "VPN Attempt Blocked",
    message: "Emma tried to connect to NordVPN — blocked at SIM level",
    data: { domain: "nordvpn.com" },
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    isRead: false,
  },
  {
    id: "sim_alert_003",
    simId: "sim_lucas_001",
    childId: "child-lucas-001",
    type: "schedule_activated",
    severity: "info",
    title: "Bedtime Mode Active",
    message: "Lucas's SIM internet paused — bedtime schedule activated",
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    isRead: true,
  },
];
