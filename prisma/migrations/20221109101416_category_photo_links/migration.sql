-- CreateTable
CREATE TABLE "category_photo_links" (
    "id" BLOB NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    "category_id" BLOB NOT NULL,
    "photo_id" BLOB NOT NULL,
    "order" INTEGER NOT NULL,
    "description" TEXT,
    CONSTRAINT "category_photo_links_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "category_photo_links_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "photos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "category_photo_links_category_id_photo_id_order_key" ON "category_photo_links"("category_id", "photo_id", "order");
