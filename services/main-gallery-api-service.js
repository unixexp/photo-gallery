import path from "path"
import { v4 as uuidv4} from "uuid";
import GalleryAPIService from "./gallery-api-service";

export default class MainGalleryAPIService extends GalleryAPIService {

    constructor(){
        super()
        this.API_SERVER = "http://localhost:3000"
        this.PHOTOS_PATH = "/data/photos"
        this.API_ROUTES = {
            categories: "/api/admin/categories"
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
        const path = this.getRouteURL("categories")
        const response = await fetch(path, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(category)
        })
        return await response.json()
    }

    getRouteURL = (route) => {
        const url = new URL(this.API_ROUTES[route], this.API_SERVER)
        return url.href
    }

}