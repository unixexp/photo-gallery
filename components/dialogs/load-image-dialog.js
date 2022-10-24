import { useState } from "react"

import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"

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