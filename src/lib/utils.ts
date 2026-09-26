import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatSeconds(seconds: number): string {
  return formatMinutes(Math.floor(seconds / 60));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getAvatarColor(name: string): string {
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-green-500",
    "bg-teal-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case "CRITICAL": return "text-red-600 bg-red-50 border-red-200";
    case "WARNING":  return "text-amber-600 bg-amber-50 border-amber-200";
    default:         return "text-blue-600 bg-blue-50 border-blue-200";
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "ONLINE":      return "bg-green-500";
    case "LOCKED":      return "bg-red-500";
    case "LOW_BATTERY": return "bg-amber-500";
    default:            return "bg-gray-400";
  }
}

export function timeAgo(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const secs = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (secs < 60) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}
