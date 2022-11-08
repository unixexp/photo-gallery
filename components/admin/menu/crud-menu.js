import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"

export default function CRUDMenu(props) {

    const {
        menuParent,
        handleMenuClose,
        handleOpenRemoveCategoryDialog,
        handleOpenAddCategoryDialog,
        handleOpenEditCategoryNameDialog
    } = props
    const isMenuOpen = Boolean(menuParent)

    return (
        <Menu
            anchorEl={menuParent}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem
                key="add"
                onClick={handleOpenAddCategoryDialog}
            >Add</MenuItem>
            <MenuItem
                key="change-name"
                onClick={handleOpenEditCategoryNameDialog}    
            >Edit</MenuItem>
            <MenuItem
                key="remove"
                onClick={handleOpenRemoveCategoryDialog}
            >Remove</MenuItem>
        </Menu>
    )

}