import { useState } from "react"
import { ImageListItem, Box, IconButton, Avatar } from "@mui/material"
import MoreIcon from "@mui/icons-material/MoreVert"
import CRUDMenu from "../../menu/crud-menu"

export default function PhotoElement({
        image,
        handleOpenCreatePhotoDialog,
        handleOpenEditPhotoDialog,
        handleOpenDeletePhotoDialog
    }) {

    const [isHovering, setIsHovering] = useState(false)
    const [menuParent, setMenuParent] = useState(null)

    const handleMouseEnter = () => {
        setIsHovering(true)
    }

    const handleMouseLeave = () => {
        setIsHovering(false)
    }

    const handleMenuOpen = (event) => {
        setMenuParent(event.currentTarget)
    }

    const handleMenuClose = () => {
        setMenuParent(null)
    }

    return (
        <ImageListItem
            sx={{
                border: "2px solid",
                borderColor: isHovering ? "info.main" : "#fff",
                position: "relative",
                cursor: "pointer"
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Box
                sx={{
                    display: "flex",
                    position: "absolute",
                    width: "100%",
                    justifyContent: "space-between",
                    backgroundColor: "white",
                    opacity: 0.8
                }}>
                <Avatar sx={{bgcolor: "warning.light"}}>{image.order}</Avatar>
                <Box>
                    <IconButton color="warning" onClick={handleMenuOpen}>
                        <MoreIcon />
                    </IconButton>
                </Box>
            </Box>
            <img
                src={image.url}
                srcSet={image.url}
                loading="lazy"
            />
            <CRUDMenu
                menuParent={menuParent}
                handleMenuClose={handleMenuClose}
                handleOpenCreatePhotoDialog={handleOpenCreatePhotoDialog}
                handleOpenEditPhotoDialog={handleOpenEditPhotoDialog}
                handleOpenDeletePhotoDialog={handleOpenDeletePhotoDialog}
            />
        </ImageListItem>
      )

}