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
    convertUUIDBufferedToString,
    makeUUIDBuffered
} from "~/lib/util"
import { GalleryAPIServiceFactory } from "~/services/gallery-api-service-factory";

export default async function CategoriesPhoto(req, res) {

    if (req.method === "GET") {

        const { id: categoryId, photoId } = req.query
        let photo = null
        let data = null

        try {
            photo = await prisma.Photo.findUnique({
                where: {
                    id: convertUUIDStringToBuffered(photoId)
                },
                include: {
                    CategoryPhotoLink: {
                        where: {
                            AND: [
                                { photoId: convertUUIDStringToBuffered(photoId) },
                                { categoryId: convertUUIDStringToBuffered(categoryId) }
                            ]
                        }
                    }
                }
            })
        } catch (e) {
            console.log(e)
            return res.status(500).json(resultError())
        }

        if (photo != null) {
            data = {
                id: convertUUIDBufferedToString(photo.id),
                linkId: photo.CategoryPhotoLink.length
                    ? convertUUIDBufferedToString(photo.CategoryPhotoLink[0].id)
                    : 0,
                name: photo.name,
                description: photo.description,
                order: photo.CategoryPhotoLink.length
                    ? photo.CategoryPhotoLink[0].order
                    : 0
            }
        } else {
            return res.status(404).json(resultError("Not found."))
        }

        return res.status(200).json(resultOK(data))

    } else if (req.method === "DELETE") {

        const { id: categoryId, photoId: linkId } = req.query

        try {
            await prisma.CategoryPhotoLink.deleteMany({
                where: {
                    AND: [
                        { id: convertUUIDStringToBuffered(linkId) },
                        { categoryId: convertUUIDStringToBuffered(categoryId) }
                    ]
                }
            })
        } catch (e) {
            console.log(e)
            return res.status(500).json(resultError())
        }

        // Update category photos order
        let dbOrder = 1;
        let links = []
        const statements = []

        links = await prisma.CategoryPhotoLink.findMany({
            where: { categoryId: convertUUIDStringToBuffered(categoryId) }
        })
        links.sort((a, b) => a.order - b.order)
        links.map((item) => { item.order = dbOrder; dbOrder++; });

        for (let link of links) {
            statements.push(prisma.CategoryPhotoLink.update({
                where: { id: link.id },
                data: {...link}
            }))
        }

        try {
            await prisma.$transaction(statements)
        } catch (e) {
            console.log(e)
            return res.status(500).json(resultError())
        }

        return res.status(200).json(resultOK())

    }

}