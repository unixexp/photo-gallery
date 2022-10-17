-- AlterTable
ALTER TABLE "categories" ADD COLUMN "mainPhoto" TEXT;

-- CreateTable
CREATE TABLE "photos" (
    "id" BLOB NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "main" TEXT,
    "thumbnail" TEXT
);
