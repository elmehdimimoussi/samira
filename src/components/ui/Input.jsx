import React, { forwardRef } from 'react';

export const Input = forwardRef(({
    label,
    error,
    icon,
    className = '',
    type = 'text',
    containerClassName = '',
    ...props
}, ref) => {
    return (
        <div className={`form-group ${containerClassName}`}>
            {label && <label className="form-label">{label}</label>}

            <div className={icon ? 'input-group' : ''}>
                {icon && <span className="input-group-icon">{icon}</span>}
                <input
                    ref={ref}
                    type={type}
                    className={`form-input ${error ? 'border-danger' : ''} ${className}`}
                    {...props}
                />
            </div>

            {error && <p className="form-error">{error}</p>}
        </div>
    );
});

export const Textarea = forwardRef(({
    label,
    error,
    className = '',
    containerClassName = '',
    rows = 3,
    ...props
}, ref) => {
    return (
        <div className={`form-group ${containerClassName}`}>
            {label && <label className="form-label">{label}</label>}

            <textarea
                ref={ref}
                rows={rows}
                className={`form-textarea ${error ? 'border-danger' : ''} ${className}`}
                {...props}
            />

            {error && <p className="form-error">{error}</p>}
        </div>
    );
});
