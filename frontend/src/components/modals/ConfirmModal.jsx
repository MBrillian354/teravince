import PropTypes from 'prop-types';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setModalLoading } from '../../store/modalSlice';

const ConfirmModal = ({ data, onClose, isLoading }) => {
  const dispatch = useDispatch();
  const {
    message = 'Are you sure?',
    title = 'Confirmation',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger',
    onConfirm,
  } = data || {};

  const handleConfirm = async () => {
    if (typeof onConfirm !== 'function') return;

    dispatch(setModalLoading(true));
    try {
      await onConfirm();
      // The modal will be closed by the logic that called it,
      // often after a successful API call.
    } catch (error) {
      console.error('Confirmation action failed:', error);
      // Optionally, handle error display here
    } finally {
      // Only set loading to false if the modal hasn't been closed yet.
      // The calling logic might close the modal immediately after onConfirm resolves.
      dispatch(setModalLoading(false));
      onClose(); // Close on completion or error
    }
  };

  const iconColor = type === 'danger' ? 'text-red-600' : 'text-yellow-600';

  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        <AlertTriangle className={`w-24 h-24 ${iconColor}`} />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      
      <div className="flex gap-3 justify-center">
        <button onClick={onClose} className="btn-secondary" disabled={isLoading}>
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          className={`btn-danger flex items-center gap-2`}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLoading ? 'Processing...' : confirmText}
        </button>
      </div>
    </div>
  );
};

ConfirmModal.propTypes = {
  data: PropTypes.shape({
    message: PropTypes.string,
    title: PropTypes.string,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    type: PropTypes.oneOf(['danger', 'warning']),
    onConfirm: PropTypes.func.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default ConfirmModal;
