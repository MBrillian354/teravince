import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    isOpen: false,
    type: null,
    data: null,
    title: '',
    size: 'md',
    showCloseButton: true,
    closeOnBackdrop: true,
    isLoading: false,
  },
  reducers: {
    openModal: (state, action) => {
      const {
        type,
        data = null,
        title = '',
        size = 'md',
        showCloseButton = true,
        closeOnBackdrop = true
      } = action.payload;
      
      state.isOpen = true;
      state.type = type;
      state.data = data;
      state.title = title;
      state.size = size;
      state.showCloseButton = showCloseButton;
      state.closeOnBackdrop = closeOnBackdrop;
      state.isLoading = false;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.type = null;
      state.data = null;
      state.title = '';
      state.size = 'md';
      state.showCloseButton = true;
      state.closeOnBackdrop = true;
      state.isLoading = false;
    },
    updateModalData: (state, action) => {
      state.data = { ...state.data, ...action.payload };
    },
    setModalLoading: (state, action) => {
      state.isLoading = action.payload;
      // Disable backdrop closing and close button when loading
      if (action.payload) {
        state.closeOnBackdrop = false;
        state.showCloseButton = false;
      } else {
        state.closeOnBackdrop = true;
        state.showCloseButton = true;
      }
    },
  },
});

export const { openModal, closeModal, updateModalData, setModalLoading } = modalSlice.actions;

// Selector
export const selectModal = (state) => state.modal;

export default modalSlice.reducer;
