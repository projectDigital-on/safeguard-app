"use client";

import { useSession } from "next-auth/react";
import { Bell, Zap } from "lucide-react";
import { getInitials, getAvatarColor } from "@/lib/utils";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { data: session } = useSession();
  const name = session?.user?.name || "Parent";
  const initials = getInitials(name);
  const avatarColor = getAvatarColor(name);

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Credits */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-100">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-semibold">Pro Plan</span>
        </div>

        {/* Alerts bell */}
        <button className="relative p-2 hover:bg-gray-100 rounded-xl transition">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold cursor-pointer",
          avatarColor
        )}>
          {initials}
        </div>
      </div>
    </header>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
