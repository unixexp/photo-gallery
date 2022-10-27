import { prisma } from "~/lib/db"
import {
    resultOK,
    resultError,
    makePath,
    formatString
} from "~/lib/util"

import formidable from "formidable"
import fs from "fs"

export const config = {
    api: {
      bodyParser: false
    }
  }

export default async function getCategoryMainPhoto(req, res) {

    const mainPhotoPath = "/categories/<id>/photos/main"

    if (req.method === "GET") {

        res.status(200).json(resultOK())

    } else if (req.method === "POST") {

        const { id } = req.query

        const form = new formidable.IncomingForm()
        form.parse(req, function(err, fields, files) {
            makePath(formatString(mainPhotoPath, {id: id}), process.env.DATA_DIR)
            // const file = files.file
            // const data = fs.readFileSync(file.filepath)
            // fs.writeFileSync("./" + file.originalFilename, data)
        })

        return res.status(201).json(resultOK())

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