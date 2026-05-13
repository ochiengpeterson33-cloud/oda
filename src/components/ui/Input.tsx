import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-earth-brown mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-earth-gray">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "flex w-full rounded-lg border border-earth-sand/30 bg-[#F5F0E6]/20 py-2.5 px-4 text-sm text-earth-brown outline-none transition-all placeholder:text-earth-gray focus:border-earth-olive focus:ring-1 focus:ring-earth-olive/20 disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-10",
              error && "border-earth-terracotta focus:border-earth-terracotta focus:ring-earth-terracotta",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-earth-terracotta">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
