import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { tasksAPI } from "../utils/api";

// Async thunks for task operations
export const fetchTasks = createAsyncThunk(
  'staff/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/tasks');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to fetch tasks');
    }
  }
);

export const fetchTasksByUserId = createAsyncThunk(
  'staff/fetchTasksByUserId',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await tasksAPI.getByUserId(userId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to fetch tasks');
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  'staff/fetchTaskById',
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/tasks/${taskId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to fetch task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'staff/updateTask',
  async ({ id, ...taskData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/tasks/${id}`, taskData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to update task');
    }
  }
);

export const createTask = createAsyncThunk(
  'staff/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to create task');
    }
  }
);

const initialState = {
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch tasks by user ID
      .addCase(fetchTasksByUserId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasksByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasksByUserId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch task by ID
      .addCase(fetchTaskById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update task
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedTask = action.payload;
        state.tasks = state.tasks.map(task =>
          task._id === updatedTask._id ? updatedTask : task
        );
        if (state.currentTask && state.currentTask._id === updatedTask._id) {
          state.currentTask = updatedTask;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create task
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearCurrentTask } = staffSlice.actions;

export default staffSlice.reducer;