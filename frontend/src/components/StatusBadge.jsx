import React from 'react';
import { 
  getTaskStatusStyles, 
  getApprovalStatusStyles, 
  getReviewStatusStyles,
  getStatusIcon 
} from '../utils/statusStyles';

/**
 * Reusable Status Badge Component
 * Provides consistent styling for task, approval, and review statuses
 * 
 * @param {Object} props - Component props
 * @param {string} props.status - The status value to display
 * @param {string} props.type - Type of status ('task', 'approval', 'review')
 * @param {boolean} props.showIcon - Whether to show an icon (default: false)
 * @param {string} props.size - Size variant ('xs', 'sm', 'md', 'lg') (default: 'sm')
 * @param {string} props.variant - Style variant ('default', 'solid', 'outline') (default: 'default')
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Inline styles
 */
const StatusBadge = ({ 
  status, 
  type = 'task', 
  showIcon = false, 
  size = 'sm',
  variant = 'default',
  className = '',
  style = {},
  ...props 
}) => {
  // Get the appropriate styles based on type
  const getStatusStyles = () => {
    switch (type) {
      case 'approval':
        return getApprovalStatusStyles(status);
      case 'review':
        return getReviewStatusStyles(status);
      case 'task':
      default:
        return getTaskStatusStyles(status);
    }
  };

  // Get size classes
  const getSizeClasses = () => {
    const sizeMap = {
      'xs': 'text-xs px-2 py-0.5',
      'sm': 'text-xs px-2 py-1',
      'md': 'text-sm px-3 py-1',
      'lg': 'text-base px-4 py-2'
    };
    return sizeMap[size] || sizeMap.sm;
  };

  // Get variant classes
  const getVariantClasses = () => {
    const baseStyles = getStatusStyles();
    
    switch (variant) {
      case 'solid':
        // For solid variant, swap text and background colors
        const [textClass, bgClass, borderClass] = baseStyles.split(' ');
        const solidTextColor = bgClass.replace('bg-', 'text-').replace('-100', '-900');
        const solidBgColor = textClass.replace('text-', 'bg-').replace('-700', '-600');
        return `${solidTextColor} ${solidBgColor} border-transparent`;
      
      case 'outline':
        // For outline variant, use border and text color only
        const [outlineTextClass, , outlineBorderClass] = baseStyles.split(' ');
        return `${outlineTextClass} bg-transparent ${outlineBorderClass}`;
      
      case 'default':
      default:
        return baseStyles;
    }
  };

  // Get icon if requested
  const icon = showIcon ? getStatusIcon(status, type) : '';

  // Combine all classes
  const allClasses = [
    'inline-flex items-center gap-1 font-medium rounded-full border',
    'whitespace-nowrap transition-colors duration-200',
    getSizeClasses(),
    getVariantClasses(),
    className
  ].filter(Boolean).join(' ');

  return (
    <span 
      className={allClasses}
      style={style}
      title={`${type.charAt(0).toUpperCase() + type.slice(1)} Status: ${status}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
