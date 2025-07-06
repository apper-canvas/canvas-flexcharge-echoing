import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Card = forwardRef(({ 
  className,
  hover = false,
  children,
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden";
  const hoverStyles = hover 
    ? "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer" 
    : "";

  return (
    <div
      className={cn(
        baseStyles,
        hoverStyles,
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;