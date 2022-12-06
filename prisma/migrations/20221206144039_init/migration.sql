-- CreateTable
CREATE TABLE "categories" (
    "id" BLOB NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "main_photo" TEXT
);

-- CreateTable
CREATE TABLE "photos" (
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

-- CreateTable
CREATE TABLE "category_photo_links" (
    "id" BLOB NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    "category_id" BLOB NOT NULL,
    "photo_id" BLOB NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "category_photo_links_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "category_photo_links_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "photos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "category_photo_links_category_id_photo_id_order_key" ON "category_photo_links"("category_id", "photo_id", "order");
