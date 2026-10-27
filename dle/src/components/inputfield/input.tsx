import React, { useState } from 'react';
import './input.css';


interface inputProps {
    label : string;
    multiline: boolean;
    rows?: number;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}


const InputField = ({ label, multiline, rows = 4, value, onChange } : inputProps) => {
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
    <div className={`input-container ${multiline ? 'multiline' : ''}`}>
      {multiline ? (
        <textarea
          className="custom-field"
          value={currentValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          rows={rows}
        />
      ) : (
        <input
          type="text"
          className="custom-field"
          value={currentValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      )}
      
      <label className={`custom-label ${isFloating ? 'floating' : ''}`}>
        {label}
      </label>
    </div>
  );
};

export default InputField;
