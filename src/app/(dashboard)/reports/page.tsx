"use client";

import { Header } from "@/components/header";
import { BarChart3, TrendingUp, TrendingDown, Download, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useState } from "react";

const weeklyData = [
  { day: "Mon", Emma: 95, Lucas: 120 },
  { day: "Tue", Emma: 110, Lucas: 145 },
  { day: "Wed", Emma: 75, Lucas: 90 },
  { day: "Thu", Emma: 120, Lucas: 180 },
  { day: "Fri", Emma: 105, Lucas: 160 },
  { day: "Sat", Emma: 150, Lucas: 210 },
  { day: "Sun", Emma: 90, Lucas: 130 },
];

const trendData = [
  { week: "W1", avg: 85 },
  { week: "W2", avg: 102 },
  { week: "W3", avg: 95 },
  { week: "W4", avg: 110 },
];

const topApps = [
  { name: "YouTube", icon: "▶️", mins: 420, change: +15, child: "Emma" },
  { name: "Minecraft", icon: "⛏️", mins: 380, change: -8, child: "Lucas" },
  { name: "TikTok", icon: "🎵", mins: 210, change: +32, child: "Emma" },
  { name: "WhatsApp", icon: "💬", mins: 145, change: -5, child: "Lucas" },
  { name: "Roblox", icon: "🎮", mins: 120, change: +20, child: "Emma" },
];

const children = ["All", "Emma", "Lucas"];

export default function ReportsPage() {
  const [selectedChild, setSelectedChild] = useState("All");
  const [period, setPeriod] = useState("week");

  return (
    <>
      <Header title="Reports" subtitle="Weekly insights and usage analytics" />
      <div className="p-6 space-y-6">

        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2">
            {children.map(c => (
              <button key={c} onClick={() => setSelectedChild(c)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  selectedChild === c ? "bg-indigo-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300"
                }`}>{c}</button>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
              {["week", "month"].map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    period === p ? "bg-indigo-600 text-white" : "text-gray-500 hover:text-gray-700"
                  }`}>{p === "week" ? "This Week" : "This Month"}</button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-indigo-300 transition">
              <Download className="w-4 h-4" /> Export PDF
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Screen Time", value: "24h 35m", change: "+12%", up: true },
            { label: "Daily Average", value: "3h 31m", change: "-5%", up: false },
            { label: "Apps Used", value: "12", change: "+2", up: true },
            { label: "Rules Followed", value: "87%", change: "+3%", up: true },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-sm text-gray-500 mb-2">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <div className={`flex items-center gap-1 mt-1 text-sm font-medium ${s.up ? "text-red-500" : "text-green-500"}`}>
                {s.up ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {s.change} vs last week
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Daily Screen Time (minutes)</h3>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-indigo-500" /><span>Emma</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-purple-400" /><span>Lucas</span></div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={weeklyData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="Emma" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Lucas" fill="#a78bfa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Apps */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Top Apps This Week</h3>
            <div className="space-y-3">
              {topApps.map((app, i) => (
                <div key={app.name} className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm font-medium w-4">{i + 1}</span>
                  <span className="text-xl">{app.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">{app.name}</p>
                      <span className={`text-xs font-medium ${app.change > 0 ? "text-red-500" : "text-green-500"}`}>
                        {app.change > 0 ? "+" : ""}{app.change}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-indigo-400" style={{ width: `${Math.round(app.mins / 420 * 100)}%` }} />
                      </div>
                      <span className="text-xs text-gray-400">{Math.floor(app.mins / 60)}h{app.mins % 60}m</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-indigo-900 mb-2">AI Weekly Insight</h3>
              <p className="text-indigo-700 text-sm leading-relaxed">
                Screen time increased <strong>12% this week</strong>, primarily driven by TikTok usage (up 32%).
                Emma&apos;s Thursday usage exceeded her daily limit by 25 minutes.
                Lucas shows healthy patterns — staying within limits 6 out of 7 days.
              </p>
              <p className="text-indigo-600 text-sm mt-2 font-medium">
                💡 Recommendation: Consider reducing TikTok daily limit for Emma to 20 minutes.
              </p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
