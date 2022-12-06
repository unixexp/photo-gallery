/*
  Warnings:

  - You are about to drop the column `original` on the `photos` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `photos` table. All the data in the column will be lost.
  - Added the required column `originalFileName` to the `photos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalUUID` to the `photos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnailFileName` to the `photos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnailUUID` to the `photos` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_photos" (
    "id" BLOB NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    "name" TEXT,
    "description" TEXT,
    "originalFileName" TEXT NOT NULL,
    "thumbnailFileName" TEXT NOT NULL,
    "originalUUID" TEXT NOT NULL,
    "thumbnailUUID" TEXT NOT NULL
);
INSERT INTO "new_photos" ("created_at", "description", "id", "name", "updated_at") SELECT "created_at", "description", "id", "name", "updated_at" FROM "photos";
DROP TABLE "photos";
ALTER TABLE "new_photos" RENAME TO "photos";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
