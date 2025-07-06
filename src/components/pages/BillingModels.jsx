import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import BillingModelGrid from "@/components/organisms/BillingModelGrid";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Settings from "@/components/pages/Settings";
import { billingModelService } from "@/services/api/billingModelService";

// One-Time Purchase Configuration Component
const OneTimePurchaseConfig = ({ model, isOpen, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('delivery');
  const [config, setConfig] = useState({
    delivery: {
      method: 'download',
      downloadLimit: 5,
      downloadExpiration: '24h',
      ipRestriction: false,
      emailTemplate: '',
      fileSizeLimit: 10,
      accountDuration: 'lifetime',
      deviceLimit: 3,
      apiEndpoint: '',
      webhookUrl: ''
    },
    licensing: {
      type: 'personal',
      generateKeys: false,
      activationRequired: false,
      allowCommercialUse: false,
      extendedLicense: false,
      customTerms: ''
    },
    payments: {
      allowPreorders: false,
      partialPayments: false,
      minimumDeposit: 0,
      depositPercentage: 50
    },
    refunds: {
      policy: 'none',
      period: 7,
      customText: 'All sales are final. No refunds will be provided.'
    },
    ...model?.configuration
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfigChange = (section, field, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSave(model.Id, config);
      toast.success('Configuration saved successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to save configuration');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'delivery', label: 'Product Delivery', icon: 'Package' },
    { id: 'licensing', label: 'Licensing', icon: 'Key' },
    { id: 'payments', label: 'Payments', icon: 'CreditCard' },
    { id: 'refunds', label: 'Refunds', icon: 'RefreshCw' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Configure One-Time Purchase
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <ApperIcon name="X" className="h-6 w-6" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-140px)]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r p-4">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-secondary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ApperIcon name={tab.icon} className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'delivery' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Delivery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Method
                      </label>
                      <select
                        value={config.delivery.method}
                        onChange={(e) => handleConfigChange('delivery', 'method', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                      >
                        <option value="download">Instant Download</option>
                        <option value="email">Email Delivery</option>
                        <option value="account">Account-Based Access</option>
                        <option value="api">API/Webhook</option>
                        <option value="none">No Delivery</option>
                      </select>
                    </div>
                  </div>

                  {config.delivery.method === 'download' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Download Limit
                        </label>
                        <input
                          type="number"
                          value={config.delivery.downloadLimit}
                          onChange={(e) => handleConfigChange('delivery', 'downloadLimit', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                          placeholder="5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiration
                        </label>
                        <select
                          value={config.delivery.downloadExpiration}
                          onChange={(e) => handleConfigChange('delivery', 'downloadExpiration', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                        >
                          <option value="24h">24 Hours</option>
                          <option value="7d">7 Days</option>
                          <option value="30d">30 Days</option>
                          <option value="never">Never</option>
                        </select>
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={config.delivery.ipRestriction}
                            onChange={(e) => handleConfigChange('delivery', 'ipRestriction', e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm text-gray-700">IP Restriction</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {config.delivery.method === 'email' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Template
                        </label>
                        <textarea
                          value={config.delivery.emailTemplate}
                          onChange={(e) => handleConfigChange('delivery', 'emailTemplate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                          rows="3"
                          placeholder="Custom email template..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          File Size Limit (MB)
                        </label>
                        <select
                          value={config.delivery.fileSizeLimit}
                          onChange={(e) => handleConfigChange('delivery', 'fileSizeLimit', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                        >
                          <option value={10}>10 MB</option>
                          <option value={25}>25 MB</option>
                          <option value={50}>50 MB</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {config.delivery.method === 'account' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Duration
                        </label>
                        <select
                          value={config.delivery.accountDuration}
                          onChange={(e) => handleConfigChange('delivery', 'accountDuration', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                        >
                          <option value="lifetime">Lifetime</option>
                          <option value="1y">1 Year</option>
                          <option value="6m">6 Months</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Device Limit
                        </label>
                        <input
                          type="number"
                          value={config.delivery.deviceLimit}
                          onChange={(e) => handleConfigChange('delivery', 'deviceLimit', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                          placeholder="3"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'licensing' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Licensing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        License Type
                      </label>
                      <select
                        value={config.licensing.type}
                        onChange={(e) => handleConfigChange('licensing', 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                      >
                        <option value="personal">Personal</option>
                        <option value="commercial">Commercial</option>
                        <option value="extended">Extended</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={config.licensing.generateKeys}
                          onChange={(e) => handleConfigChange('licensing', 'generateKeys', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">Generate License Keys</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={config.licensing.activationRequired}
                          onChange={(e) => handleConfigChange('licensing', 'activationRequired', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">Activation Required</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom License Terms
                    </label>
                    <textarea
                      value={config.licensing.customTerms}
                      onChange={(e) => handleConfigChange('licensing', 'customTerms', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                      rows="4"
                      placeholder="Enter custom license terms..."
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Settings</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={config.payments.allowPreorders}
                            onChange={(e) => handleConfigChange('payments', 'allowPreorders', e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm text-gray-700">Allow Pre-orders</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={config.payments.partialPayments}
                            onChange={(e) => handleConfigChange('payments', 'partialPayments', e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm text-gray-700">Enable Partial Payments</span>
                        </label>
                      </div>
                      {config.payments.partialPayments && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Minimum Deposit (%)
                          </label>
                          <input
                            type="number"
                            value={config.payments.depositPercentage}
                            onChange={(e) => handleConfigChange('payments', 'depositPercentage', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="50"
                            min="1"
                            max="100"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'refunds' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Refund Policy</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Refund Policy
                      </label>
                      <select
                        value={config.refunds.policy}
                        onChange={(e) => handleConfigChange('refunds', 'policy', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                      >
                        <option value="none">No Refunds</option>
                        <option value="7d">7 Days</option>
                        <option value="14d">14 Days</option>
                        <option value="30d">30 Days</option>
                        <option value="custom">Custom Period</option>
                      </select>
                    </div>
                    {config.refunds.policy === 'custom' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Custom Period (days)
                        </label>
                        <input
                          type="number"
                          value={config.refunds.period}
                          onChange={(e) => handleConfigChange('refunds', 'period', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                          placeholder="7"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Refund Policy Text
                    </label>
                    <textarea
                      value={config.refunds.customText}
                      onChange={(e) => handleConfigChange('refunds', 'customText', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                      rows="3"
                      placeholder="Enter your refund policy text..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4 p-6 border-t">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </div>
    </div>
  );
};

const BillingModels = () => {
  const [models, setModels] = useState([]);
  const [selectedModels, setSelectedModels] = useLocalStorage('flexcharge-billing-models', []);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [configModal, setConfigModal] = useState({ isOpen: false, model: null });

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
    setConfigModal({ isOpen: true, model });
  };

  const handleSaveConfiguration = async (modelId, configuration) => {
    try {
      await billingModelService.update(modelId, { configuration });
      
      // Update selected models with new configuration
      setSelectedModels(prev => 
        prev.map(m => 
          m.id === modelId || m.Id === modelId 
            ? { ...m, configuration }
            : m
        )
      );
      
      // Update models list
      setModels(prev => 
        prev.map(m => 
          m.id === modelId || m.Id === modelId 
            ? { ...m, configuration }
            : m
        )
      );
      
      setConfigModal({ isOpen: false, model: null });
    } catch (error) {
      throw error;
    }
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

      {/* Configuration Modal */}
      {configModal.model?.type === 'one-time' && (
        <OneTimePurchaseConfig
          model={configModal.model}
          isOpen={configModal.isOpen}
          onClose={() => setConfigModal({ isOpen: false, model: null })}
          onSave={handleSaveConfiguration}
        />
      )}
    </div>
  );
};

export default BillingModels;