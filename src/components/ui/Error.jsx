import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const Error = ({ 
  message = "Something went wrong", 
  description,
  onRetry,
  className 
}) => {
  return (
    <Card className={cn("p-8 text-center", className)}>
      <div className="flex flex-col items-center space-y-4">
        <div className="p-4 bg-red-50 rounded-full">
          <ApperIcon name="AlertCircle" className="h-12 w-12 text-red-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">{message}</h3>
          {description && (
            <p className="text-gray-600 max-w-md">{description}</p>
          )}
        </div>
        {onRetry && (
          <Button onClick={onRetry} variant="secondary">
            <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Error;