import { memo } from 'react';
import './Input.css';

export const Input = memo(
  ({
    label,
    error,
    required = false,
    className = '',
    containerClassName = '',
    ...props
  }) => {
    return (
      <div
        className={`input-container ${containerClassName}`}
      >
        {label && (
          <label className="input-label">
            {label}
            {required && (
              <span className="required">*</span>
            )}
          </label>
        )}
        <input
          className={`input ${error ? 'input-error' : ''} ${className}`}
          {...props}
        />
        {error && (
          <span className="error-message">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export const TextArea = memo(
  ({
    label,
    error,
    required = false,
    className = '',
    containerClassName = '',
    ...props
  }) => {
    return (
      <div
        className={`input-container ${containerClassName}`}
      >
        {label && (
          <label className="input-label">
            {label}
            {required && (
              <span className="required">*</span>
            )}
          </label>
        )}
        <textarea
          className={`input textarea ${error ? 'input-error' : ''} ${className}`}
          {...props}
        />
        {error && (
          <span className="error-message">{error}</span>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
