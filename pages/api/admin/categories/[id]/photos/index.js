import { prisma } from "~/lib/db"
import {
    resultOK,
    resultError,
    makePath,
    saveFile,
    convertUUIDStringToBuffered,
    convertUUIDBufferedToString,
    makeUUIDBuffered
} from "~/lib/util"
import { GalleryAPIServiceFactory } from "~/services/gallery-api-service-factory";

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

        const data = result.map((link) => {
            const photo = link.Photo

            return {
                id: convertUUIDBufferedToString(photo.id),
                linkId: convertUUIDBufferedToString(link.id),
                linkUpdatedAt: link.updatedAt != null ? new Date(link.updatedAt) : link.updatedAt,
                photoUpdatedAt: photo.updatedAt != null ? new Date(photo.updatedAt) : photo.updatedAt,
                name: photo.name,
                description: photo.description,
                order: link.order
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
                res.status(404).json(resultError("Category not found"))
                return
            }
        } catch (e) {
            await prisma.$disconnect()
            res.status(500).json(resultError())
            return
        }

        // Parsing form data
        const form = new formidable.IncomingForm()
        form.parse(req, async function(err, fields, files) {

            const { order, loadedFromExists: photoId } = fields
            const { originalUploadable, thumbnailUploadable } = files
            let originalUUID, thumbnailUUID = null

            if (photoId === "") {

                try {
                    const { photosPath, photosThumbnailsPath } = galleryAPIService.PATHS
    
                    const photosPathAbs = makePath(photosPath, process.env.DATA_DIR)
                    const photosThumbnailsPathAbs = makePath(photosThumbnailsPath, process.env.DATA_DIR)
    
                    originalUUID = saveFile(originalUploadable, photosPathAbs)
                    thumbnailUUID = saveFile(thumbnailUploadable, photosThumbnailsPathAbs)
                } catch (e) {
                    console.log(e)
                    res.status(500).json(resultError(e.toString()))
                    return
                }

                if (originalUUID != null && thumbnailUUID != null) {
                    try {
                        await add({
                            ...fields,
                            originalUUID,
                            thumbnailUUID,
                            originalFileName: originalUploadable.originalFilename,
                            thumbnailFileName: thumbnailUploadable.originalFilename,
                            category
                        })
                    } catch (e) {
                        res.status(500).json(resultError(e.toString()))
                        return
                    }

                    response = res.status(200).json(resultOK())
                } else {
                    console.log(uploaded)
                    response = res.status(500).json(resultError("Cannot upload files."))
                }
            } else {
                try {
                    await addFromExists({category, order, photoId})
                } catch (e) {
                    console.log(e)
                    res.status(500).json(resultError(e.toString()))
                    return
                }

                res.status(200).json(resultOK())
                return
            }
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
            const links = await prisma.CategoryPhotoLink.findMany({ where: { categoryId: category.id } })
            const linksOrdered = move(
                linkId,
                order,
                links.map(link => {
                    link.id = convertUUIDBufferedToString(link.id)
                    return link
                }))

            for (let link of linksOrdered) {
                link.id = convertUUIDStringToBuffered(link.id)
                statements.push(prisma.CategoryPhotoLink.update({
                    where: { id: link.id },
                    data: {...link}
                }))
            }

            try {
                await prisma.$transaction(statements)
            } catch (e) {
                return res.status(500).json(resultError(e.toString()))
            }
            
            return res.status(200).json(resultOK())

        })
    }

}

const add = async (params) => {

    let {
        name,
        description,
        originalFileName,
        thumbnailFileName,
        originalUUID,
        thumbnailUUID,
        category,
        order
    } = params

    order = parseInt(order)

    if (order < 1)
        order = 1

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
    
    let n = 1
    for (let link of links.sort((a, b) => a.order - b.order)) {
        if (n == order)
            n++
        link.order = n
        n++
        
        statements.push(prisma.CategoryPhotoLink.update({
            where: { id: link.id },
            data: {...link}
        }))
    }

    // Add new link to photo
    statements.push(prisma.CategoryPhotoLink.create({
        data: {
            id: makeUUIDBuffered(),
            order: order > n ? n : order,
            Category: { connect: { id: category.id } },
            Photo: { connect: { id: photo.data.id }}
        }
    }))

    return await prisma.$transaction(statements)

}

const addFromExists = async (params) => {

    let { category, order, photoId } = params

    order = parseInt(order)

    if (order < 1)
        order = 1

    const statements = []
    const links = await prisma.CategoryPhotoLink.findMany({ where: { categoryId: category.id } })
    
    let n = 1
    for (let link of links.sort((a, b) => a.order - b.order)) {
        if (n == order)
            n++
        link.order = n
        n++
        
        statements.push(prisma.CategoryPhotoLink.update({
            where: { id: link.id },
            data: {...link}
        }))
    }

    // Add new link to photo
    statements.push(prisma.CategoryPhotoLink.create({
        data: {
            id: makeUUIDBuffered(),
            order: order > n ? n : order,
            Category: { connect: { id: category.id } },
            Photo: { connect: { id: convertUUIDStringToBuffered(photoId) }}
        }
    }))

    return await prisma.$transaction(statements)

}

const move = (id, order, links) => {

    order = parseInt(order)

    if (order < 1)
        order = 1

    let n = 1
    const linksWithoutCurrent = (links.filter(item => item.id != id).sort((a, b) => a.order - b.order))
    const linksOrdered = []
    for (let link of linksWithoutCurrent) {
        if (n == order)
            n++
        link.order = n
        n++
        linksOrdered.push(link)
    }

    const currentLink = (links.filter(item => item.id == id))[0]
    currentLink.order = order > n ? n : order
    linksOrdered.push(currentLink)
    linksOrdered.sort((a, b) => a.order - b.order)

    return linksOrdered

}

