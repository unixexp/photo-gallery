import { ShoppingCartSharp } from "@material-ui/icons";
import { v4 as uuidv4} from "uuid";

export default class DummyGalleryAPIService {

    static photos = []

    // MOCK category list
    static categories = [
        {id: 1, name: "Category 1", description: "Category 1 description"},
        {id: 2, name: "Category 2", description: "Category 2 description"}
    ]

    // MOCK photo list
    static photos = [
        {id: 1, categoryId: 1, filename: "photo-1.png", description: "Photo description"},
        {id: 2, categoryId: 1, filename: "photo-2.png", description: "Photo description"},
        {id: 3, categoryId: 1, filename: "photo-3.png", description: "Photo description"},
        {id: 4, categoryId: 1, filename: "photo-4.png", description: "Photo description"},
        {id: 5, categoryId: 2, filename: "photo-1.png", description: "Photo description"},
        {id: 6, categoryId: 2, filename: "photo-2.png", description: "Photo description"}
    ]

    getCategories = async () => {
        let data = []
        try {
            data = await new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(DummyGalleryAPIService.categories)
                }, 500)
            })
        } catch (e) {
            console.log(e)
        } finally {
            return data
        }
    }

    removeCategory = async (id) => {
        try {
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    const _index = DummyGalleryAPIService.categories.findIndex((cat) => cat.id === id)
                    if (_index != -1) {
                        const newCategories = [
                            ...DummyGalleryAPIService.categories.slice(0, _index),
                            ...DummyGalleryAPIService.categories.slice(_index + 1)
                        ]
                        DummyGalleryAPIService.categories = newCategories
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
                    DummyGalleryAPIService.categories = [
                        ...DummyGalleryAPIService.categories,
                        newCategory
                    ]
                    resolve(newCategory)
                }, 300)
            })
        } catch (e) {
            console.log(e)
        }
    }

    getPhotos = async () => {
        let data = []
        try {
            data = await new Promise((resolve, reject) => {
                setTimeout(() => {resolve(DummyGalleryAPIService.photos)}, 200)
            })
        } catch (e) {
            console.log(e)
        } finally {
            return data
        }
    }

}