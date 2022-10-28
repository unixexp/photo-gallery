import { prisma } from "~/lib/db"
import {
    resultOK,
    resultError,
    makePath,
    formatString,
    saveFile,
    convertUUIDStringToBuffered
} from "~/lib/util"
import { GalleryAPIServiceFactory } from "~/services/gallery-api-service-factory";

import formidable from "formidable"

export const config = {
    api: {
        bodyParser: false
    }
}

export default async function getCategoryMainPhoto(req, res) {

    if (req.method === "GET") {

        res.status(200).json(resultOK())

    } else if (req.method === "POST") {

        const galleryAPIService = GalleryAPIServiceFactory.getInstance()
        const { mainPhotoPath } = galleryAPIService.PATHS
        const { id } = req.query
        let response = null

        const form = new formidable.IncomingForm()
        form.parse(req, async function(err, fields, files) {
            const pathName = makePath(formatString(mainPhotoPath, {id: id}), process.env.DATA_DIR)
            const fileName = saveFile(files.file, pathName)
            
            if (err) {
                response = res.status(500).json(resultError(err))
            } else {

                let category = null

                try {
                    category = await prisma.Category.findUnique({
                        where: { id: convertUUIDStringToBuffered(id) }
                    })
                    
                    if (!category) {
                        response = res.status(404).json(resultError("Category not found"))
                    }
                } catch (e) {
                    await prisma.$disconnect()
                    console.log(e)
                    response = res.status(500).json(resultError())
                }

                try {
                    await prisma.Category.update({
                        where: { id: convertUUIDStringToBuffered(id) },
                        data: {...category, mainPhoto: fileName}
                    })
                } catch (e) {
                    await prisma.$disconnect()
                    console.log(e)
                    response = res.status(500).json(resultError())
                }

                response = res.status(201).json(resultOK())
            }
            
        })

        return response

    }

}