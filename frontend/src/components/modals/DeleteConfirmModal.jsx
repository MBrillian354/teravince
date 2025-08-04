import PropTypes from 'prop-types';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ data, onClose, onConfirm }) => {
  const { 
    message = 'Are you sure you want to continue?',
    title = 'Confirmation',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger' // 'danger' or 'warning'
  } = data || {};

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(data);
    }
    onClose();
  };

  const getButtonStyles = () => {
    return type === 'danger' 
      ? 'bg-red-600 hover:bg-red-700'
      : 'bg-yellow-600 hover:bg-yellow-700';
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
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          className={`px-4 py-2 ${getButtonStyles()} text-white rounded-lg transition-colors`}
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
  }),
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
};

export default ConfirmModal;
