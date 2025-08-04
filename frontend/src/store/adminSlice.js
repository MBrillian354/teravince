import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { accountsAPI, jobsAPI, dashboardAPI } from "../utils/api";

// Async thunks for API calls
export const fetchDashboardData = createAsyncThunk(
    'admin/fetchDashboardData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await dashboardAPI.getAdminDashboard();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.msg || 'Failed to fetch dashboard data');
        }
    }
);

export const fetchAccounts = createAsyncThunk(
    'admin/fetchAccounts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await accountsAPI.getAll();
            console.log(response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.msg || 'Failed to fetch accounts');
        }
    }
);

export const createAccount = createAsyncThunk(
    'admin/createAccount',
    async (accountData, { rejectWithValue }) => {
        try {
            await accountsAPI.create(accountData);
            // Return the account data with a temporary ID for optimistic update
            return {
                id: Date.now(), // This will be replaced when we refetch from server
                ...accountData
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.msg || 'Failed to create account');
        }
    }
);

export const updateAccount = createAsyncThunk(
    'admin/updateAccount',
    async ({ id, ...accountData }, { rejectWithValue }) => {
        try {
            const response = await accountsAPI.update(id, accountData);
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.msg || 'Failed to update account');
        }
    }
);

export const deleteAccount = createAsyncThunk(
    'admin/deleteAccount',
    async (id, { rejectWithValue }) => {
        try {
            await accountsAPI.delete(id);
            console.log('Account deleted:', id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.msg || 'Failed to delete account');
        }
    }
);

// Jobs async thunks
export const fetchJobs = createAsyncThunk(
    'admin/fetchJobs',
    async (_, { rejectWithValue }) => {
        try {
            const response = await jobsAPI.getAll();
            console.log(response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.msg || 'Failed to fetch jobs');
        }
    }
);

export const createJob = createAsyncThunk(
    'admin/createJob',
    async (jobData, { rejectWithValue }) => {
        try {
            const response = await jobsAPI.create(jobData);
            return response.data.job;
        } catch (error) {
            return rejectWithValue(error.response?.data?.msg || 'Failed to create job');
        }
    }
);

export const updateJob = createAsyncThunk(
    'admin/updateJob',
    async ({ id, ...jobData }, { rejectWithValue }) => {
        console.log('Updating job:', id, jobData);
        try {
            const response = await jobsAPI.update(id, jobData);
            return response.data.job;
        } catch (error) {
            return rejectWithValue(error.response?.data?.msg || 'Failed to update job');
        }
    }
);

export const deleteJob = createAsyncThunk(
    'admin/deleteJob',
    async (id, { rejectWithValue }) => {
        try {
            await jobsAPI.delete(id);
            console.log('Job deleted:', id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.msg || 'Failed to delete job');
        }
    }
);

const initialState = {
    dashboardData: [
        { label: "Supervisors", value: 0 },
        { label: "Staffs", value: 0 },
        { label: "Admins", value: 0 },
        { label: "Active Job Titles", value: 0 },
        { label: "Draft Job Titles", value: 0 },
        { label: "Unassigned Employees", value: 0 }
    ],
    accountsData: [],
    jobsData: [],
    isLoading: false,
    error: null
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch dashboard data
            .addCase(fetchDashboardData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.isLoading = false;
                const data = action.payload;
                state.dashboardData = [
                    { label: "Supervisors", value: data.supervisorsCount || 0 },
                    { label: "Staffs", value: data.staffsCount || 0 },
                    { label: "Admins", value: data.adminsCount || 0 },
                    { label: "Active Job Titles", value: data.activeJobTitles || 0 },
                    { label: "Draft Job Titles", value: data.draftJobTitles || 0 },
                    { label: "Unassigned Employees", value: data.unassignedEmployees || 0 }
                ];
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch accounts
            .addCase(fetchAccounts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAccounts.fulfilled, (state, action) => {
                state.isLoading = false;
                // Transform backend data to match frontend format
                state.accountsData = action.payload.map(user => ({
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    jobTitle: user.jobTitle || '',
                    position: user.position || '',
                    status: user.status || '',
                    email: user.email,
                    role: user.role
                }));
            })
            .addCase(fetchAccounts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Create account
            .addCase(createAccount.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createAccount.fulfilled, (state, action) => {
                state.isLoading = false;
                // Refetch accounts after creation would be better, but for now add optimistically
                state.accountsData.push({
                    ...action.payload,
                    status: action.payload.status || ''
                });
            })
            .addCase(createAccount.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update account
            .addCase(updateAccount.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateAccount.fulfilled, (state, action) => {
                state.isLoading = false;
                const updated = action.payload;
                state.accountsData = state.accountsData.map(account =>
                    account.id === updated._id ? {
                        id: updated._id,
                        firstName: updated.firstName,
                        lastName: updated.lastName,
                        jobTitle: updated.jobTitle || '',
                        position: updated.position || '',
                        status: updated.status || '',
                        email: updated.email,
                        role: updated.role
                    } : account
                );
            })
            .addCase(updateAccount.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Delete account
            .addCase(deleteAccount.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteAccount.fulfilled, (state, action) => {
                state.isLoading = false;
                const id = action.payload;
                state.accountsData = state.accountsData.filter(account => account.id !== id);
            })
            .addCase(deleteAccount.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch jobs
            .addCase(fetchJobs.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchJobs.fulfilled, (state, action) => {
                state.isLoading = false;
                // Transform backend data to match frontend format
                state.jobsData = action.payload.map(job => ({
                    id: job._id,
                    title: job.title,
                    description: job.description || '',
                    employees: job.assignedTo ? job.assignedTo.length : 0,
                    status: job.status,
                    assignedTo: job.assignedTo || []
                }));
            })
            .addCase(fetchJobs.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Create job
            .addCase(createJob.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createJob.fulfilled, (state, action) => {
                state.isLoading = false;
                const job = action.payload;
                state.jobsData.push({
                    id: job._id,
                    title: job.title,
                    description: job.description || '',
                    employees: job.assignedTo ? job.assignedTo.length : 0,
                    status: job.status,
                    assignedTo: job.assignedTo || []
                });
            })
            .addCase(createJob.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update job
            .addCase(updateJob.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateJob.fulfilled, (state, action) => {
                state.isLoading = false;
                const updated = action.payload;
                state.jobsData = state.jobsData.map(job =>
                    job.id === updated._id ? {
                        id: updated._id,
                        title: updated.title,
                        description: updated.description || '',
                        employees: updated.assignedTo ? updated.assignedTo.length : 0,
                        status: updated.status,
                        assignedTo: updated.assignedTo || []
                    } : job
                );
            })
            .addCase(updateJob.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Delete job
            .addCase(deleteJob.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteJob.fulfilled, (state, action) => {
                state.isLoading = false;
                const id = action.payload;
                state.jobsData = state.jobsData.filter(job => job.id !== id);
            })
            .addCase(deleteJob.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError } = adminSlice.actions;

export default adminSlice.reducer;