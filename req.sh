#!/usr/bin/env bash

curl -X POST http://localhost:3000/api/admin/categories \
    -H 'Content-type: application/json' \
    -d '{"name": "Category name 4"}'

#curl -X POST http://localhost:3000/api/login \
#    -H 'Content-type: application/json' \
#    -d '{"username": "admin", "password": "friend"}'