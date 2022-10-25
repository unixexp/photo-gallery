import { useState, useEffect } from "react"

import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Card from "@mui/material/Card"
import CardMedia from "@mui/material/CardMedia"
import Button from "@mui/material/Button"

export default function LoadImageDialog({isOpened, handleOK, handleClose, image}) {

    const [loadedImage, setLoadedImage] = useState(image)

    useEffect(() => {
        setLoadedImage(image)
    }, [image])

    const callOkHandler = () => {
        handleOK()
    }

    return (
        <div>
            <Dialog
                open={isOpened}
                onClose={handleClose}
            >
                <DialogContent>
                    <Card>
                        {renderCardMedia({loadedImage, setLoadedImage})}
                    </Card>
                    <DialogActions>
                        <Button onClick={callOkHandler}>Ok</Button>
                        <Button onClick={handleClose}>Cancel</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    )

}

function renderCardMedia({loadedImage, setLoadedImage}) {

    if (loadedImage != null) {
        return (
            <CardMedia
                component="img"
                height="250"
                image={loadedImage}
            />
        )
    } else {
        return (
            <div>
                Click to load image
            </div>
        )
    }

}