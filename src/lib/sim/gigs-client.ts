// ============================================================
// Gigs.com API Client
// https://developers.gigs.com/docs/api
//
// Set GIGS_API_KEY + GIGS_PROJECT_ID in .env to use real API.
// Without credentials, all methods return realistic mock data.
// ============================================================

import {
  SimCard, SimPolicy, SimLocation, SimUsageStats,
  SimAlert, GigsSubscription, SimStatus,
} from "./types";
import { MOCK_SIMS, MOCK_POLICIES, MOCK_LOCATIONS, MOCK_USAGE } from "./mock-data";

const GIGS_BASE_URL = "https://api.gigs.com";
const API_KEY = process.env.GIGS_API_KEY;
const PROJECT_ID = process.env.GIGS_PROJECT_ID;

const isConfigured = !!(API_KEY && PROJECT_ID);

// ── HTTP helper ──────────────────────────────────────────────
async function gigsRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  if (!isConfigured) {
    throw new Error("Gigs API not configured");
  }

  const res = await fetch(`${GIGS_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || `Gigs API error: ${res.status}`);
  }

  return res.json();
}

// ── SIM Management ───────────────────────────────────────────

/**
 * Get all SIMs for a project (mapped to children)
 */
export async function getAllSims(): Promise<SimCard[]> {
  if (!isConfigured) return MOCK_SIMS;

  const data = await gigsRequest<{ subscriptions: GigsSubscription[] }>(
    `/projects/${PROJECT_ID}/subscriptions`
  );

  return data.subscriptions.map(mapGigsSubscriptionToSim);
}

/**
 * Get a single SIM by ID
 */
export async function getSimById(simId: string): Promise<SimCard | null> {
  if (!isConfigured) {
    return MOCK_SIMS.find(s => s.id === simId) ?? null;
  }

  const data = await gigsRequest<GigsSubscription>(
    `/projects/${PROJECT_ID}/subscriptions/${simId}`
  );

  return mapGigsSubscriptionToSim(data);
}

/**
 * Activate a new SIM card for a child
 */
export async function activateSim(params: {
  childId: string;
  iccid: string;
  planId?: string;
}): Promise<SimCard> {
  if (!isConfigured) {
    const mockSim: SimCard = {
      id: `sim_${Date.now()}`,
      iccid: params.iccid,
      childId: params.childId,
      childName: "New Child",
      status: "active",
      dataUsedMb: 0,
      dataLimitMb: 1024,
      activatedAt: new Date().toISOString(),
    };
    return mockSim;
  }

  const data = await gigsRequest<GigsSubscription>(
    `/projects/${PROJECT_ID}/subscriptions`,
    {
      method: "POST",
      body: JSON.stringify({
        sim: { iccid: params.iccid },
        plan: { id: params.planId || process.env.GIGS_DEFAULT_PLAN_ID },
        user: { id: params.childId },
      }),
    }
  );

  return mapGigsSubscriptionToSim(data);
}

/**
 * Suspend a SIM (pause internet instantly)
 */
export async function suspendSim(simId: string): Promise<SimCard> {
  if (!isConfigured) {
    const sim = MOCK_SIMS.find(s => s.id === simId);
    if (sim) sim.status = "suspended";
    return sim ?? MOCK_SIMS[0];
  }

  const data = await gigsRequest<GigsSubscription>(
    `/projects/${PROJECT_ID}/subscriptions/${simId}/suspend`,
    { method: "POST" }
  );

  return mapGigsSubscriptionToSim(data);
}

/**
 * Resume a suspended SIM
 */
export async function resumeSim(simId: string): Promise<SimCard> {
  if (!isConfigured) {
    const sim = MOCK_SIMS.find(s => s.id === simId);
    if (sim) sim.status = "active";
    return sim ?? MOCK_SIMS[0];
  }

  const data = await gigsRequest<GigsSubscription>(
    `/projects/${PROJECT_ID}/subscriptions/${simId}/resume`,
    { method: "POST" }
  );

  return mapGigsSubscriptionToSim(data);
}

/**
 * Terminate a SIM permanently
 */
export async function terminateSim(simId: string): Promise<void> {
  if (!isConfigured) {
    const idx = MOCK_SIMS.findIndex(s => s.id === simId);
    if (idx !== -1) MOCK_SIMS[idx].status = "terminated";
    return;
  }

  await gigsRequest(
    `/projects/${PROJECT_ID}/subscriptions/${simId}`,
    { method: "DELETE" }
  );
}

// ── Policy Engine ────────────────────────────────────────────

/**
 * Get current policy for a SIM
 */
export async function getSimPolicy(simId: string): Promise<SimPolicy | null> {
  if (!isConfigured) {
    return MOCK_POLICIES.find(p => p.simId === simId) ?? null;
  }

  // Gigs.com uses "data_allowances" and "restrictions" endpoints
  // Map them to our SimPolicy format
  const restrictions = await gigsRequest<{ domains: string[]; categories: string[] }>(
    `/projects/${PROJECT_ID}/subscriptions/${simId}/restrictions`
  );

  return {
    id: `policy_${simId}`,
    simId,
    childId: "",
    name: "Active Policy",
    blockedCategories: restrictions.categories || [],
    blockedApps: [],
    allowedDomains: [],
    blockedDomains: restrictions.domains || [],
    schedules: [],
    isPaused: false,
    blockVpn: true,
    blockProxy: true,
    blockTor: true,
    safeSarchEnabled: true,
    youtubeRestricted: true,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Apply a new policy to a SIM
 * This is the core function that actually blocks TikTok, etc.
 */
export async function applySimPolicy(
  simId: string,
  policy: Partial<SimPolicy>
): Promise<SimPolicy> {
  if (!isConfigured) {
    const existing = MOCK_POLICIES.find(p => p.simId === simId);
    if (existing) {
      Object.assign(existing, policy, { updatedAt: new Date().toISOString() });
      return existing;
    }
    const newPolicy: SimPolicy = {
      id: `policy_${simId}`,
      simId,
      childId: policy.childId || "",
      name: policy.name || "Default Policy",
      blockedCategories: policy.blockedCategories || [],
      blockedApps: policy.blockedApps || [],
      allowedDomains: policy.allowedDomains || [],
      blockedDomains: policy.blockedDomains || [],
      schedules: policy.schedules || [],
      isPaused: policy.isPaused || false,
      blockVpn: policy.blockVpn ?? true,
      blockProxy: policy.blockProxy ?? true,
      blockTor: policy.blockTor ?? true,
      safeSarchEnabled: policy.safeSarchEnabled ?? true,
      youtubeRestricted: policy.youtubeRestricted ?? false,
      updatedAt: new Date().toISOString(),
    };
    MOCK_POLICIES.push(newPolicy);
    return newPolicy;
  }

  // Build domain list from blocked apps and categories
  const { buildDomainBlocklist } = await import("./policy-engine");
  const domains = buildDomainBlocklist(
    policy.blockedCategories || [],
    policy.blockedApps || [],
    policy.blockedDomains || []
  );

  // Push to Gigs API
  await gigsRequest(
    `/projects/${PROJECT_ID}/subscriptions/${simId}/restrictions`,
    {
      method: "PUT",
      body: JSON.stringify({ domains }),
    }
  );

  return {
    id: `policy_${simId}`,
    simId,
    childId: policy.childId || "",
    name: policy.name || "Active Policy",
    blockedCategories: policy.blockedCategories || [],
    blockedApps: policy.blockedApps || [],
    allowedDomains: policy.allowedDomains || [],
    blockedDomains: policy.blockedDomains || [],
    schedules: policy.schedules || [],
    isPaused: policy.isPaused || false,
    blockVpn: policy.blockVpn ?? true,
    blockProxy: policy.blockProxy ?? true,
    blockTor: policy.blockTor ?? true,
    safeSarchEnabled: policy.safeSarchEnabled ?? true,
    youtubeRestricted: policy.youtubeRestricted ?? false,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Instantly pause ALL internet for a SIM
 */
export async function pauseSimInternet(simId: string): Promise<void> {
  if (!isConfigured) {
    const policy = MOCK_POLICIES.find(p => p.simId === simId);
    if (policy) policy.isPaused = true;
    return;
  }

  await suspendSim(simId);
}

/**
 * Resume internet after pause
 */
export async function resumeSimInternet(simId: string): Promise<void> {
  if (!isConfigured) {
    const policy = MOCK_POLICIES.find(p => p.simId === simId);
    if (policy) policy.isPaused = false;
    return;
  }

  await resumeSim(simId);
}

// ── Location ─────────────────────────────────────────────────

/**
 * Get real-time location of a SIM
 */
export async function getSimLocation(simId: string): Promise<SimLocation | null> {
  if (!isConfigured) {
    return MOCK_LOCATIONS.find(l => l.simId === simId) ?? null;
  }

  try {
    const data = await gigsRequest<{
      latitude: number;
      longitude: number;
      accuracy: number;
      timestamp: string;
    }>(`/projects/${PROJECT_ID}/subscriptions/${simId}/location`);

    return {
      simId,
      latitude: data.latitude,
      longitude: data.longitude,
      accuracy: data.accuracy,
      timestamp: data.timestamp,
      source: "cell",
    };
  } catch {
    return null;
  }
}

// ── Usage Stats ──────────────────────────────────────────────

/**
 * Get usage statistics for a SIM
 */
export async function getSimUsage(
  simId: string,
  period: "today" | "week" | "month" = "today"
): Promise<SimUsageStats> {
  if (!isConfigured) {
    return MOCK_USAGE.find(u => u.simId === simId) ?? MOCK_USAGE[0];
  }

  const data = await gigsRequest<{ used: number; limit: number }>(
    `/projects/${PROJECT_ID}/subscriptions/${simId}/data-usage`
  );

  return {
    simId,
    period,
    totalDataMb: data.used,
    blockedRequests: 0,
    allowedRequests: 0,
    daily: [],
    topApps: [],
    categoryBreakdown: {},
  };
}

// ── Helpers ──────────────────────────────────────────────────

function mapGigsSubscriptionToSim(sub: GigsSubscription): SimCard {
  return {
    id: sub.id,
    iccid: sub.sim.iccid,
    msisdn: sub.phoneNumber?.number,
    childId: "",  // Linked separately in our DB
    childName: "",
    status: sub.status as SimStatus,
    dataUsedMb: 0,
    dataLimitMb: sub.plan.data.unit === "GB"
      ? sub.plan.data.amount * 1024
      : sub.plan.data.amount,
    activatedAt: sub.currentPeriod.start,
  };
}

export { isConfigured as isGigsConfigured };
