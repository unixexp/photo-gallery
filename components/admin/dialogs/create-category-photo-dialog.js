import { useState, useEffect } from "react"

import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Button from "@mui/material/Button"

import UploadableCard from "../toolbar/uploadable-card"

export default function CreateCategoryPhotoDialog({
        isOpened,
        handleOK,
        handleClose,
        afterPhotoId
    }) {

    const [uploadable, setUploadable] = useState(null)

    const getUploadableURL = () => {
        if (uploadable != null)
            return URL.createObjectURL(uploadable)
        else
            null
    }

    const setUploadableHandler = (uploadableObject) => {
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
                        currentImage={getUploadableURL()}
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

