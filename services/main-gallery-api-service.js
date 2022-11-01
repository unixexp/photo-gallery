import GalleryAPIService from "./gallery-api-service";
import { formatString } from "~/lib/util"

export default class MainGalleryAPIService extends GalleryAPIService {

    constructor(){
        super()
        this.API_SERVER = "http://localhost:3000"
        this.PHOTOS_PATH = "/data/photos"
        this.API_ROUTES = {
            categories: "/api/admin/categories",
            categoriesPhotosMain: "/api/admin/categories/<id>/photos/main"
        }
        this.PATHS = {
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
        const imgBlob = await response.blob()
        return URL.createObjectURL(imgBlob)
    }

    uploadCategoryMainPhoto = async (category, uploadable) => {
        const path = formatString(this.getRouteURL("categoriesPhotosMain"), {id: category.id})
        const body = new FormData()
        body.append("file", uploadable)
        const response = await fetch(path, { method: "POST", body })
        return await response.json()
    }

    getRouteURL = (route) => {
        const url = new URL(this.API_ROUTES[route], this.API_SERVER)
        return url.href
    }

}