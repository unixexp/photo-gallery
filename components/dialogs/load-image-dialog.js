import { useState, useEffect } from "react"

import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Card from "@mui/material/Card"
import CardMedia from "@mui/material/CardMedia"
import Button from "@mui/material/Button"

export default function LoadImageDialog({isOpened, handleOK, handleClose, image}) {

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
                    <Card>
                        {renderUploadableCardMedia({currentImage, setUploadableHandler})}
                    </Card>
                    <DialogActions>
                        <Button onClick={upload}>Ok</Button>
                        <Button onClick={() => handleClose()}>Cancel</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    )

}

function renderUploadableCardMedia({currentImage, setUploadableHandler}) {

    const handleUploadToState = (event) => {
        if (event.target.files && event.target.files[0]) {
            const uploadable = event.target.files[0]
            setUploadableHandler(uploadable)
        }
    }

    if (currentImage != null) {
        return (
            <div>
                <label style={{cursor: "pointer"}}>
                    <CardMedia
                        component="img"
                        height="250"
                        image={currentImage}
                    />
                    <input style={{display: "none"}} type="file" onChange={handleUploadToState} />
                </label>
            </div>
        )
    } else {
        return (
            <div>
                <label style={{cursor: "pointer"}}>
                    <div style={{padding: "8px", textAlign: "center"}}>Load image</div>
                    <input style={{display: "none"}} type="file" onChange={handleUploadToState} />
                </label>
            </div>
        )
    }

}