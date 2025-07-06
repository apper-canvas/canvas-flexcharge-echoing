import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const Empty = ({ 
  title = "No data found", 
  description,
  actionText,
  onAction,
  icon = "Package",
  className 
}) => {
  return (
    <Card className={cn("p-8 text-center", className)}>
      <div className="flex flex-col items-center space-y-4">
        <div className="p-4 bg-gray-50 rounded-full">
          <ApperIcon name={icon} className="h-12 w-12 text-gray-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="text-gray-600 max-w-md">{description}</p>
          )}
        </div>
        {actionText && onAction && (
          <Button onClick={onAction} variant="primary">
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            {actionText}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Empty;