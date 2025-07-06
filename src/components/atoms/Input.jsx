import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Input = forwardRef(({ 
  className, 
  type = 'text', 
  error,
  ...props 
}, ref) => {
  const baseStyles = "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20";
  
  const errorStyles = error 
    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
    : "";

  return (
    <input
      type={type}
      className={cn(
        baseStyles,
        errorStyles,
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;