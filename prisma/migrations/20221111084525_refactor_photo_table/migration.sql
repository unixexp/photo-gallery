/*
  Warnings:

  - You are about to drop the column `main` on the `photos` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_photos" (
    "id" BLOB NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    "name" TEXT,
    "description" TEXT,
    "original" TEXT,
    "thumbnail" TEXT
);
INSERT INTO "new_photos" ("created_at", "description", "id", "name", "thumbnail", "updated_at") SELECT "created_at", "description", "id", "name", "thumbnail", "updated_at" FROM "photos";
DROP TABLE "photos";
ALTER TABLE "new_photos" RENAME TO "photos";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
