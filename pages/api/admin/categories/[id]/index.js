import path from "path"
import fs from "fs"
import { prisma } from "~/lib/db"
import {
    convertUUIDStringToBuffered,
    convertUUIDBufferedToString,
    resultOK,
    resultError,
    formatString
} from "~/lib/util"
import { GalleryAPIServiceFactory } from "~/services/gallery-api-service-factory";

export default async function Categories(req, res) {

    if (req.method === "GET") {

        const { id } = req.query
        let result = null

        try {
            result = await prisma.Category.findUnique({ where: { id: convertUUIDStringToBuffered(id) } })
            if (!result) {
                res.status(404).json(resultError("Category not found"))
            }
        } catch (e) {
            await prisma.$disconnect()
            console.log(e)
            res.status(500).json(resultError())
            return
        }

        const data = { ...result }
        data.id = convertUUIDBufferedToString(data.id)

        res.status(200).json(resultOK(data))

    } else if (req.method === "PUT") {

        const { id } = req.query
        const category = req.body
        let result = null

        try {
            result = await prisma.Category.findUnique({ where: { id: convertUUIDStringToBuffered(id) } })
            if (!result) {
                res.status(404).json(resultError("Category not found"))
            }
        } catch (e) {
            await prisma.$disconnect()
            console.log(e)
            res.status(500).json(resultError())
            return
        }

        try {
            if (category.createAt != null)
                category.createAt = new Date(category.createdAt)

            if (category.updatedAt != null)
                category.updatedAt = new Date(category.updatedAt)

            result = await prisma.Category.update({
                where: { id: convertUUIDStringToBuffered(id) },
                data: {...category, id: convertUUIDStringToBuffered(id)}
            })
        } catch (e) {
            console.log(e)
            res.status(500).json(resultError())
            return
        }

        const data = { ...result }
        data.id = convertUUIDBufferedToString(data.id)

        res.status(200).json(resultOK(data))

    } else if (req.method === "DELETE") {

        const { id } = req.query
        let category = null

        try {
            category = await prisma.Category.findUnique({ where: { id: convertUUIDStringToBuffered(id) } })
            if (!category) {
                res.status(404).json(resultError("Category not found"))
                return
            }
        } catch (e) {
            console.log(e)
            res.status(500).json(resultError())
            return
        }

        try {
            const result = await prisma.Category.delete({ where: { id: convertUUIDStringToBuffered(id) } })
        } catch (e) {
            console.log(e)
            res.status(500).json(resultError())
            return
        }

        if (category.mainPath != null) {
            const galleryAPIService = GalleryAPIServiceFactory.getInstance()
            const { mainPhotoPath } = galleryAPIService.PATHS
            const imagePath = path.join(
                process.env.DATA_DIR,
                formatString(mainPhotoPath, {id: convertUUIDBufferedToString(category.id)}),
                category.mainPhoto)

            if (fs.existsSync(imagePath))
                fs.unlinkSync(imagePath)
        }

        res.status(200).json(resultOK())

    }

}