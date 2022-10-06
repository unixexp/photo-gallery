import React from "react"

import { makeStyles } from "@material-ui/core/styles"

import { useState, useEffect } from "react"

import Select from "@material-ui/core/Select"
import FormControl from "@material-ui/core/FormControl"
import MenuItem from "@material-ui/core/MenuItem"
import IconButton from "@material-ui/core/IconButton"
import MoreIcon from "@material-ui/icons/MoreVert"
import AppBar from "@material-ui/core/AppBar"
import Menu from "@material-ui/core/Menu"

import { getGalleryAPIService } from "../../services/gallery-api-service-factory"

const useStyles = makeStyles((theme) => ({
    formControl: {
        padding: "10px"
    },
    categoryBlock: {
        display: "flex",
        alignItems: "center"
    },
    categorySelector: {
        width: "100%",
        margin: "0 10px",
        color: theme.palette.primary.contrastText
    }
}))

export default function AdminFeatures() {

    const galleryAPIService = getGalleryAPIService()

    const classes = useStyles()
    const [menuParent, setMenuParent] = useState(null)
    const [categories, setCategories] = useState([])

    const handleMenuOpen = (event) => {
        setMenuParent(event.currentTarget)
    }

    const handleMenuClose = () => {
        setMenuParent(null)
    }

    useEffect(() => {
        galleryAPIService.getCategories().then((data) => {
            setCategories(data)
        })
    }, [])

    return (
        <div>
            <AppBar position="relative">
                <FormControl variant="outlined" size="small" className={classes.formControl}>
                    <div className={classes.categoryBlock}>
                        <Select className={classes.categorySelector}>
                            { renderCategories(categories) }
                        </Select>
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

function renderCategories(categories) {

    return categories.map(category => {
        return (
            <MenuItem value={category.id}>
                {category.name}
            </MenuItem>
        )
    })

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