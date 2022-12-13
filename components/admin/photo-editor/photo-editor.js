import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { selectCategory } from "../adminSlice"

import { ImageList } from "@mui/material"
import PhotoElement from "./photo-element/photo-element"
import CreateCategoryPhotoDialog from "../dialogs/create-category-photo-dialog"
import EditCategoryPhotoDialog from "../dialogs/edit-category-photo-dialog"
import AlertDialog from "../dialogs/alert-dialog"

import { RESULT_OK } from "~/lib/util"

export default function PhotoEditor({ galleryAPIService }) {

    const category = useSelector(selectCategory)
    const [photos, setPhotos] = useState([])
    const [order, setOrder] = useState(null)
    const [createPhotoDialogIsOpened, setCreatePhotoDialogIsOpened] = useState(false)
    const [editPhotoDialogIsOpened, setEditPhotoDialogIsOpened] = useState(false)
    const [removePhotoAlertDialogIsOpened, setRemovePhotoAlertDialogIsOpened] = useState(false)
    const [photoToDelete, setPhotoToDelete] = useState(null)
    const [photoToEdit, setPhotoToEdit] = useState(null)

    useEffect(() => {
        if (category != null)
            update()
    }, [category])

    const update = () => {
        galleryAPIService.getCategoryPhotos(category).then(({response}) => {
            const photosWithUploadDummy = [{id: null, url: null, descriptioorder: null, order: 0}, ...response]
            setPhotos(photosWithUploadDummy)
        }).catch(() => {
            setPhotos([])
        })
    }

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
                update()
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

    const handleOpenEditPhotoDialog = (id) => {
        if (id != null && category != null) {
            setPhotoToEdit(id)
            setEditPhotoDialogIsOpened(true)
        }
    }

    const handleEditPhotoDialogClose = () => {
        setEditPhotoDialogIsOpened(false)
    }
    
    const handleEditPhotoDialogConfirm = async (params) => {
        const {
            name,
            description,
            order,
            originalUploadable,
            thumbnaillUploadable,
            originalUploadableChanged,
            thumbnaillUploadableChanged
        } = params

        if (originalUploadable != null && thumbnaillUploadable != null
                && name.length && description.length && order) {
            const response = await galleryAPIService.updateCategoryPhoto({...params, category})
            if (response.result == RESULT_OK) {
                setEditPhotoDialogIsOpened(false)
                update()
            } else {
                throw new Error(response.error)
            }
        } else {
            throw new Error("Not enough params to fill.")
        }
    }

    const handleOpenDeletePhotoDialog = async (id) => {
        setPhotoToDelete(id)
        setRemovePhotoAlertDialogIsOpened(true)
    }

    const handleDeletePhotoConfirm = async () => {
        const response = await galleryAPIService.deleteCategoryPhoto(category.id, photoToDelete)
        if (response.result == RESULT_OK) {
            setRemovePhotoAlertDialogIsOpened(false)
            update()
        } else {
            throw new Error(response.error)
        }
        setPhotoToDelete(null)
    }

    const handleDeletePhotoCancel = () => {
        setRemovePhotoAlertDialogIsOpened(false)
    }

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
            {
                createPhotoDialogIsOpened
                    ? <CreateCategoryPhotoDialog
                        isOpened={createPhotoDialogIsOpened}
                        handleOK={handleCreatePhotoDialogConfirm}
                        handleClose={handleCreatePhotoDialogClose}
                    />
                    : <></>
            }
            {
                editPhotoDialogIsOpened
                    ? <EditCategoryPhotoDialog
                        galleryAPIService={galleryAPIService}
                        category={category}
                        photoToEdit={photoToEdit}
                        isOpened={editPhotoDialogIsOpened}
                        handleOK={handleEditPhotoDialogConfirm}
                        handleClose={handleEditPhotoDialogClose}
                    />
                    : <></>
            }
            <AlertDialog
                title="Alert!"
                contentText="Delete this photo?"
                isOpened={removePhotoAlertDialogIsOpened}
                handleOK={handleDeletePhotoConfirm}
                handleClose={handleDeletePhotoCancel}
            />
        </>
      )

}