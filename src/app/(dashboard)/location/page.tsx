"use client";

import { Header } from "@/components/header";
import { MapPin, Navigation, Plus, Clock } from "lucide-react";
import { useState } from "react";

const children = [
  { id: "1", name: "Emma", avatar: "👧", lat: 51.505, lng: -0.09, location: "Home", address: "123 Oak Street, London", lastSeen: "2 min ago", status: "ONLINE" },
  { id: "2", name: "Lucas", avatar: "👦", lat: 51.51, lng: -0.1, location: "Home", address: "123 Oak Street, London", lastSeen: "5 min ago", status: "ONLINE" },
];

const geofences = [
  { id: "1", name: "Home", emoji: "🏠", radius: "100m", isActive: true },
  { id: "2", name: "School", emoji: "🏫", radius: "200m", isActive: true },
  { id: "3", name: "Grandma's", emoji: "👵", radius: "150m", isActive: true },
];

const locationHistory = [
  { time: "3:45 PM", location: "School", duration: "6h 20m", type: "SCHOOL" },
  { time: "9:00 AM", location: "Home", duration: "Overnight", type: "HOME" },
  { time: "Yesterday", location: "Park", duration: "1h 30m", type: "OTHER" },
];

export default function LocationPage() {
  const [selected, setSelected] = useState("1");
  const child = children.find(c => c.id === selected) ?? children[0];

  return (
    <>
      <Header title="Location" subtitle="Real-time GPS tracking and geofences" />
      <div className="p-6 space-y-6">

        {/* Child selector */}
        <div className="flex gap-3">
          {children.map(c => (
            <button
              key={c.id}
              onClick={() => setSelected(c.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition border ${
                selected === c.id
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
              }`}
            >
              <span>{c.avatar}</span> {c.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map placeholder */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Map visual placeholder */}
              <div className="relative h-96 bg-gradient-to-br from-green-100 via-blue-50 to-green-200 flex items-center justify-center">
                {/* Grid lines to simulate map */}
                <div className="absolute inset-0 opacity-20">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="absolute w-full border-t border-gray-400" style={{ top: `${i * 12.5}%` }} />
                  ))}
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="absolute h-full border-l border-gray-400" style={{ left: `${i * 12.5}%` }} />
                  ))}
                </div>
                {/* Roads simulation */}
                <div className="absolute inset-0">
                  <div className="absolute top-1/3 left-0 right-0 h-3 bg-gray-300/40 rounded" />
                  <div className="absolute top-0 bottom-0 left-1/2 w-3 bg-gray-300/40 rounded" />
                </div>
                {/* Child marker */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-white border-4 border-indigo-500 flex items-center justify-center text-2xl shadow-lg">
                    {child.avatar}
                  </div>
                  <div className="mt-2 px-3 py-1.5 bg-white rounded-xl shadow-md text-sm font-semibold text-gray-900">
                    📍 {child.address}
                  </div>
                </div>
                {/* Geofence circle */}
                <div className="absolute w-32 h-32 border-2 border-dashed border-indigo-400 rounded-full opacity-50" />
                {/* Compass */}
                <div className="absolute top-4 right-4 p-2 bg-white rounded-xl shadow text-xs font-bold text-gray-600">N ↑</div>
              </div>

              {/* Location info bar */}
              <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <Navigation className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{child.address}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Last updated {child.lastSeen}
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-medium text-sm hover:bg-indigo-100 transition">
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div className="space-y-4">
            {/* Geofences */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Geofences</h3>
                <button className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {geofences.map((g) => (
                  <div key={g.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-xl">{g.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{g.name}</p>
                      <p className="text-xs text-gray-400">Radius: {g.radius}</p>
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full ${g.isActive ? "bg-green-500" : "bg-gray-300"}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* History */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Location History</h3>
              <div className="space-y-3">
                {locationHistory.map((h, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 mt-1" />
                      {i < locationHistory.length - 1 && <div className="w-0.5 h-8 bg-gray-200 mt-1" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{h.location}</p>
                      <p className="text-xs text-gray-400">{h.time} · {h.duration}</p>
                    </div>
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
