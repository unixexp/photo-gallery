Remove prisma/migration dir, then run
# npx prisma migrate dev
# ./snippets/init-dummy.js

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