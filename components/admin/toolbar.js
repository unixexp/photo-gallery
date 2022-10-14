import { makeStyles } from "@material-ui/core/styles"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import Select from "@material-ui/core/Select"
import FormControl from "@material-ui/core/FormControl"
import MenuItem from "@material-ui/core/MenuItem"
import IconButton from "@material-ui/core/IconButton"
import MoreIcon from "@material-ui/icons/MoreVert"
import CheckIcon from "@material-ui/icons/CheckOutlined"
import AppBar from "@material-ui/core/AppBar"
import Menu from "@material-ui/core/Menu"
import AlertDialog from "../dialogs/alert-dialog"
import InputDialog from "../dialogs/input-dialog"
import TextField from "@material-ui/core/TextField"

import { getGalleryAPIService } from "../../services/gallery-api-service-factory"
import { selectCategoryId, setCategoryId } from "./adminSlice"

const useStyles = makeStyles((theme) => ({

    formControl: {
        padding: "5px 10px 10px 10px"
    },

    categoryBlock: {
        display: "flex",
        alignItems: "center"
    },

    categorySelector: {
        width: "100%",
        color: theme.palette.primary.contrastText
    },

    descriptionFieldInput: {
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
    const [newCategoryId, setNewCategoryId] = useState(null)
    const [categories, setCategories] = useState([])
    const [category, setCategory] = useState(null)

    const handleCategoryChange = (id) => {
        if (id) {
            const _index = categories.findIndex(cat => cat.id === id)
            if (_index != -1) {
                dispatch(setCategoryId(id))
            }
        } else {
            if (id != 0) {
                dispatch(setCategoryId(""))
            }
        }
    }

    const handleMenuOpen = (event) => {
        setMenuParent(event.currentTarget)
    }

    const handleMenuClose = () => {
        setMenuParent(null)
    }

    const handleOpenRemoveCategoryDialog = () => {
        handleMenuClose()
        if (categoryId)
            setRemoveCategoryAlertDialogIsOpened(true)
    }

    const handleRemoveCategoryConfirm = () => {
        // Prevent errors with remove undefined category
        const _index = categories.findIndex(cat => cat.id === categoryId)
        if (_index != -1)
            galleryAPIService.removeCategory(categoryId).then(() => {
                setRemoveCategoryAlertDialogIsOpened(false)
                handleCategoryChange()
                update()
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
                setAddCategoryDialogIsOpened(false)
                setNewCategoryId(cat.id)
                update()
            })
        } else {
            alert("Category name must contain alphabet symbols or(and) numbers")
        }
    }

    const handleAddCategoryCancel = () => {
        setAddCategoryDialogIsOpened(false)
    }

    const handleCategoryDescriptionChange = (event) => {
        setCategory((cat) => {
            return {...cat, description: event.target.value}
        })
    }

    const handleCategoryUpdate = () => {
        galleryAPIService.updateCategory(category)
    }

    useEffect(() => {
        update()
    }, [])

    useEffect(() => {
        handleCategoryChange(newCategoryId)
    }, [categories])

    useEffect(() => {
        const _index = categories.findIndex(cat => cat.id === categoryId)
        if (_index != -1) {
            setCategory(categories[_index])
        } else {
            setCategory(null)
        }
    }, [categoryId])

    const update = () => {
        galleryAPIService.getCategories().then((data) => {
            setCategories(data)
        })
    }

    return (
        <div>
            <AppBar position="relative">
                <FormControl variant="outlined" size="small" className={classes.formControl}>
                    <div className={classes.categoryBlock}>
                        <Select value={categoryId}
                                className={classes.categorySelector}
                                onClick={e => handleCategoryChange(e.target.value)}>
                            { renderCategories(categories) }
                        </Select>
                        <IconButton onClick={handleMenuOpen}>
                            <MoreIcon />
                        </IconButton>
                    </div>
                    <div className={classes.categoryBlock}>
                        <TextField
                            InputProps={{
                                className: classes.descriptionFieldInput
                            }}
                            minRows={4}
                            maxRows={4}
                            variant="outlined"
                            multiline
                            value={category ? category.description : ""}
                            fullWidth
                            onChange={handleCategoryDescriptionChange}
                        />
                        <IconButton onClick={handleCategoryUpdate}>
                            <CheckIcon />
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