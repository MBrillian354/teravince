import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./adminSlice";
import staffReducer from "./staffSlice";
import supervisorReducer from "./supervisorSlice";

export const store = configureStore({
    reducer: {
        admin: adminReducer,
        staff: staffReducer,
        supervisor: supervisorReducer
    }
});