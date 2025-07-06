import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon,
  className,
  ...props 
}) => {
  const getChangeColor = (type) => {
    switch (type) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getChangeIcon = (type) => {
    switch (type) {
      case 'positive':
        return 'TrendingUp';
      case 'negative':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  return (
    <Card className={cn("p-6", className)} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          {change && (
            <div className={cn("flex items-center text-sm", getChangeColor(changeType))}>
              <ApperIcon name={getChangeIcon(changeType)} className="h-4 w-4 mr-1" />
              {change}
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0">
            <div className="p-3 bg-secondary/10 rounded-lg">
              <ApperIcon name={icon} className="h-6 w-6 text-secondary" />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MetricCard;