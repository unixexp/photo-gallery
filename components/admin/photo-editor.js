import { getGalleryAPIService } from "../../services/gallery-api-service-factory"

import { useEffect } from "react"
import { useSelector } from "react-redux"
import { selectCategoryId } from "./adminSlice"

export default function PhotoEditor() {

    const galleryAPIService = getGalleryAPIService()
    const categoryId = useSelector(selectCategoryId)

    useEffect(() => {
        galleryAPIService.getPhotos(categoryId).then((data) => console.log(data))
    }, [categoryId])

    return (
        <div>
            
        </div>
    )

}