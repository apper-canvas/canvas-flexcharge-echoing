import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import Loading from '@/components/ui/Loading';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { organizationService } from '@/services/api/organizationService';
import { toast } from 'react-toastify';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('organization');
  const [isLoading, setIsLoading] = useState(false);
  const [organization, setOrganization] = useLocalStorage('flexcharge-organization', null);
  const [formData, setFormData] = useState({
    name: '',
    businessType: '',
    currency: 'USD',
    country: '',
    logo: null,
    ...organization
  });

  const tabs = [
    { id: 'organization', name: 'Organization', icon: 'Building' },
    { id: 'payment', name: 'Payment Processors', icon: 'CreditCard' },
    { id: 'integrations', name: 'Integrations', icon: 'Plug' },
    { id: 'notifications', name: 'Notifications', icon: 'Bell' }
  ];

  const businessTypes = [
    { value: 'saas', label: 'SaaS/Software' },
    { value: 'digital-products', label: 'Digital Products' },
    { value: 'services', label: 'Services' },
    { value: 'marketplace', label: 'Marketplace' },
    { value: 'mixed', label: 'Mixed' }
  ];

  const currencies = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'JPY', label: 'JPY - Japanese Yen' },
    { value: 'CAD', label: 'CAD - Canadian Dollar' },
    { value: 'AUD', label: 'AUD - Australian Dollar' }
  ];

  const countries = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'AU', label: 'Australia' }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveOrganization = async () => {
    setIsLoading(true);
    try {
      const updated = await organizationService.update(organization.id, formData);
      setOrganization(updated);
      toast.success('Organization settings updated successfully');
    } catch (error) {
      toast.error('Failed to update organization settings');
    } finally {
      setIsLoading(false);
    }
  };

  const renderOrganizationSettings = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Organization Settings</h3>
        <Button
          variant="primary"
          onClick={handleSaveOrganization}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Organization Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter organization name"
          required
        />
        
        <FormField
          label="Business Type"
          type="select"
          value={formData.businessType}
          onChange={(e) => handleChange('businessType', e.target.value)}
          required
        >
          <option value="">Select business type</option>
          {businessTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </FormField>

        <FormField
          label="Primary Currency"
          type="select"
          value={formData.currency}
          onChange={(e) => handleChange('currency', e.target.value)}
          required
        >
          {currencies.map(currency => (
            <option key={currency.value} value={currency.value}>
              {currency.label}
            </option>
          ))}
        </FormField>
        
        <FormField
          label="Country"
          type="select"
          value={formData.country}
          onChange={(e) => handleChange('country', e.target.value)}
          required
        >
          <option value="">Select country</option>
          {countries.map(country => (
            <option key={country.value} value={country.value}>
              {country.label}
            </option>
          ))}
        </FormField>
      </div>
    </Card>
  );

  const renderPaymentSettings = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Payment Processors</h3>
        <Button variant="primary">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Processor
        </Button>
      </div>

      <div className="space-y-4">
        <Card className="p-4 border-2 border-dashed border-gray-300">
          <div className="text-center py-8">
            <ApperIcon name="CreditCard" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              No Payment Processors Configured
            </h4>
            <p className="text-gray-600 mb-4">
              Connect payment processors to start accepting payments
            </p>
            <Button variant="secondary">
              Configure Payment Processors
            </Button>
          </div>
        </Card>
      </div>
    </Card>
  );

  const renderIntegrationsSettings = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Integrations</h3>
        <Button variant="primary">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </div>

      <div className="space-y-4">
        <Card className="p-4 border-2 border-dashed border-gray-300">
          <div className="text-center py-8">
            <ApperIcon name="Plug" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              No Integrations Configured
            </h4>
            <p className="text-gray-600 mb-4">
              Connect third-party services to extend functionality
            </p>
            <Button variant="secondary">
              Browse Integrations
            </Button>
          </div>
        </Card>
      </div>
    </Card>
  );

  const renderNotificationsSettings = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
        <Button variant="primary">
          Save Preferences
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-4">Email Notifications</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-secondary focus:ring-secondary" defaultChecked />
              <span className="ml-2 text-sm text-gray-700">New orders</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-secondary focus:ring-secondary" defaultChecked />
              <span className="ml-2 text-sm text-gray-700">Payment received</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-secondary focus:ring-secondary" />
              <span className="ml-2 text-sm text-gray-700">Low credit balance</span>
            </label>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-4">Dashboard Notifications</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-secondary focus:ring-secondary" defaultChecked />
              <span className="ml-2 text-sm text-gray-700">Show recent activity</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-secondary focus:ring-secondary" defaultChecked />
              <span className="ml-2 text-sm text-gray-700">Revenue alerts</span>
            </label>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'organization':
        return renderOrganizationSettings();
      case 'payment':
        return renderPaymentSettings();
      case 'integrations':
        return renderIntegrationsSettings();
      case 'notifications':
        return renderNotificationsSettings();
      default:
        return renderOrganizationSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">
            Manage your organization and system preferences
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Card className="p-1">
        <nav className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-secondary text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ApperIcon name={tab.icon} className="h-4 w-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </Card>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        {renderTabContent()}
      </motion.div>
    </div>
  );
};

export default Settings;