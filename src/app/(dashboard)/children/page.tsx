import { Header } from "@/components/header";
import Link from "next/link";
import { Plus, Smartphone, Clock, MapPin, Lock, Settings } from "lucide-react";

const children = [
  {
    id: "1", name: "Emma", age: 10, grade: "5th Grade", avatar: "👧",
    device: "Galaxy A15", status: "ONLINE", battery: 72,
    screenTimeUsed: 95, screenTimeLimit: 120,
    location: "Home", currentApp: "YouTube",
    blockedApps: 3, activeAlerts: 1,
  },
  {
    id: "2", name: "Lucas", age: 13, grade: "8th Grade", avatar: "👦",
    device: "Pixel 7a", status: "ONLINE", battery: 45,
    screenTimeUsed: 105, screenTimeLimit: 180,
    location: "Home", currentApp: "Minecraft",
    blockedApps: 5, activeAlerts: 2,
  },
];

export default function ChildrenPage() {
  return (
    <>
      <Header title="Children" subtitle="Manage your children's profiles and devices" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500">{children.length} children enrolled</p>
          <Link href="/children/new"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition text-sm">
            <Plus className="w-4 h-4" /> Add Child
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {children.map((child) => (
            <div key={child.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition">
              {/* Child header */}
              <div className="p-6 pb-4">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{child.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-gray-900">{child.name}</h3>
                      <span className={`w-2.5 h-2.5 rounded-full ${child.status === "ONLINE" ? "bg-green-500" : "bg-gray-400"}`} />
                    </div>
                    <p className="text-gray-500 text-sm">{child.grade} · Age {child.age}</p>
                    <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-500">
                      <Smartphone className="w-4 h-4" />
                      <span>{child.device}</span>
                      <span className="text-gray-300">·</span>
                      <span>🔋 {child.battery}%</span>
                    </div>
                  </div>
                </div>

                {/* Screen time */}
                <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-gray-600 font-medium">Screen Time Today</span>
                    <span className="font-semibold text-gray-900">
                      {Math.floor(child.screenTimeUsed / 60)}h {child.screenTimeUsed % 60}m
                      <span className="text-gray-400 font-normal"> / {Math.floor(child.screenTimeLimit / 60)}h</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        child.screenTimeUsed / child.screenTimeLimit >= 0.9 ? "bg-red-500" :
                        child.screenTimeUsed / child.screenTimeLimit >= 0.7 ? "bg-amber-500" : "bg-green-500"
                      }`}
                      style={{ width: `${Math.min(100, Math.round(child.screenTimeUsed / child.screenTimeLimit * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div className="text-center p-2 bg-blue-50 rounded-xl">
                    <div className="text-lg font-bold text-blue-700">{child.activeAlerts}</div>
                    <div className="text-xs text-blue-600">Alerts</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded-xl">
                    <div className="text-lg font-bold text-red-700">{child.blockedApps}</div>
                    <div className="text-xs text-red-600">Blocked Apps</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-xl">
                    <div className="text-xs font-medium text-green-700">📍</div>
                    <div className="text-xs text-green-600">{child.location}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
                <Link href={`/children/${child.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
                  <Settings className="w-4 h-4" /> Manage
                </Link>
                <Link href={`/location?child=${child.id}`}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-100 transition border border-gray-200">
                  <MapPin className="w-4 h-4" />
                </Link>
                <button className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition border border-gray-200">
                  <Lock className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Add new child card */}
          <Link href="/children/new"
            className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-12 hover:border-indigo-300 hover:bg-indigo-50 transition group min-h-48">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 group-hover:bg-indigo-200 flex items-center justify-center mb-3 transition">
              <Plus className="w-7 h-7 text-indigo-600" />
            </div>
            <p className="font-semibold text-gray-700 group-hover:text-indigo-700">Add Another Child</p>
            <p className="text-sm text-gray-400 mt-1">Enroll a new device</p>
          </Link>
        </div>
      </div>
    </>
  );
}
