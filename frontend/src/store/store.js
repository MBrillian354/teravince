import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./adminSlice";
import staffReducer from "./staffSlice";
import supervisorReducer from "./supervisorSlice";
import modalReducer from "./modalSlice";
import userReducer from "./userSlice";

export const store = configureStore({
    reducer: {
        admin: adminReducer,
        staff: staffReducer,
        supervisor: supervisorReducer,
        modal: modalReducer,
        user: userReducer,
    }
});