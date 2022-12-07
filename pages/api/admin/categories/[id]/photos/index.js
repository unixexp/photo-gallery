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

import fs, { link } from "fs"
import formidable from "formidable"

export const config = {
    api: {
        bodyParser: false
    }
}

export default async function CategoriesPhotos(req, res) {

    if (req.method === "GET") {

        const { id } = req.query
        let result = []

        try {
            result = await prisma.CategoryPhotoLink.findMany({
                where: { categoryId: convertUUIDStringToBuffered(id) },
                include: { Photo: true }
            })
        } catch (e) {
            console.log(e)
            res.status(500).json(resultError())
            return
        }

        const data = result.map((entry) => {
            const photo = entry.Photo

            return {
                id: convertUUIDBufferedToString(photo.id),
                url: "https://images.unsplash.com/photo-1549388604-817d15aa0110",
                
                name: photo.name,
                description: photo.description,
                order: entry.order
            }
        })
        
        return res.status(200).json(resultOK(data))

    } else if (req.method === "POST") {

        const galleryAPIService = GalleryAPIServiceFactory.getInstance()
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
            return res.status(500).json(resultError())
        }

        // Parsing form data
        const form = new formidable.IncomingForm()
        form.parse(req, async function(err, fields, files) {

            const { originalUploadable, thumbnailUploadable } = files
            let uploaded = null
            let added = null

            try {
                uploaded = uploadPhotoFilesToDisk(galleryAPIService, originalUploadable, thumbnailUploadable)
            } catch (e) {
                return res.status(500).json(resultError(e.toString()))
            }

            if (uploaded != null) {
                try {
                    added = addPhotoToDB({
                        ...fields,
                        ...uploaded,
                        originalFileName: originalUploadable.originalFilename,
                        thumbnailFileName: thumbnailUploadable.originalFilename,
                        category
                    })
                } catch (e) {
                    return res.status(500).json(resultError(e.toString()))
                }
            } else {
                console.log(uploaded)
                return res.status(500).json(resultError("Cannot upload files."))
            }

            return res.status(200).json(resultOK("Feature is testing"))
        })

    }

}

const uploadPhotoFilesToDisk = (galleryAPIService, original, thumbnail) => {

    const { photosPath, photosThumbnailsPath } = galleryAPIService.PATHS

    const photosPathAbs = makePath(photosPath, process.env.DATA_DIR)
    const photosThumbnailsPathAbs = makePath(photosThumbnailsPath, process.env.DATA_DIR)

    const originalUUID = saveFile(original, photosPathAbs)
    const thumbnailUUID = saveFile(thumbnail, photosThumbnailsPathAbs)

    return { originalUUID, thumbnailUUID }

}

const addPhotoToDB = async (params) => {

    const {
        name,
        description,
        originalFileName,
        thumbnailFileName,
        originalUUID,
        thumbnailUUID,
        category,
        order
    } = params

    let dbOrder = 1;
    let links = []

    links = await prisma.CategoryPhotoLink.findMany({ where: { categoryId: category.id } })
    links.sort((a, b) => a.order - b.order)

    const linksBefore = links.filter(item => item.order < order)
    const linksAfter = links.filter(item => item.order >= order)
    linksBefore.sort((a, b) => a.order - b.order)
    linksAfter.sort((a, b) => a.order - b.order);

    linksBefore.map((item) => { item.order = dbOrder; dbOrder++; });
    const currentLinkOrder = dbOrder;
    linksAfter.map((item) => { dbOrder++; item.order = dbOrder; });

    const photo = {
        data: {
            id: makeUUIDBuffered(),
            name,
            description,
            originalFileName,
            thumbnailFileName,
            originalUUID,
            thumbnailUUID
        }
    }

    const statements = []
    // Add photo to db
    statements.push(prisma.Photo.create(photo))
    // Update order links before and after
    for (let link of [...linksBefore, ...linksAfter]) {
        statements.push(prisma.CategoryPhotoLink.update({
            where: { id: link.id },
            data: {...link}
        }))
    }
    // Add new link to photo
    statements.push(prisma.CategoryPhotoLink.create({
        data: {
            id: makeUUIDBuffered(),
            order: currentLinkOrder,
            Category: { connect: { id: category.id } },
            Photo: { connect: { id: photo.data.id }}
        }
    }))

    return await prisma.$transaction(statements)

}