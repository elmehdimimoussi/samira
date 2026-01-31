import React, { forwardRef, useId } from 'react';

export const Input = forwardRef(({
    label,
    error,
    icon,
    className = '',
    type = 'text',
    containerClassName = '',
    ...props
}, ref) => {
    const uniqueId = useId();
    const inputId = props.id || uniqueId;

    return (
        <div className={`form-group ${containerClassName}`}>
            {label && <label htmlFor={inputId} className="form-label">{label}</label>}

            <div className={icon ? 'input-group' : ''}>
                {icon && <span className="input-group-icon">{icon}</span>}
                <input
                    id={inputId}
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
    const uniqueId = useId();
    const inputId = props.id || uniqueId;

    return (
        <div className={`form-group ${containerClassName}`}>
            {label && <label htmlFor={inputId} className="form-label">{label}</label>}

            <textarea
                id={inputId}
                ref={ref}
                rows={rows}
                className={`form-textarea ${error ? 'border-danger' : ''} ${className}`}
                {...props}
            />

            {error && <p className="form-error">{error}</p>}
        </div>
    );
});
