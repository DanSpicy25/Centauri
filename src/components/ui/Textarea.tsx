import { TextareaHTMLAttributes, forwardRef, useId } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, id, className = '', disabled, rows = 4, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const helperId = `${textareaId}-helper`;
    const errorId = `${textareaId}-error`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-[#141413]">
            {label}
            {props.required && <span className="text-[#DC2626] ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`w-full px-3.5 py-2 text-sm bg-white text-[#141413] border rounded-lg transition-colors
            placeholder:text-[#8A8881] disabled:bg-[#F5F4EF] disabled:cursor-not-allowed
            focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#7C3AED]
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

Textarea.displayName = 'Textarea';

