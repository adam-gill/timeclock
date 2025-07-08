import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "font-semibold rounded-lg transition-all duration-150 focus:outline-none focus:ring-2",
          
          // Size variants
          {
            'px-3 py-1 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
          },
          
          // Color variants
          {
            'bg-blue-600 hover:bg-blue-700 text-white shadow-lg focus:ring-blue-500': variant === 'primary',
            'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500': variant === 'secondary',
            'text-white hover:bg-white/10 focus:ring-white/20': variant === 'ghost',
          },
          
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };