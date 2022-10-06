import { v4 as uuidv4} from "uuid";

export default class DummyGalleryAPIService {

    constructor() {
        this._categories = [
            {id: uuidv4(), name: "Category 1"},
            {id: uuidv4(), name: "Category 2"}
        ]
        this._photos = []
        this._categories.map(cat => {
            this._photos.push({
                categoryId: cat.id,
                fileName: cat.name + "/" + uuidv4() + ".jpg"
            })
        })
    }

    getCategories = async () => {
        let data = []
        try {
            data = await new Promise((resolve, reject) => {
                setTimeout(() => {resolve(this._categories)}, 500)
            })
        } catch (e) {
            console.log(e)
        } finally {
            return data
        }
    }

    getPhotos = async (categoryId) => {
        const filtered = this._photos.filter(photo => photo.categoryId === id)
        if (length(filtered)) {
            return filtered[0]
        } else {
            return []
        }
    }

}