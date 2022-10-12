import { useState } from "react"

import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogActions from "@material-ui/core/DialogActions"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"

export default function InputDialog({
        title,
        contentText,
        label,
        isOpened,
        handleOK,
        handleClose
    }) {

    const [value, setValue] = useState('')

    const handleOnChangeValue = (e) => {
        setValue(e.target.value)
    }

    const callOkHandler = () => {
        handleOK(value)
        setValue('')
    }

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
                    { contentText && <DialogContentText>{ contentText }</DialogContentText>}
                    <TextField
                        autoFocus
                        margin="dense"
                        id={label}
                        label={label}
                        type="text"
                        fullWidth
                        variant="standard"
                        value={value}
                        onChange={handleOnChangeValue}
                    />
                    <DialogActions>
                        <Button onClick={callOkHandler}>Ok</Button>
                        <Button onClick={handleClose}>Cancel</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    )

}