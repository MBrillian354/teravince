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

  // Initialize form data with default values, preserving user input across re-renders.
  React.useEffect(() => {
    setFormData(currentData => {
      const newData = {};
      fields.forEach(field => {
        // If there's a value in the current state for this field, keep it.
        // Otherwise, use the default value.
        // This preserves user input across re-renders that might change the `fields` array instance.
        // It also handles removal of fields from the form.
        if (currentData.hasOwnProperty(field.name)) {
          newData[field.name] = currentData[field.name];
        } else {
          newData[field.name] = field.defaultValue || '';
        }
      });
      return newData;
    });
  }, [fields]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (localError) setLocalError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');

    const requiredFields = fields.filter(field => field.required);
    for (let field of requiredFields) {
      if (!formData[field.name] || formData[field.name].toString().trim() === '') {
        setLocalError(`${field.label} is required`);
        return;
      }
    }

    if (onSubmit) {
      onSubmit(formData);
    }
  };

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
      rows = 3,
      href = ''
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
      case 'title':
        return (
          <label className={`form-label ${field.className || ''}`}>
            {label}
          </label>
        );

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
            <a href={href} className="clickable-link" download>
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

    if (group && fields[index - 1] && fields[index - 1].group === group) {
      return null;
    }

    const isGroupStart = group && (!fields[index - 1] || fields[index - 1].group !== group);

    if (isGroupStart) {
      const groupFields = [];
      let currentIndex = index;
      while (currentIndex < fields.length && fields[currentIndex].group === group) {
        groupFields.push(fields[currentIndex]);
        currentIndex++;
      }

      let gridClass = '';
      let widthClass = '';

      if (groupFields.length === 2) {
        gridClass = 'grid grid-cols-1 md:grid-cols-2 gap-4';
        widthClass = 'w-full';
      } else if (groupFields.length === 3) {
        gridClass = 'grid grid-cols-1 md:grid-cols-3 gap-4';
        widthClass = 'w-full';
      } else if (groupFields.length > 3) {
        gridClass = 'flex flex-wrap gap-4';
        widthClass = 'flex-1 min-w-0';
      } else {
        return (
          <div className="form-group" key={field.name}>
            {renderFieldContent(field)}
          </div>
        );
      }

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

      {(error || localError) && (
        <p className="text-red-500 text-sm mb-4">{error || localError}</p>
      )}

      {success && (
        <p className="text-green-500 text-sm mb-4">{success}</p>
      )}

      {fields.map((field, index) => renderField(field, index)).filter(Boolean)}

      {showSubmitButton && (
        <button type="submit" className="form-submit-button">
          {submitButtonText}
        </button>
      )}

      {footer && <div>{footer}</div>}
    </form>
  );
};

DynamicForm.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'date', 'textarea', 'select', 'checkbox', 'radio', 'link', 'title']),
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
      group: PropTypes.string,
      href: PropTypes.string
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
