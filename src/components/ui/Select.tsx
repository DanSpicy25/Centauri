import { SelectHTMLAttributes, forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, error, options, id, className = '', disabled, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const helperId = `${selectId}-helper`;
    const errorId = `${selectId}-error`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-[#141413]">
            {label}
            {props.required && <span className="text-[#DC2626] ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={`w-full appearance-none px-3.5 py-2 pr-10 text-sm bg-white text-[#141413] border rounded-lg transition-colors
              disabled:bg-[#F5F4EF] disabled:cursor-not-allowed
              focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#7C3AED]
              ${error ? 'border-[#DC2626] focus-visible:outline-[#DC2626]' : 'border-[#D1CEBF] hover:border-[#B5B2A1]'}
              ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-[#5C5B56] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
        </div>
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

Select.displayName = 'Select';

