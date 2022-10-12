import { makeStyles } from "@material-ui/core/styles"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import Select from "@material-ui/core/Select"
import FormControl from "@material-ui/core/FormControl"
import MenuItem from "@material-ui/core/MenuItem"
import IconButton from "@material-ui/core/IconButton"
import MoreIcon from "@material-ui/icons/MoreVert"
import AppBar from "@material-ui/core/AppBar"
import Menu from "@material-ui/core/Menu"
import AlertDialog from "../dialogs/alert-dialog"
import InputDialog from "../dialogs/input-dialog"

import { getGalleryAPIService } from "../../services/gallery-api-service-factory"
import { selectCategoryId, setCategoryId } from "./adminSlice"

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

export default function Toolbar() {

    const galleryAPIService = getGalleryAPIService()

    const categoryId = useSelector(selectCategoryId)
    const dispatch = useDispatch()

    const classes = useStyles()
    const [menuParent, setMenuParent] = useState(null)
    const [removeCategoryAlertDialogIsOpened, setRemoveCategoryAlertDialogIsOpened] = useState(false)
    const [addCategoryDialogIsOpened, setAddCategoryDialogIsOpened] = useState(false)
    const [categories, setCategories] = useState([])

    const handleMenuOpen = (event) => {
        setMenuParent(event.currentTarget)
    }

    const handleMenuClose = () => {
        setMenuParent(null)
    }

    const handleCategoryChange = (event) => {
        const _index = categories.findIndex(cat => cat.id === event.target.value)
        if (_index != -1)
            dispatch(setCategoryId(event.target.value))

    }

    const handleOpenRemoveCategoryDialog = () => {
        handleMenuClose()
        setRemoveCategoryAlertDialogIsOpened(true)
    }

    const handleRemoveCategoryConfirm = () => {
        // Prevent errors with remove undefined category
        const _index = categories.findIndex(cat => cat.id === categoryId)
        if (_index != -1)
            galleryAPIService.removeCategory(categoryId).then(() => {
                const newCategories = categories.filter(cat => cat.id !== categoryId)
                // Prevent errors select removed category
                if (newCategories.length) {
                    dispatch(setCategoryId(newCategories[0].id))
                } else {
                    dispatch(setCategoryId(''))
                }
                update({})
                setRemoveCategoryAlertDialogIsOpened(false)
            })
    }

    const handleRemoveCategoryCancel = () => {
        setRemoveCategoryAlertDialogIsOpened(false)
    }

    const handleOpenAddCategoryDialog = () => {
        handleMenuClose()
        setAddCategoryDialogIsOpened(true)
    }

    const handleAddCategoryConfirm = (categoryName) => {
        if (categoryName && /\S+/.test(categoryName)) {
            galleryAPIService.addCategory(categoryName).then((cat) => {
                update({selectCategoryId: cat.id})
                setAddCategoryDialogIsOpened(false)
            })
        } else {
            alert("Category name must contain alphabet symbols or(and) numbers")
        }
    }

    const handleAddCategoryCancel = () => {
        setAddCategoryDialogIsOpened(false)
    }

    useEffect(() => {
        update({})
    }, [])

    const update = ({selectCategoryId}) => {
        galleryAPIService.getCategories().then((data) => {
            setCategories(data)
            if (selectCategoryId)
                dispatch(setCategoryId(selectCategoryId))
        })
    }

    return (
        <div>
            <AppBar position="relative">
                <FormControl variant="outlined" size="small" className={classes.formControl}>
                    <div className={classes.categoryBlock}>
                        <Select value={categoryId}
                                className={classes.categorySelector}
                                onClick={handleCategoryChange}>
                            { renderCategories(categories) }
                        </Select>
                        <IconButton onClick={handleMenuOpen}>
                            <MoreIcon />
                        </IconButton>
                    </div>
                </FormControl>
            </AppBar>
            <AlertDialog
                title="Alert!"
                contentText="Delete this category with photos?"
                isOpened={removeCategoryAlertDialogIsOpened}
                handleOK={handleRemoveCategoryConfirm}
                handleClose={handleRemoveCategoryCancel}
            />
            <InputDialog
                title="Add new category"
                label="Category name"
                isOpened={addCategoryDialogIsOpened}
                handleOK={handleAddCategoryConfirm}
                handleClose={handleAddCategoryCancel}
            />
            {
                renderMenu({
                    menuParent,
                    handleMenuClose,
                    handleOpenRemoveCategoryDialog,
                    handleOpenAddCategoryDialog
                })
            }
        </div>
    )

}

function renderCategories(categories) {

    return categories.map(category => {
        return (
            <MenuItem key={category.id}
                    value={category.id}>
                {category.name}
            </MenuItem>
        )
    })

}

function renderMenu(props) {

    const {
        menuParent,
        handleMenuClose,
        handleOpenRemoveCategoryDialog,
        handleOpenAddCategoryDialog
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
                key="remove"
                onClick={handleOpenRemoveCategoryDialog}
            >Remove</MenuItem>
        </Menu>
    )

}