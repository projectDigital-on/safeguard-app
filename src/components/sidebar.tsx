"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Shield, LayoutDashboard, Users, Clock, MapPin,
  Bell, BarChart3, Settings, LogOut, Smartphone, Wifi,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard",    label: "Dashboard",    icon: LayoutDashboard, badge: undefined },
  { href: "/children",     label: "Children",     icon: Users,           badge: undefined },
  { href: "/screen-time",  label: "Screen Time",  icon: Clock,           badge: undefined },
  { href: "/location",     label: "Location",     icon: MapPin,          badge: undefined },
  { href: "/alerts",       label: "Alerts",       icon: Bell,            badge: "3" },
  { href: "/reports",      label: "Reports",      icon: BarChart3,       badge: undefined },
  { href: "/devices",      label: "Devices",      icon: Smartphone,      badge: undefined },
  { href: "/sim-control",  label: "SIM Control",  icon: Wifi,            badge: "NEW" },
  { href: "/settings",     label: "Settings",     icon: Settings,        badge: undefined },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 flex flex-col z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <div className="p-2 bg-indigo-600 rounded-xl">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold text-gray-900">SafeGuard</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className={cn("w-5 h-5", active ? "text-indigo-600" : "text-gray-400")} />
              {label}
              {badge && (
                <span className={`ml-auto text-xs rounded-full px-1.5 py-0.5 font-semibold ${
                  badge === "NEW"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-red-500 text-white"
                }`}>
                  {badge}
                </span>
              )}            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all w-full"
        >
          <LogOut className="w-5 h-5 text-gray-400" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
