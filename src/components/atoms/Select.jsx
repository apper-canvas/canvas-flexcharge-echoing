import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Select = forwardRef(({ 
  className,
  options = [],
  error,
  children,
  ...props 
}, ref) => {
  const baseStyles = "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-all duration-200 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20";
  
  const errorStyles = error 
    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
    : "";

  return (
    <select
      className={cn(
        baseStyles,
        errorStyles,
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
});

Select.displayName = "Select";

export default Select;