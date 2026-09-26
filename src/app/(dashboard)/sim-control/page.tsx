"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import {
  Wifi, WifiOff, Shield, MapPin, BarChart3,
  Play, Pause, AlertTriangle, CheckCircle,
  Lock, Unlock, Clock, Globe, Smartphone,
  ChevronDown, ChevronUp, Zap, Eye,
} from "lucide-react";
import { MOCK_SIMS, MOCK_POLICIES, MOCK_LOCATIONS, MOCK_USAGE, MOCK_ALERTS } from "@/lib/sim/mock-data";
import { CONTENT_CATEGORIES, APP_BLOCKS } from "@/lib/sim/content-categories";
import { getPolicySummary } from "@/lib/sim/policy-engine";
import { SimCard, SimPolicy } from "@/lib/sim/types";

// ── Status helpers ───────────────────────────────────────────
function SimStatusBadge({ status }: { status: SimCard["status"] }) {
  const config = {
    active: { label: "Active", class: "bg-green-100 text-green-700" },
    suspended: { label: "Paused", class: "bg-amber-100 text-amber-700" },
    inactive: { label: "Inactive", class: "bg-gray-100 text-gray-600" },
    terminated: { label: "Terminated", class: "bg-red-100 text-red-600" },
  };
  const c = config[status] ?? config.inactive;
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${c.class}`}>
      {c.label}
    </span>
  );
}

function DataBar({ used, limit }: { used: number; limit: number }) {
  const pct = Math.min(100, Math.round((used / limit) * 100));
  const color = pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-indigo-500";
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{used} MB used</span>
        <span>{limit} MB limit</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-gray-400 mt-0.5">{pct}% of monthly data used</p>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────
export default function SimControlPage() {
  const [selectedSimId, setSelectedSimId] = useState(MOCK_SIMS[0].id);
  const [pausedSims, setPausedSims] = useState<Record<string, boolean>>({});
  const [expandedSection, setExpandedSection] = useState<string | null>("blocking");

  const selectedSim = MOCK_SIMS.find(s => s.id === selectedSimId) ?? MOCK_SIMS[0];
  const selectedPolicy = MOCK_POLICIES.find(p => p.simId === selectedSimId);
  const selectedLocation = MOCK_LOCATIONS.find(l => l.simId === selectedSimId);
  const selectedUsage = MOCK_USAGE.find(u => u.simId === selectedSimId) ?? MOCK_USAGE[0];
  const simAlerts = MOCK_ALERTS.filter(a => a.simId === selectedSimId);

  const isPaused = pausedSims[selectedSimId] ?? selectedPolicy?.isPaused ?? false;

  const policySummary = selectedPolicy
    ? getPolicySummary({ ...selectedPolicy, isPaused })
    : null;

  function togglePause() {
    setPausedSims(p => ({ ...p, [selectedSimId]: !isPaused }));
  }

  function toggleSection(section: string) {
    setExpandedSection(prev => prev === section ? null : section);
  }

  return (
    <>
      <Header
        title="SIM Control"
        subtitle="Network-level protection — unbypassable by children"
      />
      <div className="p-6 space-y-6">

        {/* SIM Selector */}
        <div className="flex gap-3 flex-wrap">
          {MOCK_SIMS.map(sim => (
            <button
              key={sim.id}
              onClick={() => setSelectedSimId(sim.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition ${
                selectedSimId === sim.id
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <div className="text-left">
                <p className="text-sm font-semibold">{sim.childName}</p>
                <p className={`text-xs ${selectedSimId === sim.id ? "text-indigo-200" : "text-gray-400"}`}>
                  {sim.msisdn ?? sim.iccid.slice(-8)}
                </p>
              </div>
              <SimStatusBadge status={sim.status} />
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — Stats & Controls */}
          <div className="space-y-4">

            {/* SIM Overview Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    isPaused ? "bg-red-100" : "bg-green-100"
                  }`}>
                    {isPaused
                      ? <WifiOff className="w-5 h-5 text-red-600" />
                      : <Wifi className="w-5 h-5 text-green-600" />
                    }
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{selectedSim.childName}&apos;s SIM</p>
                    <p className="text-xs text-gray-400">ICCID: ...{selectedSim.iccid.slice(-6)}</p>
                  </div>
                </div>
                <SimStatusBadge status={isPaused ? "suspended" : selectedSim.status} />
              </div>

              <DataBar used={selectedSim.dataUsedMb} limit={selectedSim.dataLimitMb} />

              {/* Instant pause toggle */}
              <button
                onClick={togglePause}
                className={`mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition ${
                  isPaused
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {isPaused
                  ? <><Play className="w-4 h-4" /> Resume Internet</>
                  : <><Pause className="w-4 h-4" /> Pause Internet Now</>
                }
              </button>
              <p className="text-xs text-gray-400 text-center mt-2">
                {isPaused
                  ? "Internet is paused — child has no data access"
                  : "Tap to instantly cut all internet access"
                }
              </p>
            </div>

            {/* Policy Summary */}
            {policySummary && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  Protection Status
                </h3>
                <div className="space-y-2">
                  {[
                    { label: "Blocked Categories", value: policySummary.blockedCategories, icon: "🚫" },
                    { label: "Blocked Apps", value: policySummary.blockedApps, icon: "📵" },
                    { label: "Active Schedules", value: policySummary.schedulesActive, icon: "⏰" },
                    { label: "Total Rules", value: policySummary.activeRules, icon: "📋" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{item.icon} {item.label}</span>
                      <span className="font-bold text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className={`mt-3 px-3 py-2 rounded-lg text-xs font-semibold ${
                  policySummary.status === "paused" ? "bg-red-100 text-red-700" :
                  policySummary.status === "bedtime" ? "bg-purple-100 text-purple-700" :
                  policySummary.status === "school" ? "bg-blue-100 text-blue-700" :
                  "bg-green-100 text-green-700"
                }`}>
                  {policySummary.status === "paused" ? "⏸ " :
                   policySummary.status === "bedtime" ? "🌙 " :
                   policySummary.status === "school" ? "🏫 " : "✅ "}
                  {policySummary.statusLabel}
                </div>
              </div>
            )}

            {/* Live Location */}
            {selectedLocation && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  Live Location
                </h3>
                <div className="relative h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl overflow-hidden mb-3">
                  <div className="absolute inset-0 opacity-20">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="absolute w-full border-t border-gray-400" style={{ top: `${i * 25}%` }} />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-white border-2 border-green-500 flex items-center justify-center text-sm shadow">
                        {selectedSim.childName[0]}
                      </div>
                      <div className="w-16 h-16 border-2 border-dashed border-green-400 rounded-full absolute opacity-50" />
                    </div>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900">{selectedLocation.address}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Accuracy: ±{selectedLocation.accuracy}m ·
                  via {selectedLocation.source.toUpperCase()} ·
                  {new Date(selectedLocation.timestamp).toLocaleTimeString()}
                </p>
              </div>
            )}
          </div>

          {/* Center — Policy Controls */}
          <div className="lg:col-span-2 space-y-4">

            {/* Today's Usage */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                Today&apos;s Network Activity
              </h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 bg-indigo-50 rounded-xl text-center">
                  <p className="text-xl font-bold text-indigo-700">{selectedUsage.totalDataMb}MB</p>
                  <p className="text-xs text-indigo-500 mt-0.5">Data Used</p>
                </div>
                <div className="p-3 bg-green-50 rounded-xl text-center">
                  <p className="text-xl font-bold text-green-700">{selectedUsage.allowedRequests}</p>
                  <p className="text-xs text-green-500 mt-0.5">Requests Allowed</p>
                </div>
                <div className="p-3 bg-red-50 rounded-xl text-center">
                  <p className="text-xl font-bold text-red-700">{selectedUsage.blockedRequests}</p>
                  <p className="text-xs text-red-500 mt-0.5">Requests Blocked</p>
                </div>
              </div>

              {/* Top apps with blocked indicators */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Top Apps Today</p>
                {selectedUsage.topApps.map((app) => (
                  <div key={app.domain} className={`flex items-center gap-3 p-2.5 rounded-xl ${
                    app.blocked ? "bg-red-50 border border-red-100" : "bg-gray-50"
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${app.blocked ? "bg-red-500" : "bg-green-500"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{app.appName}</p>
                      <p className="text-xs text-gray-400">{app.domain}</p>
                    </div>
                    {app.blocked ? (
                      <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                        BLOCKED
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">{app.dataMb}MB</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Content Blocking */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => toggleSection("blocking")}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Content Blocking</p>
                    <p className="text-xs text-gray-400">Categories and apps blocked at SIM level</p>
                  </div>
                </div>
                {expandedSection === "blocking"
                  ? <ChevronUp className="w-5 h-5 text-gray-400" />
                  : <ChevronDown className="w-5 h-5 text-gray-400" />
                }
              </button>

              {expandedSection === "blocking" && selectedPolicy && (
                <div className="px-5 pb-5 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-4 mb-3">
                    Category Blocks
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {CONTENT_CATEGORIES.map((cat) => {
                      const cats = selectedPolicy.blockedCategories as unknown;
                      const catArr = Array.isArray(cats) ? cats as string[] : String(cats).split(",").filter(Boolean);
                      const isBlocked = catArr.includes(cat.id);
                      return (
                        <div
                          key={cat.id}
                          className={`flex items-center gap-2.5 p-3 rounded-xl border transition ${
                            isBlocked
                              ? "bg-red-50 border-red-200"
                              : "bg-gray-50 border-gray-100"
                          }`}
                        >
                          <span className="text-xl">{cat.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate">{cat.name}</p>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${isBlocked ? "bg-red-500" : "bg-gray-300"}`} />
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-5 mb-3">
                    App Blocks
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {APP_BLOCKS.slice(0, 8).map((app) => {
                      const apps = selectedPolicy.blockedApps as unknown;
                        const appsArr = Array.isArray(apps) ? apps as string[] : String(apps).split(",").filter(Boolean);
                        const isBlocked = appsArr.map((a: string) => a.trim().toLowerCase()).includes(app.name.toLowerCase());
                      return (
                        <div
                          key={app.name}
                          className={`flex items-center gap-2.5 p-3 rounded-xl border transition ${
                            isBlocked
                              ? "bg-red-50 border-red-200"
                              : "bg-gray-50 border-gray-100"
                          }`}
                        >
                          <span className="text-xl">{app.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate">{app.name}</p>
                            <p className="text-xs text-gray-400">{app.domains.length} domains</p>
                          </div>
                          {isBlocked ? (
                            <Lock className="w-4 h-4 text-red-500" />
                          ) : (
                            <Unlock className="w-4 h-4 text-gray-300" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Schedules */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => toggleSection("schedules")}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Schedules</p>
                    <p className="text-xs text-gray-400">Bedtime and school hour rules</p>
                  </div>
                </div>
                {expandedSection === "schedules"
                  ? <ChevronUp className="w-5 h-5 text-gray-400" />
                  : <ChevronDown className="w-5 h-5 text-gray-400" />
                }
              </button>

              {expandedSection === "schedules" && selectedPolicy && (
                <div className="px-5 pb-5 border-t border-gray-100">
                  <div className="space-y-3 mt-4">
                    {(Array.isArray(selectedPolicy.schedules)
                      ? selectedPolicy.schedules
                      : JSON.parse(selectedPolicy.schedules || "[]")
                    ).map((schedule: { id: string; name: string; startTime: string; endTime: string; days: string[]; action: string }) => (
                      <div key={schedule.id} className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">
                              {schedule.name.toLowerCase().includes("bedtime") ? "🌙" : "🏫"}
                            </span>
                            <p className="font-semibold text-gray-900">{schedule.name}</p>
                          </div>
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                            {schedule.action === "block_all" ? "Block All" : "Limited"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {schedule.startTime} – {schedule.endTime}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {schedule.days.join(", ")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SIM Alerts */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => toggleSection("alerts")}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">SIM Alerts</p>
                    <p className="text-xs text-gray-400">
                      {simAlerts.filter(a => !a.isRead).length} unread network events
                    </p>
                  </div>
                </div>
                {expandedSection === "alerts"
                  ? <ChevronUp className="w-5 h-5 text-gray-400" />
                  : <ChevronDown className="w-5 h-5 text-gray-400" />
                }
              </button>

              {expandedSection === "alerts" && (
                <div className="px-5 pb-5 border-t border-gray-100">
                  <div className="space-y-3 mt-4">
                    {simAlerts.length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-4">No SIM alerts</p>
                    )}
                    {simAlerts.map((alert) => (
                      <div key={alert.id} className={`p-3 rounded-xl border ${
                        alert.severity === "critical" ? "bg-red-50 border-red-200" :
                        alert.severity === "warning" ? "bg-amber-50 border-amber-200" :
                        "bg-blue-50 border-blue-100"
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {alert.isRead
                              ? <CheckCircle className="w-4 h-4 text-gray-300" />
                              : <AlertTriangle className={`w-4 h-4 ${
                                  alert.severity === "critical" ? "text-red-500" :
                                  alert.severity === "warning" ? "text-amber-500" :
                                  "text-blue-400"
                                }`} />
                            }
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{alert.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{alert.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(alert.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* VPN & Security */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Bypass Prevention
                <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  All Active
                </span>
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Block VPN Apps", desc: "NordVPN, ExpressVPN, etc.", enabled: selectedPolicy?.blockVpn ?? true, icon: "🔒" },
                  { label: "Block Proxy Sites", desc: "Web proxies and anonymizers", enabled: selectedPolicy?.blockProxy ?? true, icon: "🛡️" },
                  { label: "Block Tor Network", desc: "Tor browser and exit nodes", enabled: selectedPolicy?.blockTor ?? true, icon: "🕵️" },
                  { label: "Safe Search", desc: "Enforce on Google & Bing", enabled: selectedPolicy?.safeSarchEnabled ?? true, icon: "🔍" },
                  { label: "YouTube Restricted", desc: "Filter mature YouTube content", enabled: selectedPolicy?.youtubeRestricted ?? false, icon: "▶️" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <span>{item.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${
                      item.enabled ? "text-green-600" : "text-gray-400"
                    }`}>
                      {item.enabled ? <CheckCircle className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {item.enabled ? "Enabled" : "Disabled"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* What makes this different banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Why SIM Control is Different</h3>
              <p className="text-indigo-100 text-sm leading-relaxed">
                Unlike app-based parental controls, SIM-level filtering happens{" "}
                <strong className="text-white">inside the carrier network</strong> — before content reaches the device.
                Children cannot bypass this by changing settings, using a VPN, factory resetting, or switching WiFi.
                The protection follows the SIM card everywhere.
              </p>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { label: "VPN bypass", value: "❌ Impossible" },
                  { label: "Factory reset", value: "❌ Doesn't help" },
                  { label: "New WiFi", value: "❌ Still blocked" },
                ].map(item => (
                  <div key={item.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-sm font-bold">{item.value}</p>
                    <p className="text-xs text-indigo-200 mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
