import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const hashedPassword = await bcrypt.hash("Demo1234!", 12);

  const parent = await db.parent.upsert({
    where: { email: "demo@safeguard.com" },
    update: {},
    create: { email: "demo@safeguard.com", name: "Sarah Johnson", password: hashedPassword, plan: "FAMILY" },
  });
  console.log("✅ Parent:", parent.email);

  const emma = await db.child.upsert({
    where: { id: "child-emma-001" },
    update: {},
    create: { id: "child-emma-001", parentId: parent.id, name: "Emma", age: 10, avatar: "👧", grade: "5th Grade" },
  });

  const lucas = await db.child.upsert({
    where: { id: "child-lucas-001" },
    update: {},
    create: { id: "child-lucas-001", parentId: parent.id, name: "Lucas", age: 13, avatar: "👦", grade: "8th Grade" },
  });
  console.log("✅ Children:", emma.name, lucas.name);

  const ed = await db.device.upsert({
    where: { id: "device-emma-001" },
    update: {},
    create: { id: "device-emma-001", childId: emma.id, name: "Galaxy A15", model: "Samsung Galaxy A15", osVersion: "Android 14", status: "ONLINE", battery: 72, storage: 18, lastSeen: new Date(), currentApp: "YouTube" },
  });

  const ld = await db.device.upsert({
    where: { id: "device-lucas-001" },
    update: {},
    create: { id: "device-lucas-001", childId: lucas.id, name: "Pixel 7a", model: "Google Pixel 7a", osVersion: "Android 15", status: "ONLINE", battery: 45, storage: 32, lastSeen: new Date(), currentApp: "Minecraft" },
  });
  console.log("✅ Devices created");

  await db.screenTimeRule.upsert({ where: { childId: emma.id }, update: {}, create: { childId: emma.id, dailyLimitMins: 120, weekendLimitMins: 180, bedtimeStart: "21:00", bedtimeEnd: "07:00", schoolStart: "08:00", schoolEnd: "15:00" } });
  await db.screenTimeRule.upsert({ where: { childId: lucas.id }, update: {}, create: { childId: lucas.id, dailyLimitMins: 180, weekendLimitMins: 240, bedtimeStart: "22:00", bedtimeEnd: "07:30", schoolStart: "08:00", schoolEnd: "15:00" } });
  console.log("✅ Screen time rules created");

  await db.contentFilter.upsert({ where: { childId: emma.id }, update: {}, create: { childId: emma.id, blockAdult: true, blockViolence: true, blockGambling: true, blockDrugs: true, blockSocialMedia: true, safeSearch: true, youtubeRestricted: true, filterProfile: "YOUNG_CHILD" } });
  await db.contentFilter.upsert({ where: { childId: lucas.id }, update: {}, create: { childId: lucas.id, blockAdult: true, blockViolence: true, blockGambling: true, blockDrugs: true, blockSocialMedia: false, safeSearch: true, youtubeRestricted: false, filterProfile: "TWEEN" } });
  console.log("✅ Content filters created");

  const alertsData = [
    { parentId: parent.id, childId: emma.id, type: "SOS", severity: "CRITICAL", title: "SOS Triggered", message: "Emma pressed the SOS button", isRead: false },
    { parentId: parent.id, childId: emma.id, type: "SCREEN_TIME_LIMIT", severity: "WARNING", title: "Screen Time Limit Reached", message: "Emma reached her daily 2h limit", isRead: false },
    { parentId: parent.id, childId: lucas.id, type: "GEOFENCE_EXIT", severity: "WARNING", title: "Left School Zone", message: "Lucas has left the School geofence", isRead: false },
    { parentId: parent.id, childId: lucas.id, type: "APP_BLOCKED", severity: "INFO", title: "App Blocked", message: "TikTok blocked - Social Media", isRead: true },
    { parentId: parent.id, childId: emma.id, type: "APP_INSTALL", severity: "INFO", title: "New App Installed", message: "Emma installed Roblox", isRead: true },
    { parentId: parent.id, childId: lucas.id, type: "LOW_BATTERY", severity: "WARNING", title: "Low Battery", message: "Lucas's device at 15%", isRead: true },
  ];
  for (const a of alertsData) await db.alert.create({ data: a });
  console.log("✅ Alerts created");

  await db.location.create({ data: { deviceId: ed.id, childId: emma.id, latitude: 51.505, longitude: -0.09, address: "123 Oak Street (Home)", accuracy: 10 } });
  await db.location.create({ data: { deviceId: ld.id, childId: lucas.id, latitude: 51.505, longitude: -0.09, address: "123 Oak Street (Home)", accuracy: 10 } });

  const apps = [
    { appName: "YouTube", appPackage: "com.google.android.youtube", category: "ENTERTAINMENT" },
    { appName: "TikTok", appPackage: "com.zhiliaoapp.musically", category: "SOCIAL_MEDIA" },
    { appName: "Minecraft", appPackage: "com.mojang.minecraftpe", category: "GAMES" },
    { appName: "WhatsApp", appPackage: "com.whatsapp", category: "COMMUNICATION" },
    { appName: "Roblox", appPackage: "com.roblox.client", category: "GAMES" },
  ];

  const now = new Date();
  for (let day = 0; day < 7; day++) {
    const date = new Date(now); date.setDate(date.getDate() - day);
    for (const app of apps) {
      await db.usageLog.create({ data: { deviceId: ed.id, childId: emma.id, ...app, durationSecs: Math.floor(Math.random() * 3600) + 600, date } });
      await db.usageLog.create({ data: { deviceId: ld.id, childId: lucas.id, ...app, durationSecs: Math.floor(Math.random() * 4800) + 900, date } });
    }
  }
  console.log("✅ Usage logs created (7 days)");

  console.log("\n🎉 Done! Demo credentials:");
  console.log("  Email:    demo@safeguard.com");
  console.log("  Password: Demo1234!");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
