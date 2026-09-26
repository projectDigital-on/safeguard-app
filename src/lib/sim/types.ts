// ============================================================
// SIM-Level Parental Control - Type Definitions
// Based on Gigs.com API + SafeGuard domain model
// ============================================================

// ── SIM Status ───────────────────────────────────────────────
export type SimStatus = "active" | "inactive" | "suspended" | "terminated";

export interface SimCard {
  id: string;
  iccid: string;           // SIM serial number
  msisdn?: string;         // Phone number
  childId: string;
  childName: string;
  status: SimStatus;
  dataUsedMb: number;
  dataLimitMb: number;
  activatedAt: string;
  lastSeenAt?: string;
  currentPolicyId?: string;
}

// ── Policy (blocking rules) ──────────────────────────────────
export type PolicyAction = "block" | "allow" | "throttle";

export interface ContentCategory {
  id: string;
  name: string;
  description: string;
  emoji: string;
  examples: string[];
  defaultBlocked: boolean;
}

export interface AppBlock {
  name: string;
  domains: string[];       // All domains used by this app
  category: string;
  emoji: string;
}

export interface ScheduleRule {
  id: string;
  name: string;
  days: ("MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN")[];
  startTime: string;       // "21:00"
  endTime: string;         // "07:00"
  action: "block_all" | "allow_only_whitelist" | "block_categories";
  categories?: string[];   // If action is block_categories
}

export interface SimPolicy {
  id: string;
  simId: string;
  childId: string;
  name: string;

  // Content filtering
  blockedCategories: string[];
  blockedApps: string[];
  allowedDomains: string[];    // Whitelist
  blockedDomains: string[];    // Custom blocks

  // Schedules
  schedules: ScheduleRule[];

  // Real-time controls
  isPaused: boolean;           // Immediately pause all internet
  pausedUntil?: string;        // Auto-resume time

  // Safety
  blockVpn: boolean;
  blockProxy: boolean;
  blockTor: boolean;
  safeSarchEnabled: boolean;
  youtubeRestricted: boolean;

  // Data limits
  dailyDataLimitMb?: number;
  monthlyDataLimitMb?: number;

  updatedAt: string;
}

// ── Location ────────────────────────────────────────────────
export interface SimLocation {
  simId: string;
  latitude: number;
  longitude: number;
  accuracy: number;          // meters
  address?: string;
  timestamp: string;
  source: "gps" | "cell" | "wifi";
}

// ── Usage Stats ─────────────────────────────────────────────
export interface AppUsageStat {
  domain: string;
  appName: string;
  category: string;
  requestCount: number;
  dataMb: number;
  firstSeen: string;
  lastSeen: string;
  blocked: boolean;
}

export interface DailyUsage {
  date: string;
  totalDataMb: number;
  blockedRequests: number;
  allowedRequests: number;
  topApps: AppUsageStat[];
}

export interface SimUsageStats {
  simId: string;
  period: "today" | "week" | "month";
  totalDataMb: number;
  blockedRequests: number;
  allowedRequests: number;
  daily: DailyUsage[];
  topApps: AppUsageStat[];
  categoryBreakdown: Record<string, number>;
}

// ── Alerts ──────────────────────────────────────────────────
export type SimAlertType =
  | "blocked_app_attempt"      // Child tried to open blocked app
  | "vpn_attempt"              // Child tried to use VPN
  | "data_limit_reached"       // Daily/monthly data limit reached
  | "sim_removed"              // SIM removed from device
  | "sos_triggered"            // Child sent SOS
  | "geofence_exit"            // Child left safe zone
  | "schedule_activated"       // Bedtime/school mode activated
  | "unusual_activity";        // AI detected unusual pattern

export interface SimAlert {
  id: string;
  simId: string;
  childId: string;
  type: SimAlertType;
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  data?: Record<string, unknown>;
  createdAt: string;
  isRead: boolean;
}

// ── Gigs API Response types ──────────────────────────────────
export interface GigsSubscription {
  id: string;
  object: "subscription";
  status: SimStatus;
  sim: {
    id: string;
    iccid: string;
  };
  phoneNumber?: {
    number: string;
  };
  currentPeriod: {
    start: string;
    end: string;
  };
  plan: {
    id: string;
    name: string;
    data: {
      amount: number;
      unit: "MB" | "GB";
    };
  };
}

export interface GigsApiError {
  object: "error";
  type: string;
  message: string;
  code: string;
}

// ── Dashboard view models ────────────────────────────────────
export interface SimDashboardCard {
  sim: SimCard;
  policy: SimPolicy;
  location?: SimLocation;
  todayUsage: {
    dataMb: number;
    blockedCount: number;
    topBlockedApp?: string;
  };
  alerts: SimAlert[];
}
