import path from "path"
import fs from "fs"
import { getGalleryAPIService } from "../../../services/gallery-api-service-factory"

export default function getPhotos(req, res) {

    const galleryAPIService = getGalleryAPIService() 

    if (req.method === "GET") {
        const { category } = req.query;
        const API_PATH = __dirname.split(".next")
        let categoryPath = path.join(galleryAPIService.getPhotosPath(), category)
        if (API_PATH.length) {
            categoryPath = path.join(API_PATH[0], categoryPath)
        } else {
            console.log(__dirname)
            res.status(500).json({ error: "Photos path not found" })
        }

        new Promise((resolve, reject) => {
            fs.readdir(categoryPath, (err, files) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(files)
                }
            })
        }).then((files) => {
            res.status(200).json({ data: files })
        }).catch((err) => {
            res.status(500).json({ error: err })
        })
    }

}