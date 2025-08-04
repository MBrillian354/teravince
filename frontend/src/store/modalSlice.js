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
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.type = null;
      state.data = null;
      state.title = '';
      state.size = 'md';
      state.showCloseButton = true;
      state.closeOnBackdrop = true;
    },
    updateModalData: (state, action) => {
      state.data = { ...state.data, ...action.payload };
    },
  },
});

export const { openModal, closeModal, updateModalData } = modalSlice.actions;

// Selector
export const selectModal = (state) => state.modal;

export default modalSlice.reducer;
