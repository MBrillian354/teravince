import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dashboardAPI, tasksAPI, biasAPI } from "../utils/api";
import axios from 'axios';
// Async thunk for fetching reports
export const fetchReports = createAsyncThunk(
  'supervisor/fetchReports',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/reports', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to fetch reports');
    }
  }
);

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

// Async thunk for fetching all tasks (for supervisor review)
export const fetchAllTasks = createAsyncThunk(
    'supervisor/fetchAllTasks',
    async (_, { rejectWithValue }) => {
        try {
            const response = await tasksAPI.getAll();
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.msg || 'Failed to fetch tasks');
        }
    }
);

// Async thunk for fetching task by ID (for supervisor review)
export const fetchTaskByIdForReview = createAsyncThunk(
    'supervisor/fetchTaskByIdForReview',
    async (taskId, { rejectWithValue }) => {
        try {
            const response = await tasksAPI.getById(taskId);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.msg || 'Failed to fetch task');
        }
    }
);

// Async thunk for updating task (supervisor approval/rejection)
export const updateTaskReview = createAsyncThunk(
    'supervisor/updateTaskReview',
    async ({ taskId, updateData }, { rejectWithValue }) => {
        try {
            const response = await tasksAPI.update(taskId, updateData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.msg || 'Failed to update task');
        }
    }
);

// Async thunk for bias checking in task reviews
export const checkTaskReviewBias = createAsyncThunk(
    'supervisor/checkTaskReviewBias',
    async ({ taskId, review }, { rejectWithValue }) => {
        try {
            const response = await biasAPI.checkTaskReviewBias(taskId, { review });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to check bias');
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
    // Task management for supervisors
    tasks: [],
    currentTaskForReview: null,
    biasCheckResult: null,
    isLoading: false,
    error: null,
    // Reports state
    reports: [],
    reportsLoading: false,
    reportsError: null,
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
        },
        clearCurrentTaskForReview: (state) => {
            state.currentTaskForReview = null;
        },
        clearBiasCheckResult: (state) => {
            state.biasCheckResult = null;
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
            })
            // Fetch reports
            .addCase(fetchReports.pending, (state) => {
                state.reportsLoading = true;
                state.reportsError = null;
            })
            .addCase(fetchReports.fulfilled, (state, action) => {
                state.reportsLoading = false;
                state.reports = action.payload;
            })
            .addCase(fetchReports.rejected, (state, action) => {
                state.reportsLoading = false;
                state.reportsError = action.payload;
            })
            // Fetch all tasks
            .addCase(fetchAllTasks.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllTasks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchAllTasks.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch task by ID for review
            .addCase(fetchTaskByIdForReview.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTaskByIdForReview.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentTaskForReview = action.payload;
            })
            .addCase(fetchTaskByIdForReview.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update task review
            .addCase(updateTaskReview.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateTaskReview.fulfilled, (state, action) => {
                state.isLoading = false;
                const updatedTask = action.payload;
                // Update the task in the tasks array
                state.tasks = state.tasks.map(task =>
                    task._id === updatedTask._id ? updatedTask : task
                );
                // Update current task for review if it's the same task
                if (state.currentTaskForReview && state.currentTaskForReview._id === updatedTask._id) {
                    state.currentTaskForReview = updatedTask;
                }
            })
            .addCase(updateTaskReview.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Check task review bias
            .addCase(checkTaskReviewBias.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(checkTaskReviewBias.fulfilled, (state, action) => {
                state.isLoading = false;
                state.biasCheckResult = action.payload;
            })
            .addCase(checkTaskReviewBias.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearSupervisorError, resetSupervisorData, clearCurrentTaskForReview, clearBiasCheckResult } = supervisorSlice.actions;

export default supervisorSlice.reducer;