import PropTypes from 'prop-types';
import { CircleCheck, XCircle } from 'lucide-react';
import { useEffect } from 'react';

const NotificationModal = ({ data, onClose }) => {
  const { type = 'success', message, description, autoClose = true, timeout = 3000 } = data || {};

  // Auto-close the modal after timeout
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [autoClose, timeout, onClose]);

  const config = {
    success: {
      icon: CircleCheck,
      iconColor: 'text-green-600',
      titleColor: 'text-green-900',
      buttonColor: 'bg-green-600 hover:bg-green-700'
    },
    error: {
      icon: XCircle,
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
      buttonColor: 'bg-red-600 hover:bg-red-700'
    }
  };

  const { icon: Icon, iconColor, titleColor, buttonColor } = config[type] || config.success;

  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        <div className={`w-16 h-16  rounded-full flex items-center justify-center`}>
          <Icon className={`w-24 h-24 ${iconColor}`} />
        </div>
      </div>
      
      <h3 className={`text-lg font-semibold ${titleColor} mb-2`}>
        {message || 'Notification'}
      </h3>
      
      {description && (
        <p className="text-gray-600 mb-6">
          {description}
        </p>
      )}
      
      <button
        onClick={onClose}
        className={`btn-primary ${buttonColor}`}
      >
        OK
      </button>
    </div>
  );
};

NotificationModal.propTypes = {
  data: PropTypes.shape({
    type: PropTypes.oneOf(['success', 'error']),
    message: PropTypes.string,
    description: PropTypes.string,
    autoClose: PropTypes.bool,
    timeout: PropTypes.number,
  }),
  onClose: PropTypes.func.isRequired,
};

export default NotificationModal;
