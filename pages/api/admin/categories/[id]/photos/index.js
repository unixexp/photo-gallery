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
                include: { Photo: true },
                orderBy: { order: "asc" }
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
                linkId: convertUUIDBufferedToString(entry.id),
                url: "https://images.unsplash.com/photo-1549388604-817d15aa0110",
                updatedAt: entry.updatedAt != null ? new Date(entry.updatedAt) : entry.updatedAt,
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
            let originalUUID, thumbnailUUID = null

            try {
                const { photosPath, photosThumbnailsPath } = galleryAPIService.PATHS

                const photosPathAbs = makePath(photosPath, process.env.DATA_DIR)
                const photosThumbnailsPathAbs = makePath(photosThumbnailsPath, process.env.DATA_DIR)

                originalUUID = saveFile(originalUploadable, photosPathAbs)
                thumbnailUUID = saveFile(thumbnailUploadable, photosThumbnailsPathAbs)
            } catch (e) {
                return res.status(500).json(resultError(e.toString()))
            }

            if (originalUUID != null && thumbnailUUID != null) {
                try {
                    await addPhotoToDB({
                        ...fields,
                        originalUUID,
                        thumbnailUUID,
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

            return res.status(200).json(resultOK())
        })

    } else if (req.method === "PUT") {
        const galleryAPIService = GalleryAPIServiceFactory.getInstance()
        const { photosPath, photosThumbnailsPath } = galleryAPIService.PATHS
        const { id } = req.query
        let category = null
        const statements = []

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
            
            const { linkId, name, description, order } = fields
            const { originalUploadable, thumbnailUploadable } = files
            const content = {}
            let photoLink

            // Get link data
            try {
                photoLink = await prisma.CategoryPhotoLink.findUnique({
                    where: { id: convertUUIDStringToBuffered(linkId) }
                })
                
                if (!photoLink) {
                    return res.status(404).json(resultError("Photo not found"))
                }
            } catch (e) {
                await prisma.$disconnect()
                return res.status(500).json(resultError())
            }

            // Update basic photo fields
            if (originalUploadable != null) {
                let originalUUID
                const photosPathAbs = makePath(photosPath, process.env.DATA_DIR)
                try {
                    originalUUID = saveFile(originalUploadable, photosPathAbs)
                } catch (e) {
                    return res.status(500).json(resultError(e.toString()))
                }

                content.originalFileName = originalUploadable.originalFilename
                content.originalUUID = originalUUID
            }

            if (thumbnailUploadable != null) {
                let thumbnailUUID
                const photosThumbnailsPathAbs = makePath(photosThumbnailsPath, process.env.DATA_DIR)
                try {
                    thumbnailUUID = saveFile(thumbnailUploadable, photosThumbnailsPathAbs)
                } catch (e) {
                    return res.status(500).json(resultError(e.toString()))
                }

                content.thumbnailFileName = thumbnailUploadable.originalFilename
                content.thumbnailUUID = thumbnailUUID
            }

            statements.push(prisma.Photo.update({
                where: { id: photoLink.photoId },
                data: { name, description, ...content }
            }))

            // Sorting photo links
            const links = await prisma.CategoryPhotoLink.findMany({
                where: {
                    AND: [
                        { categoryId: category.id },
                        { id: { not: convertUUIDStringToBuffered(linkId) } }
                    ]
                }
            })
            const { currentLinkOrder, linksBefore, linksAfter } = getSortedPhotoLinksObject({ links, order })
            for (let link of [...linksBefore, ...linksAfter]) {
                statements.push(prisma.CategoryPhotoLink.update({
                    where: { id: link.id },
                    data: {...link}
                }))
            }

            statements.push(prisma.CategoryPhotoLink.update({
                where: { id: convertUUIDStringToBuffered(linkId) },
                data: { order: currentLinkOrder }
            }))

            try {
                await prisma.$transaction(statements)
            } catch (e) {
                return res.status(500).json(resultError(e.toString()))
            }
            
            return res.status(200).json(resultOK())

        })
    }

}

const getSortedPhotoLinksObject = ({ links, order }) => {
    let currentOrder = 1
    let linksSorted = [...links]

    linksSorted.sort((a, b) => a.order - b.order)

    const linksBefore = linksSorted.filter(item => item.order < order)
    const linksAfter = linksSorted.filter(item => item.order >= order)
    linksBefore.sort((a, b) => a.order - b.order)
    linksAfter.sort((a, b) => a.order - b.order);

    linksBefore.map((item) => { item.order = currentOrder; currentOrder++; });
    const currentLinkOrder = currentOrder;
    linksAfter.map((item) => { currentOrder++; item.order = currentOrder; });

    return {
        currentLinkOrder: currentLinkOrder,
        linksBefore: linksBefore,
        linksAfter: linksAfter
    }
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
    // Sorting photo links
    const links = await prisma.CategoryPhotoLink.findMany({ where: { categoryId: category.id } })
    const sortObj = getSortedPhotoLinksObject({ links, order })
    const { currentLinkOrder, linksBefore, linksAfter } = sortObj
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