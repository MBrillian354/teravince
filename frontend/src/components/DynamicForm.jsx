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
      className: `form-input ${fieldClassName} ${disabled ? 'disabled' : ''}`,
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
              className={`form-input ${fieldClassName} ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
            />
            {hint && <p className="form-hint">{hint}</p>}
          </>
        );

      case 'select':
        return (
          <>
            <label className="form-label">{label}</label>
            <select {...inputProps} className={`form-input ${fieldClassName} ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}>
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
            <label className={`remember-me ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
                <label key={option.value} className={`remember-me ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
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

      case 'link':
        return (
          <div className={`flex items-center h-full justify-end ${field.className}`}>
            <a href={field.href} className="clickable-link">
              {label}
            </a>
          </div>
        );

      default:
        return (
          <>
            <label className="form-label">{label}</label>
            <input
              {...inputProps}
              type={type}
              placeholder={placeholder}
              className={`form-input ${fieldClassName} ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
            />
            {hint && <p className="form-hint">{hint}</p>}
          </>
        );
    }
  };

  const renderField = (field, index) => {
    const { group = null } = field;

    // Skip rendering if this field was already rendered as part of a group
    if (group && fields[index - 1] && fields[index - 1].group === group) {
      return null;
    }

    // Check if this is the start of a group
    const isGroupStart = group && (!fields[index - 1] || fields[index - 1].group !== group);

    if (isGroupStart) {
      // Find all fields in this group
      const groupFields = [];
      let currentIndex = index;
      while (currentIndex < fields.length && fields[currentIndex].group === group) {
        groupFields.push(fields[currentIndex]);
        currentIndex++;
      }

      // Determine the grid layout based on number of fields in group
      let gridClass = '';
      let widthClass = '';
      
      if (groupFields.length === 2) {
        gridClass = 'grid grid-cols-1 md:grid-cols-2 gap-4';
        widthClass = 'w-full';
      } else if (groupFields.length === 3) {
        gridClass = 'grid grid-cols-1 md:grid-cols-3 gap-4';
        widthClass = 'w-full';
      } else if (groupFields.length > 3) {
        // For more than 3 fields, use flex layout with equal widths
        gridClass = 'flex flex-wrap gap-4';
        widthClass = 'flex-1 min-w-0';
      } else {
        // Single field in group, treat as regular field
        return (
          <div className="form-group" key={field.name}>
            {renderFieldContent(field)}
          </div>
        );
      }

      // Render grouped fields
      return (
        <div className={`form-group ${gridClass}`} key={`group-${group}-${index}`}>
          {groupFields.map((groupField) => (
            <div className={widthClass} key={groupField.name}>
              {renderFieldContent(groupField)}
            </div>
          ))}
        </div>
      );
    }

    // Render single field with form-group wrapper (not part of any group)
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
      type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'date', 'textarea', 'select', 'checkbox', 'radio', 'link']),
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