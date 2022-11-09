import { prisma } from "~/lib/db"
import path from "path"
import {
    resultOK,
    resultError,
    makePath,
    formatString,
    saveFile,
    loadFile,
    convertUUIDStringToBuffered,
    convertUUIDBufferedToString
} from "~/lib/util"
import { GalleryAPIServiceFactory } from "~/services/gallery-api-service-factory";

import fs from "fs"
import formidable from "formidable"

export const config = {
    api: {
        bodyParser: false
    }
}

export default async function CategoriesPhotos(req, res) {

    if (req.method === "GET") {

        // TODO: implement getting category photo list
        return res.status(200).json(resultOK("Feature not implemented yet"))

    } else if (req.method === "POST") {

        const galleryAPIService = GalleryAPIServiceFactory.getInstance()
        const { mainPhotoPath, categoryPath } = galleryAPIService.PATHS
        const { id } = req.query
        let category = null

        // Check category exists
        try {
            category = await prisma.Category.findUnique({
                where: { id: convertUUIDStringToBuffered(id) }
            })
            
            if (!category) {
                return res.status(404).json(resultError("Category not found"))
            }
        } catch (e) {
            await prisma.$disconnect()
            console.log(e)
            return res.status(500).json(resultError())
        }

        // Parsing form data
        const form = new formidable.IncomingForm()
        form.parse(req, async function(err, fields, files) {

            // Dummy to test
            console.log(fields)
            console.log(files)
            return res.status(200).json(resultOK("Feature is testing"))

            const categoryPhotosPath = path.join(
                process.env.DATA_DIR,
                formatString(categoryPath, {"id": convertUUIDBufferedToString(category.id)})
                )
            fs.rmSync(categoryPhotosPath, { recursive: true, force: true }, (err) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json(resultError(err))
                }
            })

            const pathName = path.join(
                process.env.DATA_DIR,
                formatString(mainPhotoPath, {id: id})
            )
            makePath(formatString(mainPhotoPath, {id: id}), process.env.DATA_DIR)
            const fileName = saveFile(files.file, pathName)
            
            if (err) {
                return res.status(500).json(resultError(err))
            } else {
                try {
                    await prisma.Category.update({
                        where: { id: convertUUIDStringToBuffered(id) },
                        data: {...category, mainPhoto: fileName}
                    })
                } catch (e) {
                    await prisma.$disconnect()
                    console.log(e)
                    return res.status(500).json(resultError())
                }

                return res.status(201).json(resultOK())
            }
        })

    }

}