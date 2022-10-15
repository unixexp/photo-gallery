import path from "path"
import { v4 as uuidv4} from "uuid";
import { parse as uuidParse } from "uuid"

import { getGalleryAPIService } from "../../../services/gallery-api-service-factory"
import { readDirectory } from "../../../lib/util"

export default function getPhotos(req, res) {

    const galleryAPIService = getGalleryAPIService() 

    if (req.method === "GET") {
        const { id } = req.query;
        const API_PATH = __dirname.split(".next")
        let photosPath = ""
        if (API_PATH.length) {
            photosPath = path.join(API_PATH[0], galleryAPIService.getPhotosPath())
        } else {
            console.log(photosPath)
            res.status(500).json({ error: `${photosPath} not found` })
        }

        readDirectory(photosPath).then((files) => {
            const filtered = files.filter((fname) => {
                try {
                    return uuidParse(fname)
                } catch {}
            })
            res.status(200).json({files: filtered })
        }).catch((err) => {
            console.log(err)
            res.status(500).json({ error: err })
        })
    }

}