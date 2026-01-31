import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon,
  className = '', 
  disabled,
  isLoading,
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== 'md' ? `btn-${size}` : '';
  
  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin w-4 h-4 mr-2 inline-block" />
      ) : (
        icon && <span className="btn-icon-wrapper">{icon}</span>
      )}
      {children}
    </button>
  );
};
