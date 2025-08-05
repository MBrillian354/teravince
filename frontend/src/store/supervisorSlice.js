import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dashboardAPI } from "../utils/api";

// Async thunk for fetching supervisor dashboard data
export const fetchSupervisorDashboard = createAsyncThunk(
    'supervisor/fetchDashboard',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await dashboardAPI.getSupervisorDashboard(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.msg || 'Failed to fetch supervisor dashboard');
        }
    }
);

const initialState = {
    totalTasks: 0,
    numberOfStaffs: 0,
    avgTasksPerPerson: 0,
    taskStatus: {
        achieved: 0,
        onProcess: 0,
        awaitingReview: 0,
        notYetStarted: 0,
    },
    staffs: [],
    isLoading: false,
    error: null
};

const supervisorSlice = createSlice({
    name: "supervisor",
    initialState,
    reducers: {
        clearSupervisorError: (state) => {
            state.error = null;
        },
        resetSupervisorData: (state) => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch supervisor dashboard
            .addCase(fetchSupervisorDashboard.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSupervisorDashboard.fulfilled, (state, action) => {
                state.isLoading = false;
                state.totalTasks = action.payload.totalTasks;
                state.numberOfStaffs = action.payload.numberOfStaffs;
                state.avgTasksPerPerson = action.payload.avgTasksPerPerson;
                state.taskStatus = action.payload.taskStatus;
                state.staffs = action.payload.staffs;
            })
            .addCase(fetchSupervisorDashboard.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearSupervisorError, resetSupervisorData } = supervisorSlice.actions;

export default supervisorSlice.reducer;