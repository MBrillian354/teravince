import { useDispatch } from 'react-redux';
import { openModal, closeModal, updateModalData } from '../store/modalSlice';
import { MODAL_TYPES } from '../components/GlobalModal';

/**
 * Custom hook for managing modals with Redux
 * Provides convenient methods to open different types of modals
 */
export const useModal = () => {
  const dispatch = useDispatch();

  // Generic modal opener
  const open = (modalConfig) => {
    dispatch(openModal(modalConfig));
  };

  // Close current modal
  const close = () => {
    dispatch(closeModal());
  };

  // Update modal data without closing
  const updateData = (newData) => {
    dispatch(updateModalData(newData));
  };

  // Convenience methods for common modal types
  const showConfirm = ({
    message = 'Are you sure you want to continue?',
    title = 'Confirmation',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger', // 'danger' or 'warning'
    onConfirm
  }) => {
    open({
      type: MODAL_TYPES.CONFIRM,
      title: null, // Let the modal component handle the title
      data: {
        message,
        title,
        confirmText,
        cancelText,
        type,
        modalProps: { onConfirm }
      },
      size: 'sm'
    });
  };

  const showNotification = ({
    type = 'success',
    message,
    description,
    title
  }) => {
    open({
      type: MODAL_TYPES.NOTIFICATION,
      title: title || null,
      data: {
        type,
        message,
        description
      },
      size: 'sm',
      showCloseButton: true
    });
  };

  const showSuccess = (message, description, title) => {
    showNotification({
      type: 'success',
      message,
      description,
      title
    });
  };

  const showError = (message, description, title) => {
    showNotification({
      type: 'error',
      message,
      description,
      title
    });
  };

  return {
    // Generic methods
    open,
    close,
    updateData,
    
    // Specific modal types
    showConfirm,
    showNotification,
    
    // Notification shortcuts
    showSuccess,
    showError,
    
    // Modal types for custom usage
    MODAL_TYPES
  };
};

export default useModal;
