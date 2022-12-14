import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import Select from "@mui/material/Select"
import FormControl from "@mui/material/FormControl"
import MenuItem from "@mui/material/MenuItem"
import IconButton from "@mui/material/IconButton"
import AppBar from "@mui/material/AppBar"
import TextField from "@mui/material/TextField"
import MoreIcon from "@mui/icons-material/MoreVert"
import CheckIcon from "@mui/icons-material/CheckOutlined"
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined"

import AlertDialog from "../dialogs/alert-dialog"
import InputDialog from "../dialogs/input-dialog"
import LoadMainImageDialog from "../dialogs/load-main-image-dialog"

import { selectCategory, setCategory } from "../adminSlice"
import CRUDMenu from "../menu/crud-menu"
import { RESULT_OK } from "~/lib/util"

function renderMainImageSelector({ category, galleryAPIService, update, setUpdatedCategoryId }) {

    const styles = {
        mainImageContainer: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginRight: "4px"
        },
    
        mainImageButton: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            cursor: "pointer"
        }
    }
    const [LoadMainImageDialogIsOpened, setLoadMainImageDialogIsOpened] = useState(false)
    const [mainPhoto, setMainPhoto] = useState(null)

    useEffect(() => {
        galleryAPIService.getCategoryMainPhoto(category).then(img => {
            setMainPhoto(img)
        }).catch(() => {
            setMainPhoto(null)
        })
    }, [category])

    const handleOpenLoadMainImageDialog = (event) => {
        if (category != null)
            setLoadMainImageDialogIsOpened(true)
    }

    const handleLoadMainImageDialogConfirm = async (uploadable) => {
        setLoadMainImageDialogIsOpened(false)
        if (uploadable != null) {
            const response = await galleryAPIService.uploadCategoryMainPhoto(category, uploadable)
            if (response.result != RESULT_OK) {
                alert(response.error)
            } else {
                alert(response.result)
            }
            setUpdatedCategoryId(category.id)
            update()
        }
    }

    const handleLoadMainImageDialogCancel = () => {
        setLoadMainImageDialogIsOpened(false)
    }

    const MainImageContainer = () => {

        return (
            <div style={styles.mainImageContainer}>
                <div
                    style={styles.mainImageButton}
                    onClick={(event) => {handleOpenLoadMainImageDialog(event)}}
                >
                        <IconButton>
                            <CloudUploadOutlinedIcon />
                        </IconButton>
                </div>
            </div>
        )
    }

    if (LoadMainImageDialogIsOpened) {
        return (
            <>
                <MainImageContainer />
                <LoadMainImageDialog
                    isOpened={LoadMainImageDialogIsOpened}
                    handleOK={handleLoadMainImageDialogConfirm}
                    handleClose={handleLoadMainImageDialogCancel}
                    image={mainPhoto}
                />
            </>
        )
    } else {
        return <MainImageContainer />
    }

}

function renderCategories(categories) {

    return categories.map(category => {
        return (
            <MenuItem
                    key={category.id}
                    value={category.id}>
                {category.name}
            </MenuItem>
        )
    })

}

export default function Toolbar({ galleryAPIService }) {

    const styles = {
        formContainer: {
            padding: "5px 10px 10px 10px"
        },
    
        categoryBlock: {
            display: "flex",
            paddingBottom: "4px"
        },
    
        categorySelector: {
            width: "100%"
        },
    
        descriptionBlock: {
            display: "flex"
        },

        updateButtonContainer: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }
    }

    const category = useSelector(selectCategory)
    const dispatch = useDispatch()

    const [menuParent, setMenuParent] = useState(null)
    const [removeCategoryAlertDialogIsOpened, setRemoveCategoryAlertDialogIsOpened] = useState(false)
    const [addCategoryDialogIsOpened, setAddCategoryDialogIsOpened] = useState(false)
    const [editCategoryNameDialogIsOpened, setEditCategoryNameDialogIsOpened] = useState(false)
    const [updatedCategoryId, setUpdatedCategoryId] = useState(null)
    const [categories, setCategories] = useState([])

    const handleCategoryChange = (id) => {
        if (id) {
            const _index = categories.findIndex(cat => cat.id === id)
            if (_index != -1) {
                dispatch(setCategory(categories[_index]))
            } else if (categories.length) {
                dispatch(setCategory(categories[0]))
            } else {
                dispatch(setCategory(null))
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

    const handleOpenDeleteCategoryDialog = () => {
        handleMenuClose()
        if (category != null)
            setRemoveCategoryAlertDialogIsOpened(true)
    }

    const handleRemoveCategoryConfirm = () => {
        // Prevent errors with remove undefined category
        if (category != null) {
            galleryAPIService.removeCategory(category.id).then(() => {
                setRemoveCategoryAlertDialogIsOpened(false)
                setUpdatedCategoryId(category.id)
                update()
            })
        }
    }

    const handleRemoveCategoryCancel = () => {
        setRemoveCategoryAlertDialogIsOpened(false)
    }

    const handleOpenCreateCategoryDialog = () => {
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

    const handleOpenEditCategoryDialog = () => {
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
        async function fetchData() {
            try {
                const categoriesData = await galleryAPIService.getCategories()
                if (categoriesData.result === "ok")
                    setCategories(categoriesData.response)
            } catch (e) {
                console.log("Cannot get categories by toolbar mount")
            }
        }
        fetchData()
    }, [])

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
                <div style={styles.formContainer}>
                    <FormControl style={{minWidth: "100%"}} variant="outlined" size="small">
                        <div style={styles.categoryBlock}>
                            <Select value={
                                        category != null
                                            ? category.id
                                            : ''
                                    }
                                    style={styles.categorySelector}
                                    onChange={e => handleCategoryChange(e.target.value)}>
                                { renderCategories(categories) }
                            </Select>
                            <IconButton onClick={handleMenuOpen}>
                                <MoreIcon />
                            </IconButton>
                        </div>
                        <div style={styles.descriptionBlock}>
                            { renderMainImageSelector({category, galleryAPIService, update, setUpdatedCategoryId}) }
                            <TextField
                                minRows={10}
                                maxRows={10}
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
                            <div style={styles.updateButtonContainer}>
                                <IconButton onClick={
                                            () => {
                                                if (category != null)
                                                    handleCategoryUpdate(category)
                                            }
                                        }>
                                    <CheckIcon />
                                </IconButton>
                            </div>
                        </div>
                    </FormControl>
                </div>
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
            <CRUDMenu
                menuParent={menuParent}
                handleMenuClose={handleMenuClose}
                handleOpenCreateDialog={handleOpenCreateCategoryDialog}
                handleOpenEditDialog={handleOpenEditCategoryDialog}
                handleOpenDeleteDialog={handleOpenDeleteCategoryDialog}
            />
        </div>
    )

}