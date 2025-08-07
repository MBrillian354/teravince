import { useSelector, useDispatch } from 'react-redux';
import { closeModal, selectModal } from '../../store/modalSlice';
import { MODAL_TYPES } from '../../constants/modalTypes';
import Modal from '../Modal';
import ConfirmModal from './ConfirmModal';
import NotificationModal from './NotificationModal';

const modalComponents = {
  [MODAL_TYPES.CONFIRM]: ConfirmModal,
  [MODAL_TYPES.NOTIFICATION]: NotificationModal,
};

const GlobalModal = () => {
  const dispatch = useDispatch();
  const { isOpen, type, data, ...rest } = useSelector(selectModal);

  const handleClose = () => {
    if (!rest.isLoading) {
      dispatch(closeModal());
    }
  };

  if (!isOpen || !type) return null;

  const ModalComponent = modalComponents[type];
  if (!ModalComponent) {
    console.error(`Modal type "${type}" not found`);
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} {...rest}>
      <ModalComponent data={data} onClose={handleClose} {...rest} />
    </Modal>
  );
};

export default GlobalModal;
