import { memo } from 'react';
import './Button.css';

export const Button = memo(
  ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    disabled = false,
    loading = false,
    fullWidth = false,
    className = '',
    ...props
  }) => {
    const classNames = [
      'btn',
      `btn-${variant}`,
      fullWidth && 'btn-full-width',
      loading && 'btn-loading',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className={classNames}
        {...props}
      >
        {loading ? (
          <span className="btn-spinner"></span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
