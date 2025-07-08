import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={inputId} className="text-white font-medium">
            {label}
            {helperText && (
              <span className="text-gray-400 text-xs ml-1">({helperText})</span>
            )}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "rounded-lg px-3 py-2 bg-gray-800 text-white border border-gray-600",
            "focus:outline-none focus:ring-2 focus:ring-blue-500",
            "transition-colors duration-150",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-red-400 text-sm">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };