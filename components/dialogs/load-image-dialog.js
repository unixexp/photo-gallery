import { useState, useEffect } from "react"

import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Card from "@mui/material/Card"
import CardMedia from "@mui/material/CardMedia"
import Button from "@mui/material/Button"

export default function LoadImageDialog({isOpened, handleOK, handleClose, image}) {

    const [loadedImage, setLoadedImage] = useState(image)
    const [uploadable, setUploadable] = useState(null)

    useEffect(() => {
        setLoadedImage(image)
    }, [image])

    useEffect(() => {
        if (uploadable != null)
            setLoadedImage(URL.createObjectURL(uploadable))
    }, [uploadable])

    const callOkHandler = () => {
        handleOK(uploadable).then(() => setUploadable(null))
    }

    const callCloseHandler = () => {
        setUploadable(null)
        setLoadedImage(image)
        handleClose()
    }

    return (
        <div>
            <Dialog
                open={isOpened}
                onClose={handleClose}
            >
                <DialogContent>
                    <Card>
                        {renderCardMedia({loadedImage, setUploadable})}
                    </Card>
                    <DialogActions>
                        <Button onClick={callOkHandler}>Ok</Button>
                        <Button onClick={callCloseHandler}>Cancel</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    )

}

function renderCardMedia({loadedImage, setUploadable}) {

    const handleUploadToState = (event) => {
        if (event.target.files && event.target.files[0]) {
            const uploadable = event.target.files[0]
            setUploadable(uploadable)
        }
    }

    if (loadedImage != null) {
        return (
            <div>
                <label style={{cursor: "pointer"}}>
                    <CardMedia
                        component="img"
                        height="250"
                        image={loadedImage}
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