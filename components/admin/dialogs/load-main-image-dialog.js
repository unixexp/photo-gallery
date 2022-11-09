import { useState, useEffect } from "react"

import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Button from "@mui/material/Button"

import UploadableCard from "../toolbar/uploadable-card"

export default function LoadMainImageDialog({isOpened, handleOK, handleClose, image}) {

    const [uploadable, setUploadable] = useState(null)
    const [currentImage, setCurrentImage] = useState(image)

    const setUploadableHandler = (uploadableObject) => {
        uploadable = uploadableObject
        setCurrentImage(URL.createObjectURL(uploadable))
        setUploadable(uploadableObject)
    }

    const upload = () => {
        handleOK(uploadable)
    }

    return (
        <div>
            <Dialog
                open={isOpened}
                onClose={handleClose}
            >
                <DialogContent>
                    <UploadableCard
                        caption="Upload image"
                        currentImage={currentImage}
                        setUploadableHandler={setUploadableHandler}
                        size="400"/>
                    <DialogActions>
                        <Button onClick={upload}>Ok</Button>
                        <Button onClick={() => handleClose()}>Cancel</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    )

}

