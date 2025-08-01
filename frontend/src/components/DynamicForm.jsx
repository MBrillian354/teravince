import React, { useState } from 'react';
import PropTypes from 'prop-types';

const DynamicForm = ({
  title = "",
  subtitle = "",
  fields = [],
  onSubmit,
  submitButtonText = "Submit",
  showSubmitButton = true,
  footer = null,
  className = "",
  error = "",
  success = "",
}) => {
  const [formData, setFormData] = useState({});
  const [localError, setLocalError] = useState('');

  // Initialize form data with default values
  React.useEffect(() => {
    const initialData = {};
    fields.forEach(field => {
      initialData[field.name] = field.defaultValue || '';
    });
    setFormData(initialData);
  }, [fields]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (localError) setLocalError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');

    // Basic validation
    const requiredFields = fields.filter(field => field.required);
    for (let field of requiredFields) {
      if (!formData[field.name] || formData[field.name].toString().trim() === '') {
        setLocalError(`${field.label} is required`);
        return;
      }
    }

    // Call parent's onSubmit handler
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  // Helper function to render just the field content (without form-group wrapper)
  const renderFieldContent = (field) => {
    const {
      type = 'text',
      name,
      label,
      placeholder = '',
      required = false,
      options = [],
      hint = '',
      className: fieldClassName = '',
      disabled = false,
      rows = 3
    } = field;

    const inputProps = {
      name,
      required,
      disabled,
      className: `form-input ${fieldClassName}`,
      value: formData[name] || '',
      onChange: handleInputChange
    };

    switch (type) {
      case 'textarea':
        return (
          <>
            <label className="form-label">{label}</label>
            <textarea
              {...inputProps}
              placeholder={placeholder}
              rows={rows}
            />
            {hint && <p className="form-hint">{hint}</p>}
          </>
        );

      case 'select':
        return (
          <>
            <label className="form-label">{label}</label>
            <select {...inputProps}>
              <option value="">{placeholder || `Select ${label}`}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {hint && <p className="form-hint">{hint}</p>}
          </>
        );

      case 'checkbox':
        return (
          <>
            <label className="remember-me">
              <input
                type="checkbox"
                name={name}
                required={required}
                disabled={disabled}
                checked={formData[name] || false}
                onChange={handleInputChange}
              />
              {label}
            </label>
            {hint && <p className="form-hint">{hint}</p>}
          </>
        );

      case 'radio':
        return (
          <>
            <label className="form-label">{label}</label>
            <div className="space-y-2">
              {options.map((option) => (
                <label key={option.value} className="remember-me">
                  <input
                    type="radio"
                    name={name}
                    value={option.value}
                    required={required}
                    disabled={disabled}
                    checked={formData[name] === option.value}
                    onChange={handleInputChange}
                  />
                  {option.label}
                </label>
              ))}
            </div>
            {hint && <p className="form-hint">{hint}</p>}
          </>
        );

      default:
        return (
          <>
            <label className="block text-sm text-gray-600 mb-1">{label}</label>
            <input
              {...inputProps}
              type={type}
              placeholder={placeholder}
              className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
            {hint && <p className="form-hint">{hint}</p>}
          </>
        );
    }
  };

  const renderField = (field, index) => {
    const { group = null } = field;

    // Check if this field and the next field are in the same group (for side-by-side layout)
    const nextField = fields[index + 1];
    const isGroupStart = group && (!fields[index - 1] || fields[index - 1].group !== group);
    const isInGroup = group && nextField && nextField.group === group;

    // Handle grouped fields (side-by-side layout)
    if (isGroupStart && isInGroup) {
      return (
        <div className="form-group flex gap-4" key={`group-${group}-${index}`}>
          <div className="w-1/2">
            {renderFieldContent(field)}
          </div>
          <div className="w-1/2">
            {renderFieldContent(nextField)}
          </div>
        </div>
      );
    }

    // Skip rendering if this field was already rendered as part of a group
    if (group && fields[index - 1] && fields[index - 1].group === group) {
      return null;
    }

    // Render single field with form-group wrapper
    return (
      <div className="form-group" key={field.name}>
        {renderFieldContent(field)}
      </div>
    );
  };

  return (
    <form className={`${className}`} onSubmit={handleSubmit}>
      {title && <h1 className="form-title">{title}</h1>}
      {subtitle && <p className="form-subtitle">{subtitle}</p>}

      {(title || subtitle) && <hr className="mb-6 border-t border-gray-400" />}

      {/* Display errors */}
      {(error || localError) && (
        <p className="text-red-500 text-sm mb-4">{error || localError}</p>
      )}

      {/* Display success message */}
      {success && (
        <p className="text-green-500 text-sm mb-4">{success}</p>
      )}

      {/* Render form fields */}
      {fields.map((field, index) => renderField(field, index)).filter(Boolean)}

      {/* Submit button */}
      {showSubmitButton && (
        <button type="submit" className="form-submit-button">
          {submitButtonText}
        </button>
      )}

      {footer && (
        <div>
          {footer}
        </div>
      )}
    </form>
  );
};

DynamicForm.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'date', 'textarea', 'select', 'checkbox', 'radio']),
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      placeholder: PropTypes.string,
      required: PropTypes.bool,
      defaultValue: PropTypes.any,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired
        })
      ),
      hint: PropTypes.string,
      className: PropTypes.string,
      disabled: PropTypes.bool,
      rows: PropTypes.number,
      group: PropTypes.string
    })
  ).isRequired,
  onSubmit: PropTypes.func,
  submitButtonText: PropTypes.string,
  showSubmitButton: PropTypes.bool,
  className: PropTypes.string,
  error: PropTypes.string,
  success: PropTypes.string
};

export default DynamicForm;