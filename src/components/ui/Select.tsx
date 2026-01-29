import { SelectHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helperText?: string;
    options: SelectOption[];
    placeholder?: string;
    fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    (
        {
            label,
            error,
            helperText,
            options,
            placeholder,
            fullWidth = false,
            className,
            id,
            ...props
        },
        ref
    ) => {
        const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className={clsx('flex flex-col gap-1', fullWidth && 'w-full')}>
                {label && (
                    <label
                        htmlFor={selectId}
                        className="text-sm font-medium text-gray-700"
                    >
                        {label}
                        {props.required && <span className="text-danger-500 ml-1">*</span>}
                    </label>
                )}
                <select
                    ref={ref}
                    id={selectId}
                    className={clsx(
                        'px-3 py-2 border rounded-lg text-gray-900 bg-white',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                        'disabled:bg-gray-100 disabled:cursor-not-allowed',
                        error
                            ? 'border-danger-500 focus:ring-danger-500'
                            : 'border-gray-300',
                        fullWidth && 'w-full',
                        className
                    )}
                    aria-invalid={!!error}
                    aria-describedby={
                        error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
                    }
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p id={`${selectId}-error`} className="text-sm text-danger-600" role="alert">
                        {error}
                    </p>
                )}
                {helperText && !error && (
                    <p id={`${selectId}-helper`} className="text-sm text-gray-500">
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';
