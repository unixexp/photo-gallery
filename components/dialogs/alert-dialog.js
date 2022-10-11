import { useState } from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"

export default function AlertDialog({ title, contentText, isOpened, handleOK, handleCancel }) {

    const [open, setOpen] = useState(isOpened)
    console.log(open)

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    { title }
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        { contentText }
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    )

}