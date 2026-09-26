import { Header } from "@/components/header";
import {
  Users, Clock, Bell, MapPin, Shield,
  TrendingUp, Smartphone, AlertTriangle,
} from "lucide-react";
import Link from "next/link";

// Mock data
const stats = [
  { label: "Children", value: "2", icon: Users, color: "text-indigo-600 bg-indigo-50", href: "/children" },
  { label: "Screen Time Today", value: "3h 20m", icon: Clock, color: "text-amber-600 bg-amber-50", href: "/screen-time" },
  { label: "Active Alerts", value: "3", icon: Bell, color: "text-red-600 bg-red-50", href: "/alerts" },
  { label: "Devices Online", value: "2/2", icon: Smartphone, color: "text-green-600 bg-green-50", href: "/devices" },
];

const children = [
  {
    id: "1", name: "Emma", age: 10, avatar: "👧", device: "Galaxy A15",
    status: "ONLINE", currentApp: "YouTube", screenTimeUsed: 95, screenTimeLimit: 120,
    location: "Home", lastSeen: "2 min ago",
  },
  {
    id: "2", name: "Lucas", age: 13, avatar: "👦", device: "Pixel 7a",
    status: "ONLINE", currentApp: "Minecraft", screenTimeUsed: 105, screenTimeLimit: 180,
    location: "Home", lastSeen: "5 min ago",
  },
];

const recentAlerts = [
  { id: "1", childName: "Emma", type: "SCREEN_TIME_LIMIT", message: "Screen time limit reached (2h)", time: "10 min ago", severity: "WARNING" },
  { id: "2", childName: "Lucas", type: "APP_BLOCKED", message: "TikTok blocked", time: "1h ago", severity: "INFO" },
  { id: "3", childName: "Emma", type: "GEOFENCE_EXIT", message: "Left School zone", time: "3h ago", severity: "WARNING" },
];

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    ONLINE: "bg-green-500", OFFLINE: "bg-gray-400",
    LOCKED: "bg-red-500", LOW_BATTERY: "bg-amber-500",
  };
  return <span className={`w-2.5 h-2.5 rounded-full ${colors[status] || "bg-gray-400"}`} />;
}

function ScreenTimeBar({ used, limit }: { used: number; limit: number }) {
  const pct = Math.min(100, Math.round((used / limit) * 100));
  const color = pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-green-500";
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5">
      <div className={`h-1.5 rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <>
      <Header title="Dashboard" subtitle="Good morning! Here's your family overview." />
      <div className="p-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.href}
              className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Children Status */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Children Overview</h2>
              <Link href="/children" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View all</Link>
            </div>
            <div className="divide-y divide-gray-100">
              {children.map((child) => (
                <div key={child.id} className="px-6 py-4 hover:bg-gray-50 transition">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{child.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{child.name}</span>
                        <span className="text-xs text-gray-400">Age {child.age}</span>
                        <StatusDot status={child.status} />
                        <span className="text-xs text-gray-400">{child.status}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <span>📱 {child.device}</span>
                        <span>🎯 {child.currentApp}</span>
                        <span>📍 {child.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {Math.floor(child.screenTimeUsed / 60)}h {child.screenTimeUsed % 60}m / {Math.floor(child.screenTimeLimit / 60)}h
                        </span>
                        <div className="flex-1">
                          <ScreenTimeBar used={child.screenTimeUsed} limit={child.screenTimeLimit} />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Link href={`/children/${child.id}`}
                        className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition font-medium">
                        View
                      </Link>
                      <button className="text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium">
                        Lock
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Recent Alerts</h2>
              <Link href="/alerts" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">All</Link>
            </div>
            <div className="divide-y divide-gray-100">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 p-1.5 rounded-lg ${
                      alert.severity === "WARNING" ? "bg-amber-50" : "bg-blue-50"
                    }`}>
                      <AlertTriangle className={`w-3.5 h-3.5 ${
                        alert.severity === "WARNING" ? "text-amber-500" : "text-blue-500"
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{alert.childName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{alert.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 bg-gray-50">
              <Link href="/alerts" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                View all alerts →
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Pause All Devices", icon: "⏸️", color: "bg-red-50 text-red-700 hover:bg-red-100" },
              { label: "Add Child", icon: "➕", color: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100" },
              { label: "View Location", icon: "📍", color: "bg-green-50 text-green-700 hover:bg-green-100" },
              { label: "SIM Control", icon: "📡", color: "bg-purple-50 text-purple-700 hover:bg-purple-100" },
            ].map((action) => (
              <button key={action.label}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition ${action.color}`}>
                <span>{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
