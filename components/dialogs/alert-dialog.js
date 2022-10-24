import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogActions from "@mui/material/DialogActions"
import Button from "@mui/material/Button"

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
                    <DialogActions>
                        <Button onClick={handleOK}>Ok</Button>
                        <Button onClick={handleClose}>Cancel</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    )

}