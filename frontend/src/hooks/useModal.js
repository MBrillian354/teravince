import { useDispatch } from 'react-redux';
import { openModal, closeModal, updateModalData } from '../store/modalSlice';
import { MODAL_TYPES } from '../constants/modalTypes';

/**
 * Custom hook for managing modals with Redux.
 * Provides convenient methods to open different types of modals.
 */
export const useModal = () => {
  const dispatch = useDispatch();

  const open = (modalConfig) => {
    dispatch(openModal(modalConfig));
  };

  const close = () => {
    dispatch(closeModal());
  };

  const updateData = (newData) => {
    dispatch(updateModalData(newData));
  };

  const showConfirm = ({
    title = 'Confirmation',
    message = 'Are you sure?',
    onConfirm,
    ...rest
  }) => {
    open({
      type: MODAL_TYPES.CONFIRM,
      data: { title, message, onConfirm, ...rest },
      size: 'sm',
    });
  };

  const showNotification = ({
    type = 'success',
    message,
    description,
    ...rest
  }) => {
    open({
      type: MODAL_TYPES.NOTIFICATION,
      data: { type, message, description, ...rest },
      size: 'sm',
    });
  };

  const showSuccess = (message, description, options) => {
    showNotification({ type: 'success', message, description, ...options });
  };

  const showError = (message, description, options) => {
    showNotification({ type: 'error', message, description, ...options });
  };

  const showDeleteConfirm = (itemName, onConfirm) => {
    showConfirm({
      title: 'Delete Confirmation',
      message: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      confirmText: 'Delete',
      type: 'danger',
      onConfirm,
    });
  };

  return {
    open,
    close,
    updateData,
    showConfirm,
    showNotification,
    showSuccess,
    showError,
    showDeleteConfirm,
  };
};

export default useModal;
