import { memo } from 'react';
import './Card.css';

export const Card = memo(
  ({
    children,
    className = '',
    hoverable = false,
    ...props
  }) => {
    return (
      <div
        className={`card-component ${hoverable ? 'card-hoverable' : ''} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = memo(
  ({ children, className = '' }) => {
    return (
      <div className={`card-header ${className}`}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export const CardBody = memo(
  ({ children, className = '' }) => {
    return (
      <div className={`card-body ${className}`}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';

export const CardFooter = memo(
  ({ children, className = '' }) => {
    return (
      <div className={`card-footer ${className}`}>
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';
