import path from "path"
import { v4 as uuidv4} from "uuid";
import GalleryAPIService from "./gallery-api-service";

export default class DummyGalleryAPIService extends GalleryAPIService {

    constructor(){
        super()
        this.photos = []
        // MOCK category list
        this.categories = [
            {id: 1, name: "Category 1", description: "Category 1 description"},
            {id: 2, name: "Category 2", description: "Category 2 description"}
        ]

        // MOCK photo path
        this.PHOTOS_PATH = "/data/photos"

        // MOCK photo list
        this.photos = [
            {id: 1, categoryId: 1, filename: "photo-1.png", name: "Photo name 1", description: "Photo description Photo description Photo description Photo description Photo description (1)"},
            {id: 2, categoryId: 1, filename: "photo-2.png", name: "Photo name 2", description: "Photo description Photo description Photo description Photo description Photo description (2)"},
            {id: 3, categoryId: 1, filename: "photo-3.png", name: "Photo name 3", description: "Photo description Photo description Photo description Photo description Photo description (3)"},
            {id: 4, categoryId: 1, filename: "photo-4.png", name: "Photo name 4", description: "Photo description Photo description Photo description Photo description Photo description (4)"},
            {id: 5, categoryId: 1, filename: "photo-5.png", name: "Photo name 5", description: "Photo description Photo description Photo description Photo description Photo description (5)"},
            {id: 6, categoryId: 1, filename: "photo-6.png", name: "Photo name 6", description: "Photo description Photo description Photo description Photo description Photo description (6)"},
            {id: 7, categoryId: 1, filename: "photo-7.png", name: "Photo name 7", description: "Photo description Photo description Photo description Photo description Photo description (7)"},
            {id: 8, categoryId: 1, filename: "photo-8.png", name: "Photo name 8", description: "Photo description Photo description Photo description Photo description Photo description (8)"},
            {id: 9, categoryId: 1, filename: "photo-9.png", name: "Photo name 9", description: "Photo description Photo description Photo description Photo description Photo description (9)"},
            {id: 10, categoryId: 1, filename: "photo-10.png", name: "Photo name 10", description: "Photo description Photo description Photo description Photo description Photo description (10)"},
            {id: 11, categoryId: 1, filename: "photo-11.png", name: "Photo name 11", description: "Photo description Photo description Photo description Photo description Photo description (11)"},
            {id: 12, categoryId: 1, filename: "photo-12.png", name: "Photo name 12", description: "Photo description Photo description Photo description Photo description Photo description (12)"},
            {id: 13, categoryId: 2, filename: "photo-1.png", name: "Photo name 1", description: "Photo description Photo description Photo description Photo description Photo description (1)"},
            {id: 14, categoryId: 2, filename: "photo-2.png", name: "Photo name 2", description: "Photo description Photo description Photo description Photo description Photo description (2)"},
            {id: 15, categoryId: 2, filename: "photo-3.png", name: "Photo name 3", description: "Photo description Photo description Photo description Photo description Photo description (3)"},
            {id: 16, categoryId: 2, filename: "photo-4.png", name: "Photo name 4", description: "Photo description Photo description Photo description Photo description Photo description (4)"},
            {id: 17, categoryId: 2, filename: "photo-5.png", name: "Photo name 5", description: "Photo description Photo description Photo description Photo description Photo description (5)"}
        ]
    }

    getCategories = async () => {
        let data = []
        try {
            data = await new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(this.categories)
                }, 500)
            })
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

}