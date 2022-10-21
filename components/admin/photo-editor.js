import { useEffect } from "react"
import { useSelector } from "react-redux"
import { selectCategoryId } from "./adminSlice"

export default function PhotoEditor({galleryAPIService}) {

    const categoryId = useSelector(selectCategoryId)

    useEffect(() => {
        // galleryAPIService.getPhotos(categoryId).then((data) => console.log(data))
    }, [categoryId])

    return (
        <div>
            
        </div>
    )

}