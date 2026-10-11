import { InputHTMLAttributes, forwardRef, useId } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  helperText?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, helperText, error, id, className = '', disabled, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;
    const errorId = `${checkboxId}-error`;

    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={checkboxId} className="inline-flex items-start gap-2.5 cursor-pointer select-none">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            disabled={disabled}
            aria-invalid={!!error}
            className={`mt-0.5 w-4 h-4 rounded border-[#D1CEBF] text-[#7C3AED] accent-[#7C3AED]
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]
              disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-[#141413] leading-snug">{label}</span>
            {helperText && <span className="text-xs text-[#5C5B56] mt-0.5">{helperText}</span>}
          </div>
        </label>
        {error && (
          <p id={errorId} className="text-xs text-[#DC2626] font-medium ml-6.5" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

