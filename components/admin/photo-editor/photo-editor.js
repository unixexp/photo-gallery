import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { selectCategory } from "../adminSlice"

import { ImageList } from "@mui/material"
import PhotoElement from "./photo-element/photo-element"
import CreateCategoryPhotoDialog from "../dialogs/create-category-photo-dialog"

import { RESULT_OK } from "~/lib/util"

export default function PhotoEditor({ galleryAPIService }) {

    const category = useSelector(selectCategory)
    const [photos, setPhotos] = useState([])
    const [order, setOrder] = useState(null)
    const [createPhotoDialogIsOpened, setCreatePhotoDialogIsOpened] = useState(false)

    useEffect(() => {
        if (category != null) {
            galleryAPIService.getCategoryPhotos(category).then(({response}) => {
                const photosWithUploadDummy = [{id: null, url: null, descriptioorder: null, order: 0}, ...response]
                setPhotos(photosWithUploadDummy)
            }).catch(() => {
                setPhotos([])
            })
        }
    }, [category])

    const handleOpenCreatePhotoDialog = (order) => {
        order++
        if (category != null) {
            setOrder(order)
            setCreatePhotoDialogIsOpened(true)
        }
    }

    const handleCreatePhotoDialogConfirm = async (params) => {
        const {
            name,
            description,
            originalUploadable,
            thumbnaillUploadable
        } = params

        if (originalUploadable != null && thumbnaillUploadable != null && name.length && description.length) {
            const response = await galleryAPIService.createCategoryPhoto({...params, category, order})
            if (response.result == RESULT_OK) {
                setCreatePhotoDialogIsOpened(false)
            } else {
                throw new Error(response.error)
            }
        } else {
            throw new Error("Not enough params to fill.")
        }
    }

    const handleCreatePhotoDialogClose = () => {
        setCreatePhotoDialogIsOpened(false)
    }

    const handleOpenEditPhotoDialog = (id) => {}
    
    const handleOpenDeletePhotoDialog = (id) => {}

    return (
        <>
            <ImageList cols={5} gap={8}>
                {photos.map((item) => (
                    <PhotoElement
                        galleryAPIService={galleryAPIService}
                        key={item.id}
                        image={item}
                        handleOpenCreatePhotoDialog={handleOpenCreatePhotoDialog}
                        handleOpenEditPhotoDialog={handleOpenEditPhotoDialog}
                        handleOpenDeletePhotoDialog={handleOpenDeletePhotoDialog}
                    />
                ))}
            </ImageList>
            <CreateCategoryPhotoDialog
                isOpened={createPhotoDialogIsOpened}
                handleOK={handleCreatePhotoDialogConfirm}
                handleClose={handleCreatePhotoDialogClose}
            />
        </>
      )

}