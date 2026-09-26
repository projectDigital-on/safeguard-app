-- CreateTable
CREATE TABLE "parents" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "avatar" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'FREE',
    "emailVerified" TIMESTAMP(3),
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "children" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "avatar" TEXT,
    "grade" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "children_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "model" TEXT,
    "osVersion" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OFFLINE',
    "battery" INTEGER,
    "storage" INTEGER,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeen" TIMESTAMP(3),
    "currentApp" TEXT,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "screen_time_rules" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "dailyLimitMins" INTEGER NOT NULL DEFAULT 120,
    "weekendLimitMins" INTEGER NOT NULL DEFAULT 180,
    "bedtimeStart" TEXT,
    "bedtimeEnd" TEXT,
    "schoolStart" TEXT,
    "schoolEnd" TEXT,
    "schoolDays" TEXT NOT NULL DEFAULT 'MON,TUE,WED,THU,FRI',
    "isPaused" BOOLEAN NOT NULL DEFAULT false,
    "pausedUntil" TIMESTAMP(3),
    "bonusMinutes" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "screen_time_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_rules" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "appName" TEXT NOT NULL,
    "appPackage" TEXT NOT NULL,
    "appIcon" TEXT,
    "action" TEXT NOT NULL DEFAULT 'ALLOW',
    "timeLimitMins" INTEGER,
    "category" TEXT NOT NULL DEFAULT 'OTHER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_filters" (
    "id" TEXT NOT NULL,
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
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_filters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "address" TEXT,
    "accuracy" DOUBLE PRECISION,
    "speed" DOUBLE PRECISION,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geofences" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emoji" TEXT DEFAULT '📍',
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "radius" DOUBLE PRECISION NOT NULL DEFAULT 200,
    "alertOnEnter" BOOLEAN NOT NULL DEFAULT true,
    "alertOnLeave" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "scheduleStart" TEXT,
    "scheduleEnd" TEXT,
    "scheduleDays" TEXT NOT NULL DEFAULT 'MON,TUE,WED,THU,FRI,SAT,SUN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "geofences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'INFO',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "extraData" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage_logs" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "appName" TEXT NOT NULL,
    "appPackage" TEXT NOT NULL,
    "appIcon" TEXT,
    "durationSecs" INTEGER NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'OTHER',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usage_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sentBy" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_requests" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "minutes" INTEGER NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "time_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "reportData" TEXT NOT NULL,
    "aiInsight" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'FREE',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
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

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "sim_cards" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "iccid" TEXT NOT NULL,
    "msisdn" TEXT,
    "gigsSimId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "dataUsedMb" INTEGER NOT NULL DEFAULT 0,
    "dataLimitMb" INTEGER NOT NULL DEFAULT 1024,
    "activatedAt" TIMESTAMP(3),
    "lastSeenAt" TIMESTAMP(3),
    "enrollToken" TEXT,
    "enrollTokenExp" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sim_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sim_policies" (
    "id" TEXT NOT NULL,
    "simId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Default Policy',
    "blockedCategories" TEXT NOT NULL DEFAULT '',
    "blockedApps" TEXT NOT NULL DEFAULT '',
    "allowedDomains" TEXT NOT NULL DEFAULT '',
    "blockedDomains" TEXT NOT NULL DEFAULT '',
    "schedules" TEXT NOT NULL DEFAULT '[]',
    "isPaused" BOOLEAN NOT NULL DEFAULT false,
    "pausedUntil" TIMESTAMP(3),
    "blockVpn" BOOLEAN NOT NULL DEFAULT true,
    "blockProxy" BOOLEAN NOT NULL DEFAULT true,
    "blockTor" BOOLEAN NOT NULL DEFAULT true,
    "safeSearch" BOOLEAN NOT NULL DEFAULT true,
    "youtubeRestricted" BOOLEAN NOT NULL DEFAULT false,
    "dailyDataLimitMb" INTEGER,
    "monthlyDataLimitMb" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sim_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sim_locations" (
    "id" TEXT NOT NULL,
    "simId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "accuracy" DOUBLE PRECISION,
    "address" TEXT,
    "source" TEXT NOT NULL DEFAULT 'cell',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sim_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sim_alerts" (
    "id" TEXT NOT NULL,
    "simId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'info',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "extraData" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sim_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sim_usage_logs" (
    "id" TEXT NOT NULL,
    "simId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "appName" TEXT,
    "category" TEXT,
    "requestCount" INTEGER NOT NULL DEFAULT 1,
    "dataMb" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sim_usage_logs_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE UNIQUE INDEX "sim_cards_iccid_key" ON "sim_cards"("iccid");

-- CreateIndex
CREATE UNIQUE INDEX "sim_cards_gigsSimId_key" ON "sim_cards"("gigsSimId");

-- CreateIndex
CREATE UNIQUE INDEX "sim_cards_enrollToken_key" ON "sim_cards"("enrollToken");

-- CreateIndex
CREATE UNIQUE INDEX "sim_policies_simId_key" ON "sim_policies"("simId");

-- AddForeignKey
ALTER TABLE "children" ADD CONSTRAINT "children_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "screen_time_rules" ADD CONSTRAINT "screen_time_rules_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_rules" ADD CONSTRAINT "app_rules_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_filters" ADD CONSTRAINT "content_filters_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geofences" ADD CONSTRAINT "geofences_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_logs" ADD CONSTRAINT "usage_logs_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_logs" ADD CONSTRAINT "usage_logs_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_requests" ADD CONSTRAINT "time_requests_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "parents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "parents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sim_cards" ADD CONSTRAINT "sim_cards_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sim_policies" ADD CONSTRAINT "sim_policies_simId_fkey" FOREIGN KEY ("simId") REFERENCES "sim_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sim_locations" ADD CONSTRAINT "sim_locations_simId_fkey" FOREIGN KEY ("simId") REFERENCES "sim_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sim_alerts" ADD CONSTRAINT "sim_alerts_simId_fkey" FOREIGN KEY ("simId") REFERENCES "sim_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sim_usage_logs" ADD CONSTRAINT "sim_usage_logs_simId_fkey" FOREIGN KEY ("simId") REFERENCES "sim_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
