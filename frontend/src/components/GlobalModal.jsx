import { useSelector, useDispatch } from 'react-redux';
import { closeModal, selectModal } from '../store/modalSlice';
import Modal from './Modal';

// Import modal content components
import ConfirmModal from './modals/ConfirmModal';
import NotificationModal from './modals/NotificationModal';

// Modal types registry
const MODAL_TYPES = {
  CONFIRM: 'CONFIRM',
  NOTIFICATION: 'NOTIFICATION',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

// Map modal types to their corresponding components
const modalComponents = {
  [MODAL_TYPES.CONFIRM]: ConfirmModal,
  [MODAL_TYPES.NOTIFICATION]: NotificationModal,
  [MODAL_TYPES.SUCCESS]: NotificationModal,
  [MODAL_TYPES.ERROR]: NotificationModal,
};

const GlobalModal = () => {
  const dispatch = useDispatch();
  const modal = useSelector(selectModal);
  
  const { isOpen, type, data, title, size, showCloseButton, closeOnBackdrop } = modal;

  const handleClose = () => {
    dispatch(closeModal());
  };

  // If modal is not open or type is not specified, don't render anything
  if (!isOpen || !type) return null;

  // Get the corresponding modal component
  const ModalComponent = modalComponents[type];
  
  // If modal type is not found, show error
  if (!ModalComponent) {
    console.error(`Modal type "${type}" not found`);
    return null;
  }

  // For notification-type modals, adjust the data
  const getModalData = () => {
    if ([MODAL_TYPES.SUCCESS, MODAL_TYPES.ERROR].includes(type)) {
      return {
        ...data,
        type: type.toLowerCase()
      };
    }
    return data;
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={title}
      size={size}
      showCloseButton={showCloseButton}
      closeOnBackdrop={closeOnBackdrop}
    >
      <ModalComponent 
        data={getModalData()} 
        onClose={handleClose}
      />
    </Modal>
  );
};

// Export modal types for use in other components
export { MODAL_TYPES };
export default GlobalModal;
