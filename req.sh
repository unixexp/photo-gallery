#!/usr/bin/env bash

curl -X POST http://localhost:3000/api/admin/photos/add \
    -H 'Content-type: application/json' \
    -d '{"name": "photo1"}'

#curl -X POST http://localhost:3000/api/login \
#    -H 'Content-type: application/json' \
#    -d '{"username": "admin", "password": "friend"}'