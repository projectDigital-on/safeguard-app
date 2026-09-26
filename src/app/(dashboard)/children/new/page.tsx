"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import {
  User, Smartphone, QrCode, CheckCircle,
  ChevronRight, ChevronLeft, Loader2, Copy, Check
} from "lucide-react";

// Wizard steps
const STEPS = ["Child Profile", "Enroll Device", "Set Rules", "Done"];

// Emoji avatar options
const AVATARS = ["👧", "👦", "🧒", "👶", "🧑", "👩", "👨", "🐱", "🐶", "🦊", "🐼", "🦁"];

export default function AddChildPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [grade, setGrade] = useState("");
  const [avatar, setAvatar] = useState("👧");

  // Generated enrollment token (simulated)
  const [enrollToken] = useState(() => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  });

  // Screen time defaults
  const [dailyLimit, setDailyLimit] = useState(120);
  const [bedtime, setBedtime] = useState("21:00");

  function copyToken() {
    navigator.clipboard.writeText(enrollToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleFinish() {
    setIsLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setIsLoading(false);
    setStep(3);
  }

  return (
    <>
      <Header title="Add Child" subtitle="Set up a new child profile and enroll their device" />
      <div className="p-6 max-w-2xl mx-auto">

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  i < step ? "bg-green-500 text-white" :
                  i === step ? "bg-indigo-600 text-white" :
                  "bg-gray-100 text-gray-400"
                }`}>
                  {i < step ? <CheckCircle className="w-5 h-5" /> : i + 1}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${
                  i === step ? "text-indigo-600" : i < step ? "text-green-600" : "text-gray-400"
                }`}>{s}</span>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 w-8 sm:w-16 mx-2 ${i < step ? "bg-green-400" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 0: Child Profile */}
        {step === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Child&apos;s Profile</h2>
            <p className="text-gray-500 text-sm mb-6">Tell us about the child you want to protect</p>

            {/* Avatar picker */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Choose an avatar</label>
              <div className="grid grid-cols-6 gap-2">
                {AVATARS.map(a => (
                  <button
                    key={a}
                    onClick={() => setAvatar(a)}
                    className={`text-3xl p-2 rounded-xl transition ${
                      avatar === a ? "bg-indigo-100 ring-2 ring-indigo-400 scale-110" : "hover:bg-gray-50"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Child&apos;s name *</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Emma"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Age *</label>
                  <select
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm bg-white"
                  >
                    <option value="">Select age</option>
                    {Array.from({ length: 12 }, (_, i) => i + 5).map(a => (
                      <option key={a} value={a}>{a} years old</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Grade (optional)</label>
                  <input
                    value={grade}
                    onChange={e => setGrade(e.target.value)}
                    placeholder="e.g. 5th Grade"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setStep(1)}
                disabled={!name || !age}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:bg-indigo-300 transition"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Enroll Device */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Enroll Android Device</h2>
            <p className="text-gray-500 text-sm mb-6">
              Install the SafeGuard agent on <strong>{name}</strong>&apos;s Android device
            </p>

            {/* QR Code placeholder */}
            <div className="flex flex-col items-center mb-8">
              <div className="p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 mb-4">
                {/* Simulated QR code pattern */}
                <div className="w-48 h-48 grid grid-cols-7 gap-0.5 p-2 bg-white rounded-xl">
                  {Array.from({ length: 49 }, (_, i) => (
                    <div
                      key={i}
                      className={`rounded-sm ${
                        [0,1,2,3,4,5,6,7,13,14,20,21,27,28,29,30,31,32,33,34,41,42,43,44,45,46,47,48,8,15,22,36].includes(i)
                          ? "bg-gray-900"
                          : Math.random() > 0.5 ? "bg-gray-900" : "bg-white"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Enrollment code */}
              <div className="w-full p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <p className="text-xs text-indigo-600 font-medium mb-1 text-center">Enrollment Code</p>
                <div className="flex items-center justify-center gap-3">
                  <code className="text-2xl font-bold text-indigo-800 tracking-[0.3em]">
                    {enrollToken.slice(0, 4)}-{enrollToken.slice(4)}
                  </code>
                  <button
                    onClick={copyToken}
                    className="p-2 hover:bg-indigo-100 rounded-lg transition text-indigo-600"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-indigo-500 text-center mt-1">Expires in 24 hours</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 text-sm">How to enroll:</h3>
              {[
                { step: "1", text: "On the child's Android device, open the Play Store" },
                { step: "2", text: 'Search for "SafeGuard Parental Control" and install it' },
                { step: "3", text: "Open the app and tap 'Enroll this device'" },
                { step: "4", text: "Scan the QR code above OR enter the enrollment code" },
                { step: "5", text: "The device will appear in your dashboard automatically" },
              ].map(item => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {item.step}
                  </div>
                  <p className="text-sm text-gray-600">{item.text}</p>
                </div>
              ))}
            </div>

            {/* Note for MVP */}
            <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-xs text-amber-700">
                <strong>Demo mode:</strong> The Android agent is in development. For now, mock device data will be used to demonstrate the full dashboard experience.
              </p>
            </div>

            <div className="flex justify-between mt-8">
              <button onClick={() => setStep(0)}
                className="flex items-center gap-2 px-5 py-2.5 text-gray-600 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Set Rules */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Set First Rules</h2>
            <p className="text-gray-500 text-sm mb-6">
              Quick setup for <strong>{name}</strong> — you can change these anytime
            </p>

            <div className="space-y-6">
              {/* Daily screen time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Daily screen time limit
                </label>
                <p className="text-xs text-gray-400 mb-3">
                  How many hours per day can {name} use their device?
                </p>
                <div className="flex items-center gap-4">
                  <input
                    type="range" min={30} max={480} step={30}
                    value={dailyLimit}
                    onChange={e => setDailyLimit(Number(e.target.value))}
                    className="flex-1 accent-indigo-600"
                  />
                  <span className="text-xl font-bold text-indigo-700 w-16 text-center">
                    {Math.floor(dailyLimit / 60)}h{dailyLimit % 60 > 0 ? ` ${dailyLimit % 60}m` : ""}
                  </span>
                </div>
              </div>

              {/* Bedtime */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedtime (auto-lock at)
                </label>
                <p className="text-xs text-gray-400 mb-3">
                  Device will lock automatically at this time
                </p>
                <input
                  type="time"
                  value={bedtime}
                  onChange={e => setBedtime(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                />
              </div>

              {/* Content filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Content filter level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "strict", label: "Strict", desc: "Ages 6-9", emoji: "🔒" },
                    { value: "moderate", label: "Moderate", desc: "Ages 10-12", emoji: "🛡️" },
                    { value: "light", label: "Light", desc: "Ages 13+", emoji: "✅" },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      className={`p-3 rounded-xl border-2 text-center transition ${
                        (Number(age) <= 9 && opt.value === "strict") ||
                        (Number(age) >= 10 && Number(age) <= 12 && opt.value === "moderate") ||
                        (Number(age) >= 13 && opt.value === "light")
                          ? "border-indigo-400 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">{opt.emoji}</div>
                      <div className="text-sm font-semibold text-gray-900">{opt.label}</div>
                      <div className="text-xs text-gray-400">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Block social media */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-900">Block Social Media</p>
                  <p className="text-xs text-gray-400">TikTok, Instagram, Snapchat etc.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={Number(age) <= 12} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
                </label>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button onClick={() => setStep(1)}
                className="flex items-center gap-2 px-5 py-2.5 text-gray-600 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handleFinish}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:bg-indigo-400 transition"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
                ) : (
                  <>Finish Setup <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Done */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <div className="text-5xl mb-4">{avatar}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {name} is all set!
            </h2>
            <p className="text-gray-500 mb-8">
              Profile created with a <strong>{Math.floor(dailyLimit / 60)}h daily limit</strong> and bedtime at <strong>{bedtime}</strong>.
              Enroll the Android device to start monitoring.
            </p>

            <div className="bg-indigo-50 rounded-xl p-4 mb-8 text-left">
              <p className="text-sm font-semibold text-indigo-900 mb-2">📱 Device Enrollment Code</p>
              <div className="flex items-center justify-between">
                <code className="text-xl font-bold text-indigo-800 tracking-widest">
                  {enrollToken.slice(0, 4)}-{enrollToken.slice(4)}
                </code>
                <button onClick={copyToken} className="p-2 hover:bg-indigo-100 rounded-lg text-indigo-600 transition">
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-indigo-500 mt-1">
                Enter this code in the SafeGuard Android app to link {name}&apos;s device
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => router.push("/children")}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
              >
                View Children
              </button>
              <button
                onClick={() => { setStep(0); setName(""); setAge(""); setGrade(""); setAvatar("👧"); }}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Add Another Child
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
