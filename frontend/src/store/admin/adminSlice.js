import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    dashboardData: [
        { label: "Supervisors", value: 85 },
        { label: "Staffs", value: 31 },
        { label: "Admins", value: 31 },
        { label: "Active Job Titles", value: 7 },
        { label: "Draft Job Titles", value: 2 },
        { label: "Unassigned Employees", value: 2 }
    ]
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {}
});

export const { } = adminSlice.actions;

export default adminSlice.reducer;