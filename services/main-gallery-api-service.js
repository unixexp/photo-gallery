import path from "path"
import { v4 as uuidv4} from "uuid";
import GalleryAPIService from "./gallery-api-service";

export default class MainGalleryAPIService extends GalleryAPIService {

    constructor(){
        super()
        this.API_SERVER = "http://localhost:3000"

        this.categories = []
        this.photos = []

        // MOCK photo path
        this.PHOTOS_PATH = "/data/photos"

        // MOCK photo list
        this.photos = [            ]
    }

    getCategories = async () => {
        let data = []
        try {
            const path = this.makeAPIUrl("/api/admin/categories")
            const response = await fetch(path, { method: "GET" })
            const json = await response.json()
            data = json.response
        } catch (e) {
            console.log(e)
            return []
        } finally {
            return data
        }
    }

    removeCategory = async (id) => {
        try {
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    const _index = this.categories.findIndex((cat) => cat.id === id)
                    if (_index != -1) {
                        const newCategories = [
                            ...this.categories.slice(0, _index),
                            ...this.categories.slice(_index + 1)
                        ]
                        this.categories = newCategories
                        resolve()
                    } else {
                        reject(`Category with ${id} not found!`)
                    }
                }, 500)
            })
        } catch (e) {
            console.log(e)
        }
    }

    addCategory = async (name) => {
        try {
            return await new Promise((resolve, reject) => {
                setTimeout(() => {
                    const newCategory = {id: uuidv4(), name: name, description: ""}
                    this.categories = [
                        ...this.categories,
                        newCategory
                    ]
                    resolve(newCategory)
                }, 300)
            })
        } catch (e) {
            console.log(e)
        }
    }

    updateCategory = async (category) => {
        try {
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    const _index = this.categories.findIndex(cat => cat.id === category.id)
                    if (_index == -1) {
                        reject("Category not found!")
                    } else {
                        this.categories[_index] = category
                        resolve()
                    }
                }, 600)
            })
        } catch (e) {
            console.log(e)
        }
    }

    getPhotos = async (categoryId, page, onPage) => {
        const categoryPath = path.join(this.PHOTOS_PATH, categoryId.toString())
        try {
            return await new Promise((resolve, reject) => {
                resolve(null)
            })
        } catch (e) {
            console.log(e)
        }
    }

    getPhotosPath = () => {
        return this.PHOTOS_PATH
    }

    makeAPIUrl = (url) => {
        const converted = new URL(url, this.API_SERVER)
        return converted.href
    }

}