// ============================================================
// Policy Engine
// Translates high-level rules into domain blocklists
// ============================================================

import { APP_BLOCKS, CATEGORY_DOMAINS } from "./content-categories";
import { SimPolicy, ScheduleRule } from "./types";

/**
 * Build the complete domain blocklist from:
 * - Category names (e.g. "adult", "gambling")
 * - App names (e.g. "TikTok", "Instagram")
 * - Custom domains
 */
export function buildDomainBlocklist(
  blockedCategories: string[],
  blockedApps: string[],
  customDomains: string[] = []
): string[] {
  const domains = new Set<string>(customDomains);

  // Add all domains for each blocked category
  for (const category of blockedCategories) {
    const categoryDomains = CATEGORY_DOMAINS[category] || [];
    categoryDomains.forEach(d => domains.add(d));
  }

  // Add all domains for each blocked app
  for (const appName of blockedApps) {
    const app = APP_BLOCKS.find(
      a => a.name.toLowerCase() === appName.toLowerCase()
    );
    if (app) {
      app.domains.forEach(d => domains.add(d));
    }
  }

  return Array.from(domains);
}

/**
 * Check if current time falls within a schedule block
 */
export function isScheduleActive(schedule: ScheduleRule): boolean {
  const now = new Date();
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const currentDay = days[now.getDay()] as ScheduleRule["days"][number];

  if (!schedule.days.includes(currentDay)) return false;

  const [startH, startM] = schedule.startTime.split(":").map(Number);
  const [endH, endM] = schedule.endTime.split(":").map(Number);

  const currentMins = now.getHours() * 60 + now.getMinutes();
  const startMins = startH * 60 + startM;
  const endMins = endH * 60 + endM;

  // Handle overnight schedules (e.g. 21:00 - 07:00)
  if (startMins > endMins) {
    return currentMins >= startMins || currentMins < endMins;
  }

  return currentMins >= startMins && currentMins < endMins;
}

/**
 * Get the effective policy at current time
 * (considering active schedules)
 */
export function getEffectivePolicy(policy: SimPolicy): {
  isBlocked: boolean;
  reason?: string;
  blockedDomains: string[];
} {
  // Paused = block everything
  if (policy.isPaused) {
    return {
      isBlocked: true,
      reason: "Internet paused by parent",
      blockedDomains: ["*"],
    };
  }

  // Check active schedules
  for (const schedule of policy.schedules) {
    if (isScheduleActive(schedule)) {
      if (schedule.action === "block_all") {
        return {
          isBlocked: true,
          reason: `${schedule.name} is active`,
          blockedDomains: ["*"],
        };
      }
    }
  }

  // Normal filtering
  const domains = buildDomainBlocklist(
    policy.blockedCategories,
    policy.blockedApps,
    policy.blockedDomains
  );

  return {
    isBlocked: false,
    blockedDomains: domains,
  };
}

/**
 * Evaluate if a specific domain is blocked
 */
export function isDomainBlocked(domain: string, policy: SimPolicy): boolean {
  const { isBlocked, blockedDomains } = getEffectivePolicy(policy);

  if (isBlocked) return true;
  if (blockedDomains.includes("*")) return true;

  return blockedDomains.some(blocked => {
    if (blocked === domain) return true;
    if (domain.endsWith(`.${blocked}`)) return true;
    return false;
  });
}

/**
 * Generate policy summary for display
 */
export function getPolicySummary(policy: SimPolicy): {
  activeRules: number;
  blockedApps: number;
  blockedCategories: number;
  schedulesActive: number;
  status: "paused" | "active" | "school" | "bedtime";
  statusLabel: string;
} {
  const activeSchedules = policy.schedules.filter(isScheduleActive);
  const bedtimeSchedule = activeSchedules.find(
    s => s.name.toLowerCase().includes("bedtime") || s.name.toLowerCase().includes("sleep")
  );
  const schoolSchedule = activeSchedules.find(
    s => s.name.toLowerCase().includes("school")
  );

  let status: "paused" | "active" | "school" | "bedtime" = "active";
  let statusLabel = "Active";

  if (policy.isPaused) {
    status = "paused";
    statusLabel = "Paused by parent";
  } else if (bedtimeSchedule) {
    status = "bedtime";
    statusLabel = "Bedtime mode";
  } else if (schoolSchedule) {
    status = "school";
    statusLabel = "School mode";
  }

  return {
    activeRules:
      policy.blockedCategories.length +
      policy.blockedApps.length +
      policy.blockedDomains.length,
    blockedApps: policy.blockedApps.length,
    blockedCategories: policy.blockedCategories.length,
    schedulesActive: activeSchedules.length,
    status,
    statusLabel,
  };
}
