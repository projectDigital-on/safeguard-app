-- CreateTable
CREATE TABLE "parents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "avatar" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'FREE',
    "emailVerified" DATETIME,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "children" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "avatar" TEXT,
    "grade" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "children_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "devices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "childId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "model" TEXT,
    "osVersion" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OFFLINE',
    "battery" INTEGER,
    "storage" INTEGER,
    "enrolledAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeen" DATETIME,
    "currentApp" TEXT,
    CONSTRAINT "devices_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "screen_time_rules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "childId" TEXT NOT NULL,
    "dailyLimitMins" INTEGER NOT NULL DEFAULT 120,
    "weekendLimitMins" INTEGER NOT NULL DEFAULT 180,
    "bedtimeStart" TEXT,
    "bedtimeEnd" TEXT,
    "schoolStart" TEXT,
    "schoolEnd" TEXT,
    "schoolDays" TEXT NOT NULL DEFAULT 'MON,TUE,WED,THU,FRI',
    "isPaused" BOOLEAN NOT NULL DEFAULT false,
    "pausedUntil" DATETIME,
    "bonusMinutes" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "screen_time_rules_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "app_rules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "childId" TEXT NOT NULL,
    "appName" TEXT NOT NULL,
    "appPackage" TEXT NOT NULL,
    "appIcon" TEXT,
    "action" TEXT NOT NULL DEFAULT 'ALLOW',
    "timeLimitMins" INTEGER,
    "category" TEXT NOT NULL DEFAULT 'OTHER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "app_rules_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "content_filters" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "childId" TEXT NOT NULL,
    "blockAdult" BOOLEAN NOT NULL DEFAULT true,
    "blockViolence" BOOLEAN NOT NULL DEFAULT true,
    "blockGambling" BOOLEAN NOT NULL DEFAULT true,
    "blockDrugs" BOOLEAN NOT NULL DEFAULT true,
    "blockSocialMedia" BOOLEAN NOT NULL DEFAULT false,
    "blockGaming" BOOLEAN NOT NULL DEFAULT false,
    "blockShopping" BOOLEAN NOT NULL DEFAULT false,
    "safeSearch" BOOLEAN NOT NULL DEFAULT true,
    "youtubeRestricted" BOOLEAN NOT NULL DEFAULT true,
    "blockedUrls" TEXT NOT NULL DEFAULT '',
    "allowedUrls" TEXT NOT NULL DEFAULT '',
    "filterProfile" TEXT NOT NULL DEFAULT 'TWEEN',
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "content_filters_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "deviceId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "address" TEXT,
    "accuracy" REAL,
    "speed" REAL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "locations_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "locations_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "geofences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "childId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emoji" TEXT DEFAULT '📍',
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "radius" REAL NOT NULL DEFAULT 200,
    "alertOnEnter" BOOLEAN NOT NULL DEFAULT true,
    "alertOnLeave" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "scheduleStart" TEXT,
    "scheduleEnd" TEXT,
    "scheduleDays" TEXT NOT NULL DEFAULT 'MON,TUE,WED,THU,FRI,SAT,SUN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "geofences_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parentId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'INFO',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "extraData" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "alerts_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "alerts_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "usage_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "deviceId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "appName" TEXT NOT NULL,
    "appPackage" TEXT NOT NULL,
    "appIcon" TEXT,
    "durationSecs" INTEGER NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'OTHER',
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "usage_logs_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "usage_logs_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "childId" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sentBy" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "messages_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "messages_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "time_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "childId" TEXT NOT NULL,
    "minutes" INTEGER NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "requestedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" DATETIME,
    CONSTRAINT "time_requests_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "childId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "reportData" TEXT NOT NULL,
    "aiInsight" TEXT,
    "generatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reports_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parentId" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'FREE',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATETIME,
    "cancelledAt" DATETIME,
    CONSTRAINT "subscriptions_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "parents" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "parents" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "parents_email_key" ON "parents"("email");

-- CreateIndex
CREATE UNIQUE INDEX "screen_time_rules_childId_key" ON "screen_time_rules"("childId");

-- CreateIndex
CREATE UNIQUE INDEX "app_rules_childId_appPackage_key" ON "app_rules"("childId", "appPackage");

-- CreateIndex
CREATE UNIQUE INDEX "content_filters_childId_key" ON "content_filters"("childId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_parentId_key" ON "subscriptions"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");
