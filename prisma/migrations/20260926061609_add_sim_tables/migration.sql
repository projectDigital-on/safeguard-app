-- CreateTable
CREATE TABLE "sim_cards" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "childId" TEXT NOT NULL,
    "iccid" TEXT NOT NULL,
    "msisdn" TEXT,
    "gigsSimId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "dataUsedMb" INTEGER NOT NULL DEFAULT 0,
    "dataLimitMb" INTEGER NOT NULL DEFAULT 1024,
    "activatedAt" DATETIME,
    "lastSeenAt" DATETIME,
    "enrollToken" TEXT,
    "enrollTokenExp" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "sim_cards_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sim_policies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "simId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Default Policy',
    "blockedCategories" TEXT NOT NULL DEFAULT '',
    "blockedApps" TEXT NOT NULL DEFAULT '',
    "allowedDomains" TEXT NOT NULL DEFAULT '',
    "blockedDomains" TEXT NOT NULL DEFAULT '',
    "schedules" TEXT NOT NULL DEFAULT '[]',
    "isPaused" BOOLEAN NOT NULL DEFAULT false,
    "pausedUntil" DATETIME,
    "blockVpn" BOOLEAN NOT NULL DEFAULT true,
    "blockProxy" BOOLEAN NOT NULL DEFAULT true,
    "blockTor" BOOLEAN NOT NULL DEFAULT true,
    "safeSearch" BOOLEAN NOT NULL DEFAULT true,
    "youtubeRestricted" BOOLEAN NOT NULL DEFAULT false,
    "dailyDataLimitMb" INTEGER,
    "monthlyDataLimitMb" INTEGER,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "sim_policies_simId_fkey" FOREIGN KEY ("simId") REFERENCES "sim_cards" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sim_locations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "simId" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "accuracy" REAL,
    "address" TEXT,
    "source" TEXT NOT NULL DEFAULT 'cell',
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sim_locations_simId_fkey" FOREIGN KEY ("simId") REFERENCES "sim_cards" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sim_alerts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "simId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'info',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "extraData" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sim_alerts_simId_fkey" FOREIGN KEY ("simId") REFERENCES "sim_cards" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sim_usage_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "simId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "appName" TEXT,
    "category" TEXT,
    "requestCount" INTEGER NOT NULL DEFAULT 1,
    "dataMb" REAL NOT NULL DEFAULT 0,
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sim_usage_logs_simId_fkey" FOREIGN KEY ("simId") REFERENCES "sim_cards" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "sim_cards_iccid_key" ON "sim_cards"("iccid");

-- CreateIndex
CREATE UNIQUE INDEX "sim_cards_gigsSimId_key" ON "sim_cards"("gigsSimId");

-- CreateIndex
CREATE UNIQUE INDEX "sim_cards_enrollToken_key" ON "sim_cards"("enrollToken");

-- CreateIndex
CREATE UNIQUE INDEX "sim_policies_simId_key" ON "sim_policies"("simId");
