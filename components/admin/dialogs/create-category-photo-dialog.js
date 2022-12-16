import { useState, useEffect } from "react"

import {
    Dialog,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    Box,
    ImageList
} from "@mui/material"

import PhotoElement from "../photo-editor/photo-element/photo-element"
import UploadableCard from "../toolbar/uploadable-card"

export default function CreateCategoryPhotoDialog({
        galleryAPIService,
        isOpened,
        handleOK,
        handleClose
    }) {

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [originalUploadable, setOriginalUploadable] = useState(null)
    const [thumbnaillUploadable, setThumbnailUploadable] = useState(null)
    const [photos, setPhotos] = useState([])

    useEffect(() => {
        load()
    }, [])

    const load = async () => {
        galleryAPIService.getPhotos().then(({response}) => {
            setPhotos(response)
        }).catch(() => {
            alert("Error load photos.")
            onClose()
        })
    }

    const getUploadableURL = (uploadable) => {
        if (uploadable != null)
            return URL.createObjectURL(uploadable)
        else
            null
    }

    const setOriginalUploadableHandler = (uploadableObject) => {
        setOriginalUploadable(uploadableObject)
    }

    const setThumbnailUploadableHandler = (uploadableObject) => {
        setThumbnailUploadable(uploadableObject)
    }

    const handleOnChangeName = (e) => {
        setName(e.target.value)
    }

    const handleOnChangeDescription = (e) => {
        setDescription(e.target.value)
    }

    const handleSetPhoto = (photo) => {
        console.log(photo)
    }

    const onOk = async () => {
        if (!name.length && !description.length
                && originalUploadable == null && thumbnaillUploadable == null) {
            onClose()
        } else {
            try {
                await handleOK({name, description, originalUploadable, thumbnaillUploadable})
                clean()
            } catch(e) {
                alert(e)
            }
        }
    }

    const onClose = () => {
        handleClose()
        clean()
    }

    const clean = () => {
        setName("")
        setDescription("")
        setOriginalUploadable(null)
        setThumbnailUploadable(null)
    }

    return (
        <div>
            <Dialog
                open={isOpened}
                onClose={handleClose}
                fullWidth={true}
                maxWidth={"lg"}
            >
                <DialogContent sx={{display: "flex", justifyContent: "space-between"}}>
                    <Box sx={{width: "100%"}}>
                        <Typography>Original</Typography>
                        <UploadableCard
                            caption="Upload original image"
                            currentImage={getUploadableURL(originalUploadable)}
                            setUploadableHandler={setOriginalUploadableHandler}
                            size="150"/>
                        <Typography>Thumbnail</Typography>
                        <UploadableCard
                            caption="Upload thumbnail"
                            currentImage={getUploadableURL(thumbnaillUploadable)}
                            setUploadableHandler={setThumbnailUploadableHandler}
                            size="150"/>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={name}
                            onChange={handleOnChangeName}
                        />
                        <TextField
                            minRows={4}
                            maxRows={4}
                            variant="outlined"
                            multiline
                            label="Description"
                            value={description}
                            fullWidth
                            onChange={handleOnChangeDescription}
                        />
                        <DialogActions>
                            <Button onClick={onOk}>Ok</Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </DialogActions>
                    </Box>
                    <Box
                        sx={{
                            maxWidth: "600px",
                            height: "400px",
                            overflowY: "scroll",
                            paddingLeft: "8px",
                            paddingRight: "8px"
                        }}>
                        <ImageList cols={3}>
                            {photos.map((item) => (
                                <div onClick={() => handleSetPhoto(item)}>
                                    <PhotoElement
                                        galleryAPIService={galleryAPIService}
                                        key={`${item.id}_${item.updatedAt}`}
                                        image={item}
                                        toolbar={false}
                                    />
                                </div>
                            ))}
                        </ImageList>
                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    )

}

