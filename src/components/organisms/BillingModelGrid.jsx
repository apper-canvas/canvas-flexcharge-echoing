import { useState } from 'react';
import { motion } from 'framer-motion';
import BillingModelCard from '@/components/organisms/BillingModelCard';
import { cn } from '@/utils/cn';

const BillingModelGrid = ({ 
  models, 
  selectedModels = [], 
  onSelect, 
  onConfigure,
  className 
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6",
        className
      )}
    >
      {models.map((model, index) => (
        <motion.div key={model.id || index} variants={item}>
          <BillingModelCard
            model={model}
            isSelected={selectedModels.some(selected => selected.id === model.id)}
            onSelect={onSelect}
            onConfigure={onConfigure}
            isConfigured={model.isConfigured}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default BillingModelGrid;