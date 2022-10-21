Prepare MySQL database

CREATE DATABASE `photo-gallery` CHARACTER SET 'utf8mb4';
CREATE USER IF NOT EXISTS 'photo-gallery'@'localhost' IDENTIFIED BY '2x5ueiZRuj1';
GRANT USAGE ON `photo-gallery`.* TO 'photo-gallery'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER, CREATE TEMPORARY TABLES, CREATE VIEW, SHOW VIEW, CREATE ROUTINE, ALTER ROUTINE, EXECUTE ON `photo-gallery`.* TO 'photo-gallery'@'localhost';
ALTER USER 'photo-gallery'@'localhost' REQUIRE NONE WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;
FLUSH PRIVILEGES;

To init mysql schema by prisma use root
DATABASE_URL="mysql://root:******@localhost:3306/photo-gallery"

Replace user after initialization will be completed
DATABASE_URL="mysql://photo-gallery::******@@localhost:3306/photo-gallery"

Remove prisma/migration dir is it exists, then run

# npx prisma migrate dev --schema prisma/schema-sqlite.prisma

Add dummy records for categories and photos
# node ./snippets/init-dummy.js

-------------------------------------------

API ROUTES:

Get all photo UUIDs by category
/api/categories/1/photos/

Get main category photo
/api/categories/1/photos/main

Get main photo file or thumbnail by UUId
/api/photos/<uuid>/main
/api/photos/<uuid>/thumbnail

https://codesandbox.io/s/fsq8js?file=/demo.tsx
https://mui.com/material-ui/react-grid/
https://www.npmjs.com/package/sqlite
https://www.youtube.com/watch?v=PxiQDo0CmDE