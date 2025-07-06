import { useState } from 'react';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

const BillingModelCard = ({ 
  model, 
  isSelected, 
  onSelect, 
  onConfigure,
  isConfigured = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getModelIcon = (type) => {
    switch (type) {
      case 'one-time':
        return 'ShoppingCart';
      case 'credit':
        return 'Coins';
      case 'usage':
        return 'Activity';
      case 'marketplace':
        return 'Store';
      case 'milestone':
        return 'Timeline';
      default:
        return 'Package';
    }
  };

  const getModelDescription = (type) => {
    switch (type) {
      case 'one-time':
        return 'Single payment for digital products, downloads, or services';
      case 'credit':
        return 'Pre-purchased credits for pay-per-use services';
      case 'usage':
        return 'Pay-as-you-go based on actual consumption';
      case 'marketplace':
        return 'Multi-vendor platform with commission-based revenue';
      case 'milestone':
        return 'Phased payments tied to project completion';
      default:
        return 'Flexible billing model';
    }
  };

  const getBestFor = (type) => {
    switch (type) {
      case 'one-time':
        return ['Digital downloads', 'Software tools', 'Templates'];
      case 'credit':
        return ['AI tools', 'API access', 'Image generation'];
      case 'usage':
        return ['Cloud services', 'APIs', 'Data processing'];
      case 'marketplace':
        return ['Freelance platforms', 'App stores', 'Marketplaces'];
      case 'milestone':
        return ['Consulting', 'Freelance work', 'Project-based'];
      default:
        return ['Various use cases'];
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={cn(
          "p-6 cursor-pointer transition-all duration-300",
          isSelected ? "ring-2 ring-secondary shadow-lg" : "hover:shadow-lg",
          isConfigured && "border-accent"
        )}
        onClick={() => onSelect(model)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "p-3 rounded-lg transition-colors duration-200",
              isSelected ? "bg-secondary text-white" : "bg-gray-100 text-gray-600"
            )}>
              <ApperIcon name={getModelIcon(model.type)} className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 capitalize">
                {model.name || model.type.replace('-', ' ')}
              </h3>
              {isConfigured && (
                <Badge variant="accent" size="sm">
                  Configured
                </Badge>
              )}
            </div>
          </div>
          {isSelected && (
            <ApperIcon name="Check" className="h-5 w-5 text-secondary" />
          )}
        </div>

        <p className="text-gray-600 mb-4">
          {getModelDescription(model.type)}
        </p>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Best for:</p>
          <div className="flex flex-wrap gap-1">
            {getBestFor(model.type).map((item) => (
              <Badge key={item} variant="default" size="sm">
                {item}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Button
            variant={isSelected ? "primary" : "secondary"}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(model);
            }}
          >
            {isSelected ? "Selected" : "Select"}
          </Button>
          
          {(isSelected || isConfigured) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onConfigure(model);
              }}
            >
              Configure
              <ApperIcon name="Settings" className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default BillingModelCard;