import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import BillingModelGrid from '@/components/organisms/BillingModelGrid';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { billingModelService } from '@/services/api/billingModelService';
import { toast } from 'react-toastify';

const BillingModels = () => {
  const [models, setModels] = useState([]);
  const [selectedModels, setSelectedModels] = useLocalStorage('flexcharge-billing-models', []);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBillingModels();
  }, []);

  const loadBillingModels = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await billingModelService.getAll();
      setModels(data);
    } catch (err) {
      setError('Failed to load billing models');
      console.error('Error loading billing models:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectModel = (model) => {
    const isSelected = selectedModels.some(selected => selected.id === model.id);
    
    if (isSelected) {
      setSelectedModels(selectedModels.filter(selected => selected.id !== model.id));
      toast.info(`${model.name} removed from selection`);
    } else {
      const newModel = {
        ...model,
        isActive: true,
        isPrimary: selectedModels.length === 0, // First model becomes primary
        configuration: {}
      };
      setSelectedModels([...selectedModels, newModel]);
      toast.success(`${model.name} added to selection`);
    }
  };

  const handleConfigureModel = (model) => {
    // For now, just show a configuration modal placeholder
    toast.info(`Configuration for ${model.name} is coming soon`);
  };

  const handleSetPrimary = (modelId) => {
    setSelectedModels(models => 
      models.map(model => ({
        ...model,
        isPrimary: model.id === modelId
      }))
    );
    toast.success('Primary billing model updated');
  };

  const handleRemoveModel = (modelId) => {
    setSelectedModels(models => models.filter(model => model.id !== modelId));
    toast.info('Billing model removed');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Billing Models</h1>
        </div>
        <Loading type="card" rows={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Billing Models</h1>
        </div>
        <Card className="p-8 text-center">
          <ApperIcon name="AlertCircle" className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Models</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadBillingModels} variant="primary">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing Models</h1>
          <p className="text-gray-600">
            Select and configure your billing models to match your business needs
          </p>
        </div>
        {selectedModels.length > 0 && (
          <Button variant="accent">
            <ApperIcon name="CheckCircle" className="h-4 w-4 mr-2" />
            {selectedModels.length} Selected
          </Button>
        )}
      </div>

      {/* Selected Models Summary */}
      {selectedModels.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Billing Models</h3>
          </div>
          <div className="space-y-3">
            {selectedModels.map((model) => (
              <div key={model.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <ApperIcon name="CreditCard" className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 capitalize">{model.name}</h4>
                    <p className="text-sm text-gray-600">
                      {model.isPrimary ? 'Primary Model' : 'Secondary Model'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!model.isPrimary && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSetPrimary(model.id)}
                    >
                      Set Primary
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleConfigureModel(model)}
                  >
                    Configure
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveModel(model.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <ApperIcon name="Trash2" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Model Selection Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Available Models</h3>
          <div className="text-sm text-gray-600">
            Select multiple models to create a hybrid billing system
          </div>
        </div>
        
        {models.length > 0 ? (
          <BillingModelGrid
            models={models}
            selectedModels={selectedModels}
            onSelect={handleSelectModel}
            onConfigure={handleConfigureModel}
          />
        ) : (
          <Empty
            title="No Billing Models Available"
            description="There are no billing models to configure at this time."
            icon="CreditCard"
          />
        )}
      </div>

      {/* Quick Setup Actions */}
      {selectedModels.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-secondary/5 to-accent/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Go Live?</h3>
              <p className="text-gray-600">
                You have {selectedModels.length} billing model{selectedModels.length > 1 ? 's' : ''} configured. 
                Add your first product to start accepting payments.
              </p>
            </div>
            <Button variant="accent" className="flex-shrink-0">
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add First Product
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default BillingModels;