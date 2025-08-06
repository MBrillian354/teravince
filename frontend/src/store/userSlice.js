import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../utils/authService";

// Async thunk for updating user
export const updateCurrentUser = createAsyncThunk(
    'user/updateCurrentUser',
    async (userData, { rejectWithValue }) => {
        try {
            const storedUser = authService.getStoredUser();
            if (!storedUser) {
                throw new Error('No user found');
            }
            const response = await authService.updateProfile(storedUser._id || storedUser.id, userData);
            return response.user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.msg || 'Failed to update user');
        }
    }
);

const initialState = {
    currentUser: null,
    isLoading: false,
    error: null
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        clearUserError: (state) => {
            state.error = null;
        },
        clearUser: (state) => {
            state.currentUser = null;
            state.error = null;
            state.isLoading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Update current user
            .addCase(updateCurrentUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateCurrentUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentUser = action.payload;
                
                // Update localStorage with new user data
                authService.storeAuthData(authService.getToken(), action.payload);
            })
            .addCase(updateCurrentUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { setCurrentUser, clearUserError, clearUser } = userSlice.actions;

export default userSlice.reducer;
