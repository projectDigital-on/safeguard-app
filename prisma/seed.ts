import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create demo parent
  const hashedPassword = await bcrypt.hash("Demo1234!", 12);

  const parent = await db.parent.upsert({
    where: { email: "demo@safeguard.com" },
    update: {},
    create: {
      email: "demo@safeguard.com",
      name: "Sarah Johnson",
      password: hashedPassword,
      plan: "FAMILY",
    },
  });
  console.log("✅ Parent created:", parent.email);

  // Create children
  const emma = await db.child.upsert({
    where: { id: "child-emma-001" },
    update: {},
    create: {
      id: "child-emma-001",
      parentId: parent.id,
      name: "Emma",
      age: 10,
      avatar: "👧",
      grade: "5th Grade",
    },
  });

  const lucas = await db.child.upsert({
    where: { id: "child-lucas-001" },
    update: {},
    create: {
      id: "child-lucas-001",
      parentId: parent.id,
      name: "Lucas",
      age: 13,
      avatar: "👦",
      grade: "8th Grade",
    },
  });
  console.log("✅ Children created:", emma.name, lucas.name);

  // Devices
  const emmaDevice = await db.device.upsert({
    where: { id: "device-emma-001" },
    update: {},
    create: {
      id: "device-emma-001",
      childId: emma.id,
      name: "Galaxy A15",
      model: "Samsung Galaxy A15",
      osVersion: "Android 14",
      status: "ONLINE",
      battery: 72,
      storage: 18,
      lastSeen: new Date(),
      currentApp: "YouTube",
    },
  });

  const lucasDevice = await db.device.upsert({
    where: { id: "device-lucas-001" },
    update: {},
    create: {
      id: "device-lucas-001",
      childId: lucas.id,
      name: "Pixel 7a",
      model: "Google Pixel 7a",
      osVersion: "Android 15",
      status: "ONLINE",
      battery: 45,
      storage: 32,
      lastSeen: new Date(),
      currentApp: "Minecraft",
    },
  });
  console.log("✅ Devices created");

  // Screen time rules
  await db.screenTimeRule.upsert({
    where: { childId: emma.id },
    update: {},
    create: {
      childId: emma.id,
      dailyLimitMins: 120,
      weekendLimitMins: 180,
      bedtimeStart: "21:00",
      bedtimeEnd: "07:00",
      schoolStart: "08:00",
      schoolEnd: "15:00",
    },
  });

  await db.screenTimeRule.upsert({
    where: { childId: lucas.id },
    update: {},
    create: {
      childId: lucas.id,
      dailyLimitMins: 180,
      weekendLimitMins: 240,
      bedtimeStart: "22:00",
      bedtimeEnd: "07:30",
      schoolStart: "08:00",
      schoolEnd: "15:00",
    },
  });
  console.log("✅ Screen time rules created");

  // App rules
  const appRules = [
    { childId: emma.id, appName: "TikTok", appPackage: "com.zhiliaoapp.musically", action: "BLOCK", category: "SOCIAL_MEDIA" },
    { childId: emma.id, appName: "YouTube", appPackage: "com.google.android.youtube", action: "LIMIT", timeLimitMins: 45, category: "ENTERTAINMENT" },
    { childId: lucas.id, appName: "TikTok", appPackage: "com.zhiliaoapp.musically", action: "LIMIT", timeLimitMins: 30, category: "SOCIAL_MEDIA" },
    { childId: lucas.id, appName: "Fortnite", appPackage: "com.epicgames.fortnite", action: "BLOCK", category: "GAMES" },
  ];

  for (const rule of appRules) {
    await db.appRule.upsert({
      where: { childId_appPackage: { childId: rule.childId, appPackage: rule.appPackage } },
      update: {},
      create: rule,
    });
  }
  console.log("✅ App rules created");

  // Content filters
  for (const childId of [emma.id, lucas.id]) {
    await db.contentFilter.upsert({
      where: { childId },
      update: {},
      create: {
        childId,
        blockAdult: true,
        blockViolence: true,
        blockGambling: true,
        blockDrugs: true,
        blockSocialMedia: childId === emma.id,
        safeSearch: true,
        youtubeRestricted: true,
        filterProfile: childId === emma.id ? "YOUNG_CHILD" : "TWEEN",
      },
    });
  }
  console.log("✅ Content filters created");

  // Geofences
  const geofences = [
    { childId: emma.id, name: "Home", emoji: "🏠", latitude: 51.505, longitude: -0.09, radius: 100 },
    { childId: emma.id, name: "School", emoji: "🏫", latitude: 51.510, longitude: -0.085, radius: 200 },
    { childId: lucas.id, name: "Home", emoji: "🏠", latitude: 51.505, longitude: -0.09, radius: 100 },
    { childId: lucas.id, name: "School", emoji: "🏫", latitude: 51.510, longitude: -0.085, radius: 200 },
    { childId: lucas.id, name: "Grandma's", emoji: "👵", latitude: 51.515, longitude: -0.095, radius: 150 },
  ];

  for (const gf of geofences) {
    await db.geofence.create({ data: gf }).catch(() => {});
  }
  console.log("✅ Geofences created");

  // Locations (last 7 days)
  const locations = [
    { deviceId: emmaDevice.id, childId: emma.id, latitude: 51.505, longitude: -0.09, address: "123 Oak Street (Home)", accuracy: 10 },
    { deviceId: lucasDevice.id, childId: lucas.id, latitude: 51.505, longitude: -0.09, address: "123 Oak Street (Home)", accuracy: 10 },
  ];

  for (const loc of locations) {
    await db.location.create({ data: loc });
  }
  console.log("✅ Locations created");

  // Alerts
  const alerts = [
    { parentId: parent.id, childId: emma.id, type: "SOS", severity: "CRITICAL", title: "SOS Triggered", message: "Emma pressed the SOS button", isRead: false },
    { parentId: parent.id, childId: emma.id, type: "SCREEN_TIME_LIMIT", severity: "WARNING", title: "Screen Time Limit Reached", message: "Emma has reached her daily 2h limit", isRead: false },
    { parentId: parent.id, childId: lucas.id, type: "GEOFENCE_EXIT", severity: "WARNING", title: "Left School Zone", message: "Lucas has left the School geofence", isRead: false },
    { parentId: parent.id, childId: lucas.id, type: "APP_BLOCKED", severity: "INFO", title: "App Blocked", message: "TikTok was blocked - Social Media category", isRead: true },
    { parentId: parent.id, childId: emma.id, type: "APP_INSTALL", severity: "INFO", title: "New App Installed", message: "Emma installed Roblox - pending approval", isRead: true },
    { parentId: parent.id, childId: lucas.id, type: "LOW_BATTERY", severity: "WARNING", title: "Low Battery", message: "Lucas's Pixel 7a is at 15% battery", isRead: true },
  ];

  for (const alert of alerts) {
    await db.alert.create({ data: alert });
  }
  console.log("✅ Alerts created");

  // Usage logs (7 days of data)
  const apps = [
    { appName: "YouTube", appPackage: "com.google.android.youtube", category: "ENTERTAINMENT", icon: "▶️" },
    { appName: "TikTok", appPackage: "com.zhiliaoapp.musically", category: "SOCIAL_MEDIA", icon: "🎵" },
    { appName: "Minecraft", appPackage: "com.mojang.minecraftpe", category: "GAMES", icon: "⛏️" },
    { appName: "WhatsApp", appPackage: "com.whatsapp", category: "COMMUNICATION", icon: "💬" },
    { appName: "Roblox", appPackage: "com.roblox.client", category: "GAMES", icon: "🎮" },
  ];

  const now = new Date();
  for (let day = 0; day < 7; day++) {
    const date = new Date(now);
    date.setDate(date.getDate() - day);

    for (const app of apps) {
      await db.usageLog.create({
        data: {
          deviceId: emmaDevice.id,
          childId: emma.id,
          appName: app.appName,
          appPackage: app.appPackage,
          appIcon: app.icon,
          durationSecs: Math.floor(Math.random() * 3600) + 600,
          category: app.category,
          date,
        },
      });
    }

    for (const app of apps.slice(1)) {
      await db.usageLog.create({
        data: {
          deviceId: lucasDevice.id,
          childId: lucas.id,
          appName: app.appName,
          appPackage: app.appPackage,
          appIcon: app.icon,
          durationSecs: Math.floor(Math.random() * 4800) + 900,
          category: app.category,
          date,
        },
      });
    }
  }
  console.log("✅ Usage logs created (7 days)");

  console.log("\n🎉 Seeding complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Demo Login:");
  console.log("  Email:    demo@safeguard.com");
  console.log("  Password: Demo1234!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
