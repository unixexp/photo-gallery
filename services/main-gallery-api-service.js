import GalleryAPIService from "./gallery-api-service";
import { formatString } from "~/lib/util"

export default class MainGalleryAPIService extends GalleryAPIService {

    constructor(){
        super()
        this.API_SERVER = "http://localhost:3000"
        this.PHOTOS_PATH = "/data/photos"
        this.API_ROUTES = {
            categories: "/api/admin/categories",
            categoriesPhotos: "/api/admin/categories/<id>/photos",
            categoriesPhotosThumbnail: "/api/admin/categories/<id>/photos/<id>/thumbnail",
            categoriesPhotosMain: "/api/admin/categories/<id>/photos/main",

            photosOriginal: "/api/admin/photos/<id>/original",
            photosThumbnail: "/api/admin/photos/<id>/thumbnail",
        }
        this.PATHS = {
            categoryPath: "/categories/<id>",
            photosPath: "/photos",
            photosThumbnailsPath: "/photos/thumbnails",
            mainPhotoPath: "/categories/<id>/photos/main"
        }
    }

    getCategories = async () => {
        const path = this.getRouteURL("categories")
        const response = await fetch(path, { method: "GET" })
        return await response.json()
    }

    removeCategory = async (id) => {
        const path = `${this.getRouteURL("categories")}/${id}`
        const response = await fetch(path, { method: "DELETE" })
        return await response.json()
    }

    addCategory = async (name) => {
        const path = this.getRouteURL("categories")
        const response = await fetch(path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name: name})
        })
        return await response.json()
    }

    updateCategory = async (category) => {
        const path = `${this.getRouteURL("categories")}/${category.id}`
        const response = await fetch(path, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(category)
        })
        return await response.json()
    }

    getCategoryMainPhoto = async (category) => {
        const path = formatString(this.getRouteURL("categoriesPhotosMain"), {id: category.id})
        const response = await fetch(path, { method: "GET" })
        if (response.status == 200) {
            const imgBlob = await response.blob()
            return URL.createObjectURL(imgBlob)   
        } else {
            throw new Error(response.status)
        }
    }

    uploadCategoryMainPhoto = async (category, uploadable) => {
        const path = formatString(this.getRouteURL("categoriesPhotosMain"), {id: category.id})
        const body = new FormData()
        body.append("file", uploadable)
        const response = await fetch(path, { method: "POST", body })
        return await response.json()
    }

    getCategoryPhotos = async (category) => {
        const path = formatString(this.getRouteURL("categoriesPhotos"), {id: category.id})
        const response = await fetch(path, { method: "GET" })
        return await response.json()
    }

    createCategoryPhoto = async (params) => {
        const {
            name,
            description,
            originalUploadable,
            thumbnaillUploadable,
            category,
            order
        } = params

        const path = formatString(this.getRouteURL("categoriesPhotos"), {id: category.id})
        const body = new FormData()
        body.append("name", name)
        body.append("description", description)
        body.append("order", order)
        body.append("originalUploadable", originalUploadable)
        body.append("thumbnailUploadable", thumbnaillUploadable)
        const response = await fetch(path, { method: "POST", body })
        return await response.json()  
    }

    __getPhoto = async (id, path) => {
        const response = await fetch(path, { method: "GET" })
        if (response.status == 200) {
            const imgBlob = await response.blob()
            return URL.createObjectURL(imgBlob)   
        } else {
            throw new Error(response.status)
        }
    }

    getPhoto = async (id) => {
        const path = formatString(this.getRouteURL("photosOriginal"), {id})
        return this.__getPhoto(id, path)
    }

    getPhotoThumbnail = async (id) => {
        const path = formatString(this.getRouteURL("photosThumbnail"), {id})
        return this.__getPhoto(id, path)
    }

    getRouteURL = (route) => {
        const url = new URL(this.API_ROUTES[route], this.API_SERVER)
        return url.href
    }

}