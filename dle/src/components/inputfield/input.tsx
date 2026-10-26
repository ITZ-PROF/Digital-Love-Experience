import React, { useState } from 'react';
import './input.css';


interface inputProps {
    label : string;
    multiline: boolean;
    rows?: number
}


const InputField = ({ label, multiline, rows = 4, ...props } : inputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleChange = (e : any) => setValue(e.target.value);

  // Determine if the label should float to the top
  const isFloating = isFocused || value.length > 0;

  return (
    <div className={`input-container ${multiline ? 'multiline' : ''}`}>
      {multiline ? (
        <textarea
          className="custom-field"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          rows={rows}
          {...props}
        />
      ) : (
        <input
          type="text"
          className="custom-field"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      )}
      
      <label className={`custom-label ${isFloating ? 'floating' : ''}`}>
        {label}
      </label>
    </div>
  );
};

export default InputField;
