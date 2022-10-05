import React from "react"

import { makeStyles } from "@material-ui/core/styles"

import Select from "@material-ui/core/Select"
import FormControl from "@material-ui/core/FormControl"
import MenuItem from "@material-ui/core/MenuItem"
import IconButton from "@material-ui/core/IconButton"
import MoreIcon from "@material-ui/icons/MoreVert"
import AppBar from "@material-ui/core/AppBar"
import Menu from "@material-ui/core/Menu"

const useStyles = makeStyles((theme) => ({
    formControl: {
        padding: "10px"
    },
    categoryBlock: {
        display: "flex",
        alignItems: "center"
    },
    categorySelector: {
        display: "flex",
        alignItems: "baseline",
        width: "100%",
        color: theme.palette.primary.contrastText
    },
    selector: {
        width: "100%",
        margin: "0 10px",
        color: theme.palette.primary.light
    }
}))

export default function AdminToolbar() {

    const classes = useStyles();

    const [menuParent, setMenuParent] = React.useState(null);

    const handleMenuOpen = (event) => {
        setMenuParent(event.currentTarget)
    }

    const handleMenuClose = () => {
        setMenuParent(null)
    }

    return (
        <div>
            <AppBar position="relative">
                <FormControl variant="outlined" size="small" className={classes.formControl}>
                    <div className={classes.categoryBlock}>
                        <div className={classes.categorySelector}>
                            <div>Category</div>
                            <Select className={classes.selector}>
                                <MenuItem value={10}>Вечерний Киев 1972 года</MenuItem>
                                <MenuItem value={20}>Category #2</MenuItem>
                                <MenuItem value={30}>Category #3</MenuItem>
                            </Select>
                        </div>
                        <IconButton onClick={handleMenuOpen}>
                            <MoreIcon />
                        </IconButton>
                    </div>
                </FormControl>
            </AppBar>
            { renderMenu({menuParent, handleMenuClose}) }
        </div>
    )

}

function renderMenu({menuParent, handleMenuClose}) {

    const isMenuOpen = Boolean(menuParent)

    return (
        <Menu
            anchorEl={menuParent}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem>Add</MenuItem>
            <MenuItem>Remove</MenuItem>
        </Menu>
    )

}