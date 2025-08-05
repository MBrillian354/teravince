import { useDispatch } from 'react-redux';
import { openModal, closeModal, updateModalData } from '../store/modalSlice';
import { MODAL_TYPES } from '../constants/modalTypes';

/**
 * Custom hook for managing modals with Redux.
 * Provides convenient methods to open different types of modals.
 * 
 * @returns {Object} Modal control methods
 */
export const useModal = () => {
  const dispatch = useDispatch();

  /**
   * Opens a modal with custom configuration
   * @param {Object} modalConfig - Modal configuration object
   */
  const open = (modalConfig) => {
    dispatch(openModal(modalConfig));
  };

  /**
   * Closes the currently open modal
   */
  const close = () => {
    dispatch(closeModal());
  };

  /**
   * Updates the data of the currently open modal
   * @param {Object} newData - New data to merge with existing modal data
   */
  const updateData = (newData) => {
    dispatch(updateModalData(newData));
  };

  /**
   * Shows a confirmation dialog modal
   * @param {Object} options - Confirmation modal options
   * @param {string} [options.title='Confirmation'] - Modal title
   * @param {string} [options.message='Are you sure?'] - Confirmation message
   * @param {Function} options.onConfirm - Callback function when confirmed
   * @param {string} [options.confirmText='Confirm'] - Confirm button text
   * @param {string} [options.cancelText='Cancel'] - Cancel button text
   * @param {string} [options.type='danger'] - Modal type ('danger' or 'warning')
   */
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

  /**
   * Shows a notification modal
   * @param {Object} options - Notification modal options
   * @param {string} [options.type='success'] - Notification type ('success' or 'error')
   * @param {string} options.message - Main notification message
   * @param {string} [options.description] - Additional description text
   * @param {boolean} [options.autoClose=true] - Whether to auto-close the modal
   * @param {number} [options.timeout=3000] - Auto-close timeout in milliseconds
   * @param {Function} [options.onConfirm] - Callback function when OK button is clicked
   */
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

  /**
   * Shows a success notification modal
   * @param {string} message - Success message
   * @param {string} [description] - Additional description
   * @param {Object} [options] - Additional options
   * @param {Function} [options.onConfirm] - Callback function when OK button is clicked
   */
  const showSuccess = (message, description, options) => {
    showNotification({ type: 'success', message, description, ...options });
  };

  /**
   * Shows an error notification modal
   * @param {string} message - Error message
   * @param {string} [description] - Additional description
   * @param {Object} [options] - Additional options
   * @param {Function} [options.onConfirm] - Callback function when OK button is clicked
   */
  const showError = (message, description, options) => {
    showNotification({ type: 'error', message, description, ...options });
  };

  /**
   * Shows a delete confirmation dialog with pre-configured styling
   * @param {string} itemName - Name of the item to be deleted
   * @param {Function} onConfirm - Callback function when deletion is confirmed
   */
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
