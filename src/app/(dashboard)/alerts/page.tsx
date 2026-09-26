"use client";

import { Header } from "@/components/header";
import { AlertTriangle, Bell, CheckCircle, Filter, Search } from "lucide-react";
import { useState } from "react";

const allAlerts = [
  { id: "1", childName: "Emma", avatar: "👧", type: "SOS", severity: "CRITICAL", title: "SOS Triggered", message: "Emma pressed the SOS button", time: "2 min ago", isRead: false },
  { id: "2", childName: "Emma", avatar: "👧", type: "SCREEN_TIME_LIMIT", severity: "WARNING", title: "Screen Time Limit", message: "Daily limit of 2h reached", time: "10 min ago", isRead: false },
  { id: "3", childName: "Lucas", avatar: "👦", type: "GEOFENCE_EXIT", severity: "WARNING", title: "Left School Zone", message: "Lucas has left the School geofence", time: "1h ago", isRead: false },
  { id: "4", childName: "Lucas", avatar: "👦", type: "APP_BLOCKED", severity: "INFO", title: "App Blocked", message: "TikTok was blocked (category: Social Media)", time: "2h ago", isRead: true },
  { id: "5", childName: "Emma", avatar: "👧", type: "APP_INSTALL", severity: "INFO", title: "New App Installed", message: "Emma installed Roblox - pending approval", time: "3h ago", isRead: true },
  { id: "6", childName: "Lucas", avatar: "👦", type: "LOW_BATTERY", severity: "WARNING", title: "Low Battery", message: "Lucas's device is at 15% battery", time: "4h ago", isRead: true },
  { id: "7", childName: "Emma", avatar: "👧", type: "GEOFENCE_ENTER", severity: "INFO", title: "Arrived at School", message: "Emma arrived at the School geofence", time: "8h ago", isRead: true },
  { id: "8", childName: "Emma", avatar: "👧", type: "CONTENT_BLOCKED", severity: "INFO", title: "Content Blocked", message: "Adult content website blocked", time: "9h ago", isRead: true },
];

const severityConfig: Record<string, { bg: string; icon: string; label: string }> = {
  CRITICAL: { bg: "bg-red-50 border-red-200", icon: "text-red-500", label: "bg-red-100 text-red-700" },
  WARNING:  { bg: "bg-amber-50 border-amber-200", icon: "text-amber-500", label: "bg-amber-100 text-amber-700" },
  INFO:     { bg: "bg-blue-50 border-blue-200", icon: "text-blue-400", label: "bg-blue-100 text-blue-700" },
};

export default function AlertsPage() {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [readState, setReadState] = useState<Record<string, boolean>>({});

  const filtered = allAlerts.filter(a => {
    const matchFilter = filter === "ALL" || a.severity === filter || (filter === "UNREAD" && !(readState[a.id] ?? a.isRead));
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.childName.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const unreadCount = allAlerts.filter(a => !(readState[a.id] ?? a.isRead)).length;

  return (
    <>
      <Header title="Alerts" subtitle={`${unreadCount} unread alerts`} />
      <div className="p-6 space-y-4">

        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {["ALL", "UNREAD", "CRITICAL", "WARNING", "INFO"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition ${
                  filter === f ? "bg-indigo-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300"
                }`}>
                {f === "ALL" ? "All" : f === "UNREAD" ? `Unread (${unreadCount})` : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search alerts..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        </div>

        {/* Mark all read */}
        {unreadCount > 0 && (
          <div className="flex justify-end">
            <button
              onClick={() => {
                const updates: Record<string, boolean> = {};
                allAlerts.forEach(a => { updates[a.id] = true; });
                setReadState(updates);
              }}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Mark all as read
            </button>
          </div>
        )}

        {/* Alert list */}
        <div className="space-y-2">
          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <Bell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No alerts found</p>
              <p className="text-gray-400 text-sm mt-1">You&apos;re all caught up!</p>
            </div>
          )}
          {filtered.map(alert => {
            const isRead = readState[alert.id] ?? alert.isRead;
            const config = severityConfig[alert.severity];
            return (
              <div
                key={alert.id}
                onClick={() => setReadState(s => ({ ...s, [alert.id]: true }))}
                className={`bg-white rounded-2xl border p-4 cursor-pointer hover:shadow-sm transition ${
                  !isRead ? "border-l-4 border-l-indigo-400 border-gray-100" : "border-gray-100"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl border ${config.bg}`}>
                    <AlertTriangle className={`w-5 h-5 ${config.icon}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg">{alert.avatar}</span>
                      <span className="font-semibold text-gray-900">{alert.childName}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.label}`}>
                        {alert.severity}
                      </span>
                      {!isRead && <span className="w-2 h-2 bg-indigo-500 rounded-full" />}
                    </div>
                    <p className="font-medium text-gray-900 mt-1">{alert.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{alert.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                  </div>
                  {!isRead && (
                    <button onClick={e => { e.stopPropagation(); setReadState(s => ({ ...s, [alert.id]: true })); }}
                      className="p-1.5 hover:bg-green-50 rounded-lg transition text-gray-400 hover:text-green-600">
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
