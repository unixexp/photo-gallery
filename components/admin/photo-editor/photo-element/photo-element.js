import { useState } from "react"
import { ImageListItem, Box, IconButton, Avatar } from "@mui/material"
import MoreIcon from "@mui/icons-material/MoreVert"

export default function PhotoElement({ galleryAPIService, image }) {

    const [isHovering, setIsHovering] = useState(false)

    const handleMouseEnter = () => {
        setIsHovering(true)
    }

    const handleMouseLeave = () => {
        setIsHovering(false)
    }

    const handleMenuOpen = () => {
        alert("Menu")
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
                <Avatar sx={{bgcolor: "warning.light"}}>{image.n}</Avatar>
                <IconButton color="warning" onClick={handleMenuOpen}>
                    <MoreIcon />
                </IconButton>
            </Box>
            <img
                src={image.url}
                srcSet={image.url}
                loading="lazy"
            />
        </ImageListItem>
      )

}