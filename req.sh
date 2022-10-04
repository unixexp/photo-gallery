#!/usr/bin/env bash

curl -X POST http://localhost:3000/api/admin/photos/add \
    -H 'Content-type: application/json' \
    -d '{"name": "photo1"}'