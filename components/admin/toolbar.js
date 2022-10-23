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

import { selectCategory, setCategory } from "./adminSlice"

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

export default function Toolbar({ galleryAPIService, categoriesSSR }) {

    const category = useSelector(selectCategory)
    const dispatch = useDispatch()

    const classes = useStyles()
    const [menuParent, setMenuParent] = useState(null)
    const [removeCategoryAlertDialogIsOpened, setRemoveCategoryAlertDialogIsOpened] = useState(false)
    const [addCategoryDialogIsOpened, setAddCategoryDialogIsOpened] = useState(false)
    const [editCategoryNameDialogIsOpened, setEditCategoryNameDialogIsOpened] = useState(false)
    const [updatedCategoryId, setUpdatedCategoryId] = useState(null)
    const [categories, setCategories] = useState(categoriesSSR)

    const handleCategoryChange = (id) => {
        if (id) {
            const _index = categories.findIndex(cat => cat.id === id)
            if (_index != -1) {
                dispatch(setCategory(categories[_index]))
            }
        } else {
            if (id != 0) {
                dispatch(setCategory(null))
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
        if (category != null)
            setRemoveCategoryAlertDialogIsOpened(true)
    }

    const handleRemoveCategoryConfirm = () => {
        // Prevent errors with remove undefined category
        if (category != null) {
            galleryAPIService.removeCategory(category.id).then(() => {
                setRemoveCategoryAlertDialogIsOpened(false)
                handleCategoryChange()
                update()
            })
        }
    }

    const handleRemoveCategoryCancel = () => {
        setRemoveCategoryAlertDialogIsOpened(false)
    }

    const handleOpenAddCategoryDialog = () => {
        handleMenuClose()
        setAddCategoryDialogIsOpened(true)
    }

    const handleAddCategoryCancel = () => {
        setAddCategoryDialogIsOpened(false)
    }

    const handleAddCategoryConfirm = (categoryName) => {
        if (categoryName && /\S+/.test(categoryName)) {
            galleryAPIService.addCategory(categoryName).then((data) => {
                if (data.result === "ok") {
                    setAddCategoryDialogIsOpened(false)
                    setUpdatedCategoryId(data.response.id)
                    update()
                } else {
                    setAddCategoryDialogIsOpened(false)
                    alert(data.error)
                }
            })
        } else {
            alert("Category name must contain alphabet symbols or(and) numbers")
        }
    }

    const handleOpenEditCategoryNameDialog = () => {
        handleMenuClose()
        if (category)
            setEditCategoryNameDialogIsOpened(true)
    }

    const handleEditCategoryNameCancel = () => {
        setEditCategoryNameDialogIsOpened(false)
    }

    const handleEditCategoryNameConfirm = (categoryName) => {
        if (categoryName && /\S+/.test(categoryName)) {
            if (category != null) {
                setEditCategoryNameDialogIsOpened(false)
                const modified = { ...category, name: categoryName }
                handleCategoryUpdate(modified)
            }
        } else {
            alert("Category name must contain alphabet symbols or(and) numbers")
        }
    }

    const handleCategoryDescriptionChange = (event) => {
        if (category != null)
            dispatch(setCategory({...category, description: event.target.value}))
    }

    const handleCategoryUpdate = (modified) => {
        galleryAPIService.updateCategory(modified).then((data) => {
            if (data.result === "ok") {
                const updated = data.response
                const _index = categories.findIndex(cat => cat.id === updated.id)
                if (_index != -1)
                    setUpdatedCategoryId(updated.id)
                    setCategories((prevCategories) => {
                        const newCategories = [...prevCategories]
                        newCategories[_index] = updated
                        return newCategories
                    })
            } else {
                alert(data.error)
            }
        })
    }

    useEffect(() => {
        handleCategoryChange(updatedCategoryId)
    }, [categories])

    const update = () => {
        galleryAPIService.getCategories().then((data) => {
            if (data.result === "ok") {
                setCategories(data.response)
            } else {
                alert(data.error)
            }
        })
    }

    return (
        <div>
            <AppBar position="relative">
                <FormControl variant="outlined" size="small" className={classes.formControl}>
                    <div className={classes.categoryBlock}>
                        <Select value={
                                    category != null
                                        ? category.id
                                        : ''
                                }
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
                            value={
                                category != null
                                    ? category.description != null
                                        ? category.description
                                        : ""
                                    : ""
                            }
                            fullWidth
                            onChange={handleCategoryDescriptionChange}
                        />
                        <IconButton onClick={() => handleCategoryUpdate(category)}>
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
            <InputDialog
                title="Change category name"
                label="Category name"
                isOpened={editCategoryNameDialogIsOpened}
                handleOK={handleEditCategoryNameConfirm}
                handleClose={handleEditCategoryNameCancel}
            />
            {
                renderMenu({
                    menuParent,
                    handleMenuClose,
                    handleOpenRemoveCategoryDialog,
                    handleOpenAddCategoryDialog,
                    handleOpenEditCategoryNameDialog
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