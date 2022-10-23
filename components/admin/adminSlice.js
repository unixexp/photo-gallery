import { createSlice } from "@reduxjs/toolkit";

export const adminSlice = createSlice({
    name: "admin",
    initialState: {
        category: null
    },
    reducers: {
        setCategory(state, action) {
            state.category = action.payload
        }
    }
})

export const selectCategory = (state) => state.admin.category
export const { setCategory } = adminSlice.actions

export default adminSlice.reducer