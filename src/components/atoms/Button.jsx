import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Button = forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:ring-secondary/50",
    secondary: "bg-white text-secondary border-2 border-secondary hover:bg-secondary hover:text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 focus:ring-secondary/50",
    accent: "bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:ring-accent/50",
    ghost: "text-gray-600 hover:text-primary hover:bg-gray-50 focus:ring-gray-300",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:ring-red-500/50"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  const disabledStyles = disabled 
    ? "opacity-50 cursor-not-allowed hover:transform-none hover:shadow-none" 
    : "";

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabledStyles,
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;