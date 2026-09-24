/*
  Warnings:

  - You are about to drop the column `rescheduledFrom` on the `Appointment` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Appointment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientId" INTEGER NOT NULL,
    "physiotherapistId" INTEGER NOT NULL,
    "scheduleId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "reason" TEXT,
    "price" REAL NOT NULL,
    "painLevel" INTEGER,
    "sessionNotes" TEXT,
    "cancelledBy" TEXT,
    "cancelReason" TEXT,
    "rescheduledFromId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appointment_physiotherapistId_fkey" FOREIGN KEY ("physiotherapistId") REFERENCES "Physiotherapist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appointment_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appointment_rescheduledFromId_fkey" FOREIGN KEY ("rescheduledFromId") REFERENCES "Appointment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Appointment" ("cancelReason", "cancelledBy", "createdAt", "id", "painLevel", "patientId", "physiotherapistId", "price", "reason", "scheduleId", "sessionNotes", "status") SELECT "cancelReason", "cancelledBy", "createdAt", "id", "painLevel", "patientId", "physiotherapistId", "price", "reason", "scheduleId", "sessionNotes", "status" FROM "Appointment";
DROP TABLE "Appointment";
ALTER TABLE "new_Appointment" RENAME TO "Appointment";
CREATE UNIQUE INDEX "Appointment_scheduleId_key" ON "Appointment"("scheduleId");
CREATE UNIQUE INDEX "Appointment_rescheduledFromId_key" ON "Appointment"("rescheduledFromId");
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
    CONSTRAINT "Physiotherapist_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Physiotherapist_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "Specialty" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Physiotherapist" ("bio", "city", "crefito", "experienceYears", "id", "profileId", "rating", "serviceMode", "sessionPrice", "specialtyId") SELECT "bio", "city", "crefito", "experienceYears", "id", "profileId", "rating", "serviceMode", "sessionPrice", "specialtyId" FROM "Physiotherapist";
DROP TABLE "Physiotherapist";
ALTER TABLE "new_Physiotherapist" RENAME TO "Physiotherapist";
CREATE UNIQUE INDEX "Physiotherapist_profileId_key" ON "Physiotherapist"("profileId");
CREATE UNIQUE INDEX "Physiotherapist_crefito_key" ON "Physiotherapist"("crefito");
CREATE TABLE "new_Review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "appointmentId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
    CONSTRAINT "Schedule_physiotherapistId_fkey" FOREIGN KEY ("physiotherapistId") REFERENCES "Physiotherapist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Schedule" ("available", "dateTime", "id", "physiotherapistId") SELECT "available", "dateTime", "id", "physiotherapistId" FROM "Schedule";
DROP TABLE "Schedule";
ALTER TABLE "new_Schedule" RENAME TO "Schedule";
CREATE UNIQUE INDEX "Schedule_physiotherapistId_dateTime_key" ON "Schedule"("physiotherapistId", "dateTime");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'PATIENT',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("active", "createdAt", "email", "id", "name", "passwordHash", "role") SELECT "active", "createdAt", "email", "id", "name", "passwordHash", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
