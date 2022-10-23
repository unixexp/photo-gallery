import { useEffect } from "react"
import { useSelector } from "react-redux"
import { selectCategory } from "./adminSlice"

export default function PhotoEditor({galleryAPIService}) {

    const category = useSelector(selectCategory)

    useEffect(() => {
        // galleryAPIService.getPhotos(categoryId).then((data) => console.log(data))
    }, [category])

    return (
        <div>
            
        </div>
    )

}