import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Shield, Lock, MapPin, BarChart3, Bell, Smartphone } from "lucide-react";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 rounded-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">SafeGuard</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
          >
            Get started free
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
          Android Parental Control
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Keep your children<br />
          <span className="text-indigo-600">safe online</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Monitor screen time, block inappropriate content, track location, and get
          real-time alerts — all from one simple dashboard.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/signup"
            className="px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition text-lg"
          >
            Start for free →
          </Link>
          <Link
            href="/login"
            className="px-8 py-3.5 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition text-lg border border-gray-200"
          >
            View demo
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Lock,
              color: "text-indigo-600 bg-indigo-100",
              title: "Screen Time Control",
              description: "Set daily limits, bedtime schedules, and pause all screen time instantly.",
            },
            {
              icon: MapPin,
              color: "text-green-600 bg-green-100",
              title: "Location Tracking",
              description: "Real-time GPS tracking with geofence alerts for home, school, and more.",
            },
            {
              icon: Smartphone,
              color: "text-purple-600 bg-purple-100",
              title: "App Management",
              description: "Block apps, set per-app time limits, and approve new installs.",
            },
            {
              icon: Bell,
              color: "text-red-600 bg-red-100",
              title: "Instant Alerts",
              description: "Get notified for SOS, geofence exits, screen time limits, and more.",
            },
            {
              icon: BarChart3,
              color: "text-amber-600 bg-amber-100",
              title: "Usage Reports",
              description: "Weekly insights on screen time, top apps, and AI-powered recommendations.",
            },
            {
              icon: Shield,
              color: "text-teal-600 bg-teal-100",
              title: "Content Filtering",
              description: "Block adult content, gambling, violence, and unsafe websites.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-indigo-600 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to protect your family?
          </h2>
          <p className="text-indigo-200 mb-8 text-lg">
            Join thousands of parents keeping their children safe online.
          </p>
          <Link
            href="/signup"
            className="px-8 py-3.5 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition inline-block"
          >
            Get started free — no credit card required
          </Link>
        </div>
      </section>
    </div>
  );
}
