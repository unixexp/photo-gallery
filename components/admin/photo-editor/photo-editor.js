import { useState } from "react"
import { useSelector } from "react-redux"
import { selectCategory } from "../adminSlice"

import { ImageList } from "@mui/material"
import PhotoElement from "./photo-element/photo-element"
import CreateCategoryPhotoDialog from "../dialogs/create-category-photo-dialog"

export default function PhotoEditor({ galleryAPIService }) {

    const category = useSelector(selectCategory)
    const itemData = loadPhotos()
    const [afterPhotoId, setAfterPhotoId] = useState(null)
    const [createPhotoDialogIsOpened, setCreatePhotoDialogIsOpened] = useState(false)

    const handleOpenCreatePhotoDialog = (afterPhotoId) => {
        if (category != null) {
            setAfterPhotoId(afterPhotoId)
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

        if (originalUploadable != null && thumbnaillUploadable != null
                && name.length && description.length) {
            setCreatePhotoDialogIsOpened(false)
            return await galleryAPIService.createCategoryPhoto({...params, category, afterPhotoId})
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
                {itemData.map((item) => (
                    <PhotoElement
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

const loadPhotos = () => {

    const photos = [
        {
            id: 1,
            url: 'https://images.unsplash.com/photo-1549388604-817d15aa0110',
            descriptioorder: 'swabdesign',
            order: 1
        },
        {
            id: 2,
            url: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
            descriptioorder: 'Pavel Nekoranec',
            order: 2
        },
        {
            id: 3,
            url: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6',
            descriptioorder: 'Charles Deluvio',
            order: 3
        },
        {
            id: 4,
            url: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3',
            descriptioorder: 'Christian Mackie',
            order: 4
        },
        {
            id: 5,
            url: 'https://images.unsplash.com/photo-1588436706487-9d55d73a39e3',
            descriptioorder: 'Darren Richardson',
            order: 5
        },
        {
            id: 6,
            url: 'https://images.unsplash.com/photo-1574180045827-681f8a1a9622',
            descriptioorder: 'Taylor Simpson',
            order: 6
        },
        {
            id: 7,
            url: 'https://images.unsplash.com/photo-1530731141654-5993c3016c77',
            descriptioorder: 'Ben Kolde',
            order: 7
        },
        {
            id: 8,
            url: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61',
            descriptioorder: 'Philipp Berndt',
            order: 8
        },
        {
            id: 9,
            url: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7',
            descriptioorder: 'Jen P.',
            order: 9
        },
        {
            id: 10,
            url: 'https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee',
            descriptioorder: 'Douglas Sheppard',
            order: 10
        },
        {
            id: 11,
            url: 'https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62',
            descriptioorder: 'Fi Bell',
            order: 11
        },
        {
            id: 12,
            url: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
            descriptioorder: 'Hutomo Abrianto',
            order: 12
        },
      ]

      return [{id: null, url: null, descriptioorder: null, order: 0}, ...photos]

}