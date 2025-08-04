import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { accountsAPI } from "../utils/api";

// Async thunks for API calls
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

const initialState = {
    dashboardData: [
        { label: "Supervisors", value: 85 },
        { label: "Staffs", value: 31 },
        { label: "Admins", value: 31 },
        { label: "Active Job Titles", value: 7 },
        { label: "Draft Job Titles", value: 2 },
        { label: "Unassigned Employees", value: 2 }
    ],
    accountsData: [],
    jobsData: [
        { id: 1, title: 'Software Engineer', description: 'Develop applications', employees: 5, status: 'Active' },
        { id: 2, title: 'Product Manager', description: 'Oversee product roadmap', employees: 3, status: 'Draft' }
    ],
    isLoading: false,
    error: null
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        addJob: (state, action) => {
            state.jobsData.push(action.payload);
            console.log('Job added:', action.payload);
        },
        updateJob: (state, action) => {
            const updated = action.payload;
            state.jobsData = state.jobsData.map(job =>
                job.id === updated.id ? { ...job, ...updated } : job
            );
            console.log('Job updated:', updated);
        },
        deleteJob: (state, action) => {
            const id = action.payload;
            state.jobsData = state.jobsData.filter(job => job.id !== id);
            console.log('Job deleted:', id);
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch accounts
            .addCase(fetchAccounts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAccounts.fulfilled, (state, action) => {
                state.loading = false;
                // Transform backend data to match frontend format
                state.accountsData = action.payload.map(user => ({
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    jobTitle: user.jobTitle || '',
                    position: user.position || '',
                    status: user.status || 'Full Time',
                    email: user.email,
                    role: user.role
                }));
            })
            .addCase(fetchAccounts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create account
            .addCase(createAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAccount.fulfilled, (state, action) => {
                state.loading = false;
                // Refetch accounts after creation would be better, but for now add optimistically
                state.accountsData.push({
                    ...action.payload,
                    status: action.payload.status || 'Full Time'
                });
            })
            .addCase(createAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update account
            .addCase(updateAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAccount.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload;
                state.accountsData = state.accountsData.map(account =>
                    account.id === updated._id ? {
                        id: updated._id,
                        firstName: updated.firstName,
                        lastName: updated.lastName,
                        jobTitle: updated.jobTitle || '',
                        position: updated.position || '',
                        status: updated.status || 'Full Time',
                        email: updated.email,
                        role: updated.role
                    } : account
                );
            })
            .addCase(updateAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete account
            .addCase(deleteAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAccount.fulfilled, (state, action) => {
                state.loading = false;
                const id = action.payload;
                state.accountsData = state.accountsData.filter(account => account.id !== id);
            })
            .addCase(deleteAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { addJob, updateJob, deleteJob, clearError } = adminSlice.actions;

export default adminSlice.reducer;