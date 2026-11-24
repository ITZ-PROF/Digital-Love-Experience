import React, { useId, useState } from 'react';
import './input.css';


interface inputProps {
    label : string;
    multiline: boolean;
    rows?: number;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type?: React.HTMLInputTypeAttribute;
    autoComplete?: string;
    error?: string;
    required?: boolean;
    maxLength?: number;
}


const InputField = ({
  label,
  multiline,
  rows = 4,
  value,
  onChange,
  type = 'text',
  autoComplete,
  error,
  required = false,
  maxLength,
}: inputProps) => {
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState('');

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (value === undefined) setInternalValue(event.target.value);
    onChange?.(event);
  };

  // Determine if the label should float to the top
  const currentValue = value ?? internalValue;
  const isFloating = isFocused || currentValue.length > 0;

  return (
    <div className={`input-container ${multiline ? 'multiline' : ''} ${error ? 'has-error' : ''}`}>
      {multiline ? (
        <textarea
          id={fieldId}
          className="custom-field"
          value={currentValue}
          required={required}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          rows={rows}
        />
      ) : (
        <input
          id={fieldId}
          type={type}
          className="custom-field"
          value={currentValue}
          required={required}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete={autoComplete}
        />
      )}
      
      <label htmlFor={fieldId} className={`custom-label ${isFloating ? 'floating' : ''}`}>
        {label}
      </label>
      {error && <span id={errorId} className="input-error" role="alert">{error}</span>}
    </div>
  );
};

export default InputField;
