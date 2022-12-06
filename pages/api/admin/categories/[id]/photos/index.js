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
                        thumbnailFileName: thumbnailUploadable.originalFilename
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

    const { name, description, originalFileName, thumbnailFileName, originalUUID, thumbnailUUID } = params

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

    return await prisma.Photo.create(photo)

}