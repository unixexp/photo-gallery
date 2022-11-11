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

export default async function CategoriesPhotosMain(req, res) {

    if (req.method === "GET") {

        const galleryAPIService = GalleryAPIServiceFactory.getInstance()
        const { mainPhotoPath } = galleryAPIService.PATHS
        const { id } = req.query

        let category = null

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

        if (category.mainPhoto != null) {
            const filePath = path.join(
                process.env.DATA_DIR,
                formatString(mainPhotoPath, {id: id}),
                category.mainPhoto)
    
            const file = loadFile(filePath)
    
            res.writeHead(
                200,
                {
                    "Content-Type": file.contentType,
                    "Content-Disposition": (!file.notFound)
                        ? `attachment; filename=${category.mainPhoto}`
                        : `attachment; filename=${file.notFound}`
                })
            res.write(file.data)
            return res.end()
        } else {
            return res.status(204).json(resultError("Image not loaded"))
        }

    } else if (req.method === "POST") {

        const galleryAPIService = GalleryAPIServiceFactory.getInstance()
        const { mainPhotoPath, categoryPath } = galleryAPIService.PATHS
        const { id } = req.query
        let category = null

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

        const form = new formidable.IncomingForm()
        form.parse(req, async function(err, fields, files) {

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
            let fileName
            try {
                fileName = saveFile(files.file, pathName)
            } catch (e) {
                return res.status(409).json(resultError(e.toString()))
            }
            
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