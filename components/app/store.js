import { configureStore } from '@reduxjs/toolkit';
import appReducer from "./appSlice";
import adminReducer from "../admin/adminSlice"

export default configureStore({
  reducer: {
    app: appReducer,
    admin: adminReducer
  }
});

