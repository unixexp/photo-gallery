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

    if (req.method === "DELETE") {

        const { id: categoryId, photoId } = req.query
        let result = []

        try {
            await prisma.CategoryPhotoLink.deleteMany({
                where: {
                    AND: [
                        { photoId: convertUUIDStringToBuffered(photoId) },
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