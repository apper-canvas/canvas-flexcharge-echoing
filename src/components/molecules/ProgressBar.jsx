import { cn } from '@/utils/cn';

const ProgressBar = ({ 
  currentStep = 1, 
  totalSteps = 4, 
  steps = [],
  className 
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-2">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={cn(
              "flex items-center text-sm font-medium",
              index + 1 <= currentStep ? "text-secondary" : "text-gray-400"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center mr-2",
              index + 1 <= currentStep 
                ? "bg-secondary text-white" 
                : "bg-gray-200 text-gray-400"
            )}>
              {index + 1}
            </div>
            <span className="hidden sm:inline">{step}</span>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-secondary to-secondary/90 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;