import { createSlice } from "@reduxjs/toolkit";

export const adminSlice = createSlice({
    name: "admin",
    initialState: {
        categoryId: ''
    },
    reducers: {
        setCategoryId(state, action) {
            state.categoryId = action.payload
        }
    }
})

export const selectCategoryId = (state) => state.admin.categoryId
export const { setCategoryId } = adminSlice.actions
export default adminSlice.reducer