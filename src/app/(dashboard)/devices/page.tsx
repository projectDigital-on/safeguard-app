import { Header } from "@/components/header";
import { Smartphone, Battery, Wifi, Lock, Settings, Plus } from "lucide-react";

const devices = [
  {
    id: "1", childName: "Emma", childAvatar: "👧", name: "Galaxy A15",
    model: "Samsung Galaxy A15", os: "Android 14", status: "ONLINE",
    battery: 72, storage: "18/64GB", lastSeen: "2 min ago", enrolledAt: "Sep 1, 2026",
  },
  {
    id: "2", childName: "Lucas", childAvatar: "👦", name: "Pixel 7a",
    model: "Google Pixel 7a", os: "Android 15", status: "ONLINE",
    battery: 45, storage: "32/128GB", lastSeen: "5 min ago", enrolledAt: "Aug 15, 2026",
  },
];

function BatteryIcon({ level }: { level: number }) {
  const color = level <= 20 ? "text-red-500" : level <= 50 ? "text-amber-500" : "text-green-500";
  return <Battery className={`w-4 h-4 ${color}`} />;
}

export default function DevicesPage() {
  return (
    <>
      <Header title="Devices" subtitle="Manage enrolled Android devices" />
      <div className="p-6 space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {devices.map(device => (
            <div key={device.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-indigo-50 rounded-xl">
                    <Smartphone className="w-7 h-7 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">{device.name}</h3>
                      <span className={`w-2.5 h-2.5 rounded-full ${device.status === "ONLINE" ? "bg-green-500" : "bg-gray-400"}`} />
                      <span className="text-xs text-gray-400">{device.status}</span>
                    </div>
                    <p className="text-sm text-gray-500">{device.model} · {device.os}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-lg">{device.childAvatar}</span>
                      <span className="text-sm text-gray-600">{device.childName}&apos;s device</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <BatteryIcon level={device.battery} />
                    </div>
                    <p className="text-lg font-bold text-gray-900">{device.battery}%</p>
                    <p className="text-xs text-gray-400">Battery</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <Wifi className="w-4 h-4 text-green-500 mx-auto mb-1" />
                    <p className="text-sm font-bold text-gray-900">Online</p>
                    <p className="text-xs text-gray-400">Connection</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <p className="text-xs text-gray-500 mb-1">Storage</p>
                    <p className="text-sm font-bold text-gray-900">{device.storage}</p>
                    <p className="text-xs text-gray-400">Used/Total</p>
                  </div>
                </div>

                <div className="text-xs text-gray-400 space-y-1">
                  <p>Last seen: {device.lastSeen}</p>
                  <p>Enrolled: {device.enrolledAt}</p>
                </div>
              </div>

              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition">
                  <Lock className="w-4 h-4" /> Lock
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-100 transition border border-gray-200">
                  <Settings className="w-4 h-4" /> Settings
                </button>
              </div>
            </div>
          ))}

          {/* Enroll new */}
          <div className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-12 hover:border-indigo-300 hover:bg-indigo-50 transition group cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 group-hover:bg-indigo-200 flex items-center justify-center mb-3 transition">
              <Plus className="w-7 h-7 text-indigo-600" />
            </div>
            <p className="font-semibold text-gray-700 group-hover:text-indigo-700">Enroll New Device</p>
            <p className="text-sm text-gray-400 mt-1">Scan QR code to add</p>
          </div>
        </div>
      </div>
    </>
  );
}
