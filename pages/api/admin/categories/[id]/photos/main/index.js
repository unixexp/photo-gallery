import { prisma } from "~/lib/db"
import {
    resultOK,
    resultError
} from "~/lib/util"

export default async function getCategoryMainPhoto(req, res) {

    if (req.method === "GET") {

        res.status(200).json(resultOK())

    } else if (req.method === "POST") {

        res.status(201).json(resultOK())

    }

}

/*
import path from "path"

import { getGalleryAPIService } from "../../../../../services/gallery-api-service-factory"
import { readDirectory } from "../../../../../lib/util"

export default function getPhotos(req, res) {

    const galleryAPIService = getGalleryAPIService() 

    if (req.method === "GET") {
        const { id } = req.query;
        const API_PATH = __dirname.split(".next")
        let categoryPath = path.join(galleryAPIService.getPhotosPath(), id)
        if (API_PATH.length) {
            categoryPath = path.join(API_PATH[0], categoryPath)
        } else {
            console.log(__dirname)
            res.status(500).json({ error: "Photos path not found" })
        }

        readDirectory(categoryPath).then((files) => {
            res.status(200).json({ files: files })
        }).catch((err) => {
            res.status(500).json({ error: err })
        })
    }

}
*/