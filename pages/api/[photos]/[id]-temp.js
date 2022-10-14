import path from "path"

import { getGalleryAPIService } from "../../services/gallery-api-service-factory"
import { readDirectory } from "../../lib/util"

export default function getPhoto(req, res) {

    const galleryAPIService = getGalleryAPIService() 

    if (req.method === "GET") {
        const { id } = req.query;
        console.log(id)
        const API_PATH = __dirname.split(".next")
        let photosPath = ""
        if (API_PATH.length) {
            photosPath = path.join(API_PATH[0], galleryAPIService.getPhotosPath())
        } else {
            console.log(photosPath)
            res.status(500).json({ error: `${photosPath} not found` })
        }

        readDirectory(photosPath).then((files) => {
            res.status(200).json({ files: files })
        }).catch((err) => {
            res.status(500).json({ error: err })
        })
    }

}