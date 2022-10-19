-- CreateTable
CREATE TABLE "categories" (
    "id" BLOB NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    "name" TEXT NOT NULL,
    "main_photo" TEXT
);

-- CreateTable
CREATE TABLE "photos" (
    "id" BLOB NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    "main" TEXT,
    "thumbnail" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");
