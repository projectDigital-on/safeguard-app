"use client";

import { Header } from "@/components/header";
import { Clock, Pause, Play, Plus, Moon, School } from "lucide-react";
import { useState } from "react";

const children = [
  {
    id: "1", name: "Emma", avatar: "👧",
    dailyLimit: 120, weekendLimit: 180, used: 95,
    bedtimeStart: "21:00", bedtimeEnd: "07:00",
    isPaused: false, bonusMinutes: 0,
    topApps: [
      { name: "YouTube", mins: 45, icon: "▶️" },
      { name: "TikTok", mins: 30, icon: "🎵" },
      { name: "Minecraft", mins: 20, icon: "⛏️" },
    ],
  },
  {
    id: "2", name: "Lucas", avatar: "👦",
    dailyLimit: 180, weekendLimit: 240, used: 105,
    bedtimeStart: "22:00", bedtimeEnd: "07:30",
    isPaused: false, bonusMinutes: 30,
    topApps: [
      { name: "Minecraft", mins: 60, icon: "⛏️" },
      { name: "YouTube", mins: 25, icon: "▶️" },
      { name: "WhatsApp", mins: 20, icon: "💬" },
    ],
  },
];

export default function ScreenTimePage() {
  const [paused, setPaused] = useState<Record<string, boolean>>({});

  return (
    <>
      <Header title="Screen Time" subtitle="Set limits and schedules for each child" />
      <div className="p-6 space-y-6">

        {children.map((child) => {
          const isPaused = paused[child.id] ?? child.isPaused;
          const pct = Math.min(100, Math.round(child.used / child.dailyLimit * 100));
          const barColor = pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-green-500";

          return (
            <div key={child.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Child header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{child.avatar}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{child.name}</h3>
                    <p className="text-sm text-gray-500">
                      {Math.floor(child.used / 60)}h {child.used % 60}m used of {Math.floor(child.dailyLimit / 60)}h today
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPaused(p => ({ ...p, [child.id]: !isPaused }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition ${
                    isPaused
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                >
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  {isPaused ? "Resume" : "Pause All"}
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Progress */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">Today&apos;s Usage</span>
                      <span className="font-semibold text-gray-900">{pct}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div className={`h-3 rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  {/* Limits */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-indigo-50 rounded-xl">
                      <Clock className="w-5 h-5 text-indigo-600 mb-2" />
                      <p className="text-xs text-gray-500 mb-1">Weekday Limit</p>
                      <p className="text-2xl font-bold text-indigo-700">{Math.floor(child.dailyLimit / 60)}h</p>
                      <input
                        type="range" min={30} max={480} step={30}
                        defaultValue={child.dailyLimit}
                        className="w-full mt-2 accent-indigo-600"
                      />
                    </div>
                    <div className="p-4 bg-purple-50 rounded-xl">
                      <Clock className="w-5 h-5 text-purple-600 mb-2" />
                      <p className="text-xs text-gray-500 mb-1">Weekend Limit</p>
                      <p className="text-2xl font-bold text-purple-700">{Math.floor(child.weekendLimit / 60)}h</p>
                      <input
                        type="range" min={30} max={480} step={30}
                        defaultValue={child.weekendLimit}
                        className="w-full mt-2 accent-purple-600"
                      />
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3">
                      <Moon className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">Bedtime</p>
                        <p className="font-semibold text-gray-900">{child.bedtimeStart} – {child.bedtimeEnd}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3">
                      <School className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">School Hours</p>
                        <p className="font-semibold text-gray-900">08:00 – 15:00</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Apps */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Top Apps Today</h4>
                  <div className="space-y-2">
                    {child.topApps.map((app) => (
                      <div key={app.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <span className="text-2xl">{app.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{app.name}</p>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                              className="h-1.5 rounded-full bg-indigo-400"
                              style={{ width: `${Math.round(app.mins / child.used * 100)}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-gray-500 shrink-0">{app.mins}m</span>
                      </div>
                    ))}
                  </div>
                  <button className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition">
                    <Plus className="w-4 h-4" /> Add App Limit
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
