import { configureStore } from '@reduxjs/toolkit'
import adminReducer from "../admin/adminSlice"

export default configureStore({
  reducer: {
    admin: adminReducer
  }
});

