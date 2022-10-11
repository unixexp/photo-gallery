import { useState } from "react"

import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import Button from "@material-ui/core/Button"

export default function AlertDialog({ title, contentText, isOpened, handleOK, handleClose }) {

    return (
        <div>
            <Dialog
                open={isOpened}
                onClose={handleClose}
            >
                <DialogTitle>
                    { title }
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        { contentText }
                    </DialogContentText>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <Button onClick={handleOK}>Ok</Button>
                        <Button onClick={handleClose}>Cancel</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )

}