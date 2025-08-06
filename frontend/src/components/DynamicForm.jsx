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
  initialData = null, 
}) => {
  const [formData, setFormData] = useState({});
  const [localError, setLocalError] = useState('');
  const [dynamicGroups, setDynamicGroups] = useState({});

  // Initialize form data with default values, preserving user input across re-renders.
  React.useEffect(() => {
    setFormData(currentData => {
      const newData = {};

      // Initialize dynamic groups
      const groups = {};
      fields.forEach(field => {
        if (field.group && field.isDynamic) {
          if (!groups[field.group]) {
            groups[field.group] = [];
          }
        }
      });

      Object.keys(groups).forEach(groupName => {
        if (initialData && initialData[groupName] && Array.isArray(initialData[groupName])) {
          groups[groupName] = initialData[groupName].map(item => ({ ...item }));
        } else if (!currentData[groupName] || !Array.isArray(currentData[groupName])) {
          groups[groupName] = [{}];
        } else {
          groups[groupName] = currentData[groupName];
        }

        // Initialize each group instance with default values
        const groupFields = fields.filter(f => f.group === groupName);
        groups[groupName] = groups[groupName].map(instance => {
          const initializedInstance = { ...instance };
          groupFields.forEach(field => {
            if (!initializedInstance.hasOwnProperty(field.name)) {
              initializedInstance[field.name] = field.defaultValue || '';
            }
          });
          return initializedInstance;
        });
      });

      // Set dynamic groups state
      setDynamicGroups(groups);

      fields.forEach(field => {
        // Skip dynamic group fields as they're handled above
        if (field.group && field.isDynamic) {
          return;
        }

        // PERBAIKAN: Prioritaskan initialData untuk field biasa
        if (initialData && initialData.hasOwnProperty(field.name)) {
          newData[field.name] = initialData[field.name];
        } else if (currentData.hasOwnProperty(field.name)) {
          // If there's a value in the current state for this field, keep it.
          newData[field.name] = currentData[field.name];
        } else {
          // Otherwise, use the default value.
          newData[field.name] = field.defaultValue || '';
        }
      });

      // Add dynamic group data to form data
      Object.keys(groups).forEach(groupName => {
        newData[groupName] = groups[groupName];
      });

      return newData;
    });
  }, [fields, initialData]); 

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
    if (localError) setLocalError('');
  };

  const handleDynamicInputChange = (groupName, index, fieldName, value) => {
    setFormData(prev => {
      const newGroupData = [...prev[groupName]];
      newGroupData[index] = {
        ...newGroupData[index],
        [fieldName]: value
      };
      return {
        ...prev,
        [groupName]: newGroupData
      };
    });

    setDynamicGroups(prev => {
      const newGroups = { ...prev };
      newGroups[groupName][index] = {
        ...newGroups[groupName][index],
        [fieldName]: value
      };
      return newGroups;
    });

    if (localError) setLocalError('');
  };

  const addDynamicGroup = (groupName) => {
    const groupFields = fields.filter(f => f.group === groupName);
    const newInstance = {};
    groupFields.forEach(field => {
      newInstance[field.name] = field.defaultValue || '';
    });

    setFormData(prev => ({
      ...prev,
      [groupName]: [...prev[groupName], newInstance]
    }));

    setDynamicGroups(prev => ({
      ...prev,
      [groupName]: [...prev[groupName], newInstance]
    }));
  };

  const removeDynamicGroup = (groupName, index) => {
    if (dynamicGroups[groupName].length <= 1) return; // Don't allow removing the last one

    setFormData(prev => {
      const newGroupData = prev[groupName].filter((_, i) => i !== index);
      return {
        ...prev,
        [groupName]: newGroupData
      };
    });

    setDynamicGroups(prev => ({
      ...prev,
      [groupName]: prev[groupName].filter((_, i) => i !== index)
    }));
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

  const renderFieldContent = (field, groupIndex = null, isDynamic = false) => {
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

    const getValue = () => {
      if (isDynamic && groupIndex !== null) {
        return dynamicGroups[field.group]?.[groupIndex]?.[name] || '';
      }
      return formData[name] || '';
    };

    const handleChange = (e) => {
      const { value, type, checked, files } = e.target;
      const finalValue = type === 'checkbox' ? checked : type === 'file' ? files[0] : value;

      if (isDynamic && groupIndex !== null) {
        handleDynamicInputChange(field.group, groupIndex, name, finalValue);
      } else {
        handleInputChange(e);
      }
    };

    const inputProps = {
      name: isDynamic ? `${name}_${groupIndex}` : name,
      required,
      disabled,
      className: `form-input ${fieldClassName} ${disabled ? 'disabled' : ''}`,
    };

    // Only add value prop for non-file inputs
    if (type !== 'file') {
      inputProps.value = getValue();
      inputProps.onChange = handleChange;
    } else {
      inputProps.onChange = handleChange;
    }

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
              value={getValue()}
              onChange={handleChange}
            />
            {hint && <p className="form-hint">{hint}</p>}
          </>
        );

      case 'select':
        return (
          <>
            <label className="form-label">{label}</label>
            <select
              {...inputProps}
              className={`form-input ${fieldClassName} ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
              value={getValue()}
              onChange={handleChange}
            >
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
                name={inputProps.name}
                required={required}
                disabled={disabled}
                checked={getValue() || false}
                onChange={handleChange}
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
                    name={inputProps.name}
                    value={option.value}
                    required={required}
                    disabled={disabled}
                    checked={getValue() === option.value}
                    onChange={handleChange}
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

      case 'file':
        return (
          <>
            <label className="form-label">{label}</label>
            <input
              type="file"
              name={inputProps.name}
              required={required}
              disabled={disabled}
              className={`form-input  ${fieldClassName} ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
              onChange={handleChange}
              accept={field.accept || "*/*"}
            />
            {getValue() && typeof getValue() === 'object' && getValue().name && (
              <div className="text-sm text-green-600 mt-2 p-2 bg-green-50 rounded border border-green-200">
                ✓ Selected: {getValue().name}
              </div>
            )}
            {getValue() && typeof getValue() === 'string' && getValue().startsWith('uploads/') && (
              <div className="text-sm text-blue-600 mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                📎 Current file:
                <a href={`/${getValue()}`} target="_blank" rel="noopener noreferrer" className="ml-1 underline hover:text-blue-800">
                  View/Download
                </a>
              </div>
            )}
            {hint && <p className="form-hint">{hint}</p>}
          </>
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
              value={getValue()}
              onChange={handleChange}
            />
            {hint && <p className="form-hint">{hint}</p>}
          </>
        );
    }
  };

  const renderField = (field, index) => {
    const { group = null, isDynamic = false } = field;

    // Skip if this field is part of a group that was already processed
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

      // Check if this is a dynamic group
      if (isDynamic && dynamicGroups[group]) {
        return (
          <div key={`group-${group}-${index}`} className="relative border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-4">
            {dynamicGroups[group].map((groupInstance, groupIndex) => {
              // Separate fields by position
              const topFields = groupFields.filter(field => field.position === 'top');
              const centerFields = groupFields.filter(field => !field.position || field.position === 'center');
              const bottomFields = groupFields.filter(field => field.position === 'bottom');

              let gridClass = '';
              let widthClass = '';

              if (groupFields.length > 1) {
                gridClass = 'flex flex-wrap gap-4';
                widthClass = 'flex-1 min-w-0';
              } else {
                gridClass = 'w-full';
                widthClass = 'w-full';
              }

              const renderFieldsByPosition = (fields, positionClass = '') => {
                if (fields.length === 0) return null;

                return (
                  <div className={`${gridClass} ${positionClass}`}>
                    {fields.map((groupField) => (
                      <div className={widthClass} key={`${groupField.name}-${groupIndex}`}>
                        {renderFieldContent(groupField, groupIndex, true)}
                      </div>
                    ))}
                  </div>
                );
              };

              return (
                <div key={`${group}-${groupIndex}`} className="relative">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-4">
                      {/* Top positioned fields */}
                      {renderFieldsByPosition(topFields, 'order-1')}

                      {/* Center positioned fields (default) */}
                      {renderFieldsByPosition(centerFields, 'order-2')}

                      {/* Bottom positioned fields */}
                      {renderFieldsByPosition(bottomFields, 'order-3')}
                    </div>
                    {dynamicGroups[group].length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDynamicGroup(group, groupIndex)}
                        className="btn-icon text-red-500"
                        title="Remove this group"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => addDynamicGroup(group)}
              className="flex items-center justify-center w-full mt-8 p-3 border-2 border-dashed border-gray-400 rounded-lg text-gray-600 hover:text-gray-800 hover:border-gray-500 hover:cursor-pointer transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New
            </button>
          </div>
        );
      }

      // Static group rendering (existing logic)
      // Separate fields by position
      const topFields = groupFields.filter(field => field.position === 'top');
      const centerFields = groupFields.filter(field => !field.position || field.position === 'center');
      const bottomFields = groupFields.filter(field => field.position === 'bottom');

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
          <div className="form-group space-y-4" key={field.name}>
            {/* Top positioned fields */}
            {topFields.map((groupField) => (
              <div key={groupField.name} className="order-1">
                {renderFieldContent(groupField)}
              </div>
            ))}

            {/* Center positioned fields (default) */}
            {centerFields.map((groupField) => (
              <div key={groupField.name} className="order-2">
                {renderFieldContent(groupField)}
              </div>
            ))}

            {/* Bottom positioned fields */}
            {bottomFields.map((groupField) => (
              <div key={groupField.name} className="order-3">
                {renderFieldContent(groupField)}
              </div>
            ))}
          </div>
        );
      }

      const renderFieldsByPosition = (fields, positionClass = '') => {
        if (fields.length === 0) return null;

        return (
          <div className={`${gridClass} ${positionClass}`}>
            {fields.map((groupField) => (
              <div className={widthClass} key={groupField.name}>
                {renderFieldContent(groupField)}
              </div>
            ))}
          </div>
        );
      };

      return (
        <div className="form-group space-y-4" key={`group-${group}-${index}`}>
          {/* Top positioned fields */}
          {renderFieldsByPosition(topFields, 'order-1')}

          {/* Center positioned fields (default) */}
          {renderFieldsByPosition(centerFields, 'order-2')}

          {/* Bottom positioned fields */}
          {renderFieldsByPosition(bottomFields, 'order-3')}
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
      type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'date', 'textarea', 'select', 'checkbox', 'radio', 'link', 'title', 'file']),
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
      isDynamic: PropTypes.bool,
      position: PropTypes.oneOf(['top', 'center', 'bottom']),
      href: PropTypes.string,
      accept: PropTypes.string
    })
  ).isRequired,
  onSubmit: PropTypes.func,
  submitButtonText: PropTypes.string,
  showSubmitButton: PropTypes.bool,
  className: PropTypes.string,
  error: PropTypes.string,
  success: PropTypes.string,
  initialData: PropTypes.object, // TAMBAHAN: PropTypes untuk initialData
};

export default DynamicForm;