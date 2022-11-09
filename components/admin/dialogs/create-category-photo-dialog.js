import { useState, useEffect } from "react"

import {
    Dialog,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography
} from "@mui/material"

import UploadableCard from "../toolbar/uploadable-card"

export default function CreateCategoryPhotoDialog({
        isOpened,
        handleOK,
        handleClose,
        afterPhotoId
    }) {

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [originalUploadable, setOriginalUploadable] = useState(null)
    const [thumbnaillUploadable, setThumbnailUploadable] = useState(null)

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

    const upload = () => {
        handleOK(name, description, originalUploadable, thumbnaillUploadable)
    }

    return (
        <div>
            <Dialog
                open={isOpened}
                onClose={handleClose}
            >
                <DialogContent >
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
                        <Button onClick={upload}>Ok</Button>
                        <Button onClick={() => handleClose()}>Cancel</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    )

}

