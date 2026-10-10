import { InputHTMLAttributes, forwardRef, useId } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, id, className = '', disabled, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#141413]">
            {label}
            {props.required && <span className="text-[#DC2626] ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`w-full px-3.5 py-2 text-sm bg-white text-[#141413] border rounded-lg transition-colors
            placeholder:text-[#8A8881] disabled:bg-[#F5F4EF] disabled:cursor-not-allowed
            focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#C85A32]
            ${error ? 'border-[#DC2626] focus-visible:outline-[#DC2626]' : 'border-[#D1CEBF] hover:border-[#B5B2A1]'}
            ${className}`}
          {...props}
        />
        {error ? (
          <p id={errorId} className="text-xs text-[#DC2626] font-medium" role="alert">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-[#5C5B56]">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

