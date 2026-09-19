-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "passwordHash" TEXT NOT NULL DEFAULT '$2b$10$21V92Zk9GwSDXAdgqRr/oul1AN7/roDDo.q/eqCW35OdH1wUQDg9O',
    "role" TEXT NOT NULL DEFAULT 'PATIENT',
    "active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "birthDate" DATETIME,
    "avatarUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Specialty" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT
);

-- CreateTable
CREATE TABLE "Physiotherapist" (
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

-- CreateTable
CREATE TABLE "Schedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "physiotherapistId" INTEGER NOT NULL,
    "dateTime" DATETIME NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Schedule_physiotherapistId_fkey" FOREIGN KEY ("physiotherapistId") REFERENCES "Physiotherapist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientId" INTEGER NOT NULL,
    "physiotherapistId" INTEGER NOT NULL,
    "scheduleId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "reason" TEXT,
    "price" REAL NOT NULL,
    "painLevel" INTEGER,
    "sessionNotes" TEXT,
    "rescheduledFrom" INTEGER,
    "cancelledBy" TEXT,
    "cancelReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appointment_physiotherapistId_fkey" FOREIGN KEY ("physiotherapistId") REFERENCES "Physiotherapist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appointment_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "appointmentId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Specialty_name_key" ON "Specialty"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Physiotherapist_profileId_key" ON "Physiotherapist"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "Physiotherapist_crefito_key" ON "Physiotherapist"("crefito");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_physiotherapistId_dateTime_key" ON "Schedule"("physiotherapistId", "dateTime");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_scheduleId_key" ON "Appointment"("scheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_appointmentId_key" ON "Review"("appointmentId");
