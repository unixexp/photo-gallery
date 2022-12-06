-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_category_photo_links" (
    "id" BLOB NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    "category_id" BLOB,
    "photo_id" BLOB,
    "order" INTEGER NOT NULL,
    CONSTRAINT "category_photo_links_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "category_photo_links_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "photos" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_category_photo_links" ("category_id", "created_at", "id", "order", "photo_id", "updated_at") SELECT "category_id", "created_at", "id", "order", "photo_id", "updated_at" FROM "category_photo_links";
DROP TABLE "category_photo_links";
ALTER TABLE "new_category_photo_links" RENAME TO "category_photo_links";
CREATE UNIQUE INDEX "category_photo_links_category_id_photo_id_order_key" ON "category_photo_links"("category_id", "photo_id", "order");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
