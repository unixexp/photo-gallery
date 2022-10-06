import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
    name: "app",
    initialState: {
        theme: "light"
    },
    reducers: {
        setTheme(state, action) {
            state.theme = action.payload;
        }
    }
});

export const selectTheme = (state) => state.app.theme
export const { setTheme } = appSlice.actions
export default appSlice.reducer