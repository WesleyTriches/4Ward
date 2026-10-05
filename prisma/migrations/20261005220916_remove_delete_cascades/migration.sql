-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Physiotherapist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "profileId" INTEGER NOT NULL,
    "specialtyId" INTEGER NOT NULL,
    "crefito" TEXT NOT NULL,
    "bio" TEXT,
    "sessionPrice" REAL NOT NULL,
    "city" TEXT NOT NULL,
    "serviceMode" TEXT NOT NULL,
    "experienceYears" INTEGER NOT NULL,
    "rating" REAL,
    CONSTRAINT "Physiotherapist_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Physiotherapist_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "Specialty" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Physiotherapist" ("bio", "city", "crefito", "experienceYears", "id", "profileId", "rating", "serviceMode", "sessionPrice", "specialtyId") SELECT "bio", "city", "crefito", "experienceYears", "id", "profileId", "rating", "serviceMode", "sessionPrice", "specialtyId" FROM "Physiotherapist";
DROP TABLE "Physiotherapist";
ALTER TABLE "new_Physiotherapist" RENAME TO "Physiotherapist";
CREATE UNIQUE INDEX "Physiotherapist_profileId_key" ON "Physiotherapist"("profileId");
CREATE UNIQUE INDEX "Physiotherapist_crefito_key" ON "Physiotherapist"("crefito");
CREATE TABLE "new_Profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "birthDate" DATETIME,
    "avatarUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Profile" ("avatarUrl", "birthDate", "createdAt", "fullName", "id", "phone", "updatedAt", "userId") SELECT "avatarUrl", "birthDate", "createdAt", "fullName", "id", "phone", "updatedAt", "userId" FROM "Profile";
DROP TABLE "Profile";
ALTER TABLE "new_Profile" RENAME TO "Profile";
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");
CREATE TABLE "new_Review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "appointmentId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("appointmentId", "comment", "createdAt", "id", "rating") SELECT "appointmentId", "comment", "createdAt", "id", "rating" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
CREATE UNIQUE INDEX "Review_appointmentId_key" ON "Review"("appointmentId");
CREATE TABLE "new_Schedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "physiotherapistId" INTEGER NOT NULL,
    "dateTime" DATETIME NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Schedule_physiotherapistId_fkey" FOREIGN KEY ("physiotherapistId") REFERENCES "Physiotherapist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Schedule" ("available", "dateTime", "id", "physiotherapistId") SELECT "available", "dateTime", "id", "physiotherapistId" FROM "Schedule";
DROP TABLE "Schedule";
ALTER TABLE "new_Schedule" RENAME TO "Schedule";
CREATE UNIQUE INDEX "Schedule_physiotherapistId_dateTime_key" ON "Schedule"("physiotherapistId", "dateTime");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
