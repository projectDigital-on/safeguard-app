"use client";

import { Header } from "@/components/header";
import { useSession } from "next-auth/react";
import { User, Bell, Shield, CreditCard, LogOut } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <>
      <Header title="Settings" subtitle="Manage your account and preferences" />
      <div className="p-6 max-w-2xl space-y-6">

        {/* Profile */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <User className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-900">Profile</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input defaultValue={session?.user?.name || ""} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input defaultValue={session?.user?.email || ""} type="email" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition">
              Save Changes
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <Bell className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-900">Notifications</h3>
          </div>
          <div className="space-y-4">
            {[
              { label: "SOS Alerts", desc: "Immediately notify when SOS is triggered", defaultOn: true },
              { label: "Geofence Alerts", desc: "When child enters or leaves a zone", defaultOn: true },
              { label: "Screen Time Limit", desc: "When daily limit is reached", defaultOn: true },
              { label: "New App Installs", desc: "When a new app is installed", defaultOn: false },
              { label: "Weekly Reports", desc: "Receive weekly usage summary by email", defaultOn: true },
            ].map(n => (
              <div key={n.label} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">{n.label}</p>
                  <p className="text-xs text-gray-400">{n.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={n.defaultOn} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-900">Subscription</h3>
          </div>
          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-indigo-900">Family Plan</p>
                <p className="text-sm text-indigo-600">Up to 5 children · All features</p>
              </div>
              <span className="px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-lg">Active</span>
            </div>
            <p className="text-sm text-indigo-600 mt-2">$9.99/month · Renews Oct 25, 2026</p>
          </div>
          <button className="text-sm text-red-500 hover:text-red-700 font-medium">
            Cancel subscription
          </button>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl border border-red-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <Shield className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-gray-900">Danger Zone</h3>
          </div>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 border border-red-200 rounded-xl text-sm text-red-600 hover:bg-red-50 transition font-medium">
              Delete Account & All Data
            </button>
            <p className="text-xs text-gray-400">
              This will permanently delete your account, all children profiles, and all data. This cannot be undone.
            </p>
          </div>
        </div>

      </div>
    </>
  );
}
