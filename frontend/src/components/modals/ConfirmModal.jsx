import PropTypes from 'prop-types';
import { AlertTriangle } from 'lucide-react';
import { useDispatch } from 'react-redux';

const ConfirmModal = ({ data, onClose, onConfirm }) => {
  const dispatch = useDispatch();
  
  const { 
    message = 'Are you sure you want to continue?',
    title = 'Confirmation',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger', // 'danger' or 'warning'
    actionType = null,
    actionPayload = null
  } = data || {};

  const handleConfirm = () => {
    // If we have an actionType, dispatch it to Redux
    if (actionType) {
      dispatch({ type: actionType, payload: actionPayload });
    }
    
    // Also call onConfirm if provided (for backward compatibility)
    if (onConfirm) {
      onConfirm(data);
    }
    
    onClose();
  };

  const getIconColor = () => {
    return type === 'danger' ? 'text-red-600' : 'text-yellow-600';
  };

  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center`}>
          <AlertTriangle className={`w-24 h-24 ${getIconColor()}`} />
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6">
        {message}
      </p>
      
      <div className="flex gap-3 justify-center">
        <button
          onClick={onClose}
          className="btn-secondary"
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          className={`btn-danger`}
        >
          {confirmText}
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
    actionType: PropTypes.string,
    actionPayload: PropTypes.any,
  }),
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
};

export default ConfirmModal;
