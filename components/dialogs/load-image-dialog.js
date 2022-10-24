import { useState } from "react"

import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Button from "@mui/material/Button"

export default function LoadImageDialog({isOpened, handleOK, handleClose}) {

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
                    <DialogActions>
                        <Button onClick={callOkHandler}>Ok</Button>
                        <Button onClick={handleClose}>Cancel</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    )

}