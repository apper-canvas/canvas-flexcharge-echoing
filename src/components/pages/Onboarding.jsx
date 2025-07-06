import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import ProgressBar from '@/components/molecules/ProgressBar';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'react-toastify';
import { organizationService } from '@/services/api/organizationService';

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [, setIsOnboarded] = useLocalStorage('flexcharge-onboarded', false);
  const [, setOrganization] = useLocalStorage('flexcharge-organization', null);
  
  const [formData, setFormData] = useState({
    name: '',
    businessType: '',
    currency: 'USD',
    country: '',
    logo: null
  });
  
  const [errors, setErrors] = useState({});

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

  const steps = [
    'Organization Setup',
    'Business Details',
    'Billing Configuration',
    'Complete Setup'
  ];

  const validateStep = () => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Organization name is required';
      }
      if (!formData.businessType) {
        newErrors.businessType = 'Business type is required';
      }
    }
    
    if (currentStep === 2) {
      if (!formData.currency) {
        newErrors.currency = 'Currency is required';
      }
      if (!formData.country) {
        newErrors.country = 'Country is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleComplete = async () => {
    if (!validateStep()) return;
    
    try {
      const organization = await organizationService.create({
        ...formData,
        id: Date.now().toString()
      });
      
      setOrganization(organization);
      setIsOnboarded(true);
      toast.success('Organization setup completed successfully!');
      navigate('/billing-models');
    } catch (error) {
      toast.error('Failed to complete setup');
    }
  };

  const handleSkip = () => {
    setIsOnboarded(true);
    navigate('/dashboard');
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to FlexCharge
              </h2>
              <p className="text-gray-600">
                Let's set up your organization to get started
              </p>
            </div>
            
            <FormField
              label="Organization Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={errors.name}
              placeholder="Enter your organization name"
              required
            />
            
            <FormField
              label="Business Type"
              type="select"
              value={formData.businessType}
              onChange={(e) => handleChange('businessType', e.target.value)}
              error={errors.businessType}
              required
            >
              <option value="">Select business type</option>
              {businessTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </FormField>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Business Details
              </h2>
              <p className="text-gray-600">
                Configure your regional and currency settings
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Primary Currency"
                type="select"
                value={formData.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                error={errors.currency}
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
                error={errors.country}
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
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Billing Configuration
              </h2>
              <p className="text-gray-600">
                Choose your billing models to get started
              </p>
            </div>
            
            <Card className="p-6 bg-gradient-to-r from-secondary/5 to-accent/5">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <ApperIcon name="CreditCard" className="h-8 w-8 text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Ready to Configure Billing Models
                  </h3>
                  <p className="text-gray-600">
                    You'll be able to select and configure your billing models in the next step
                  </p>
                </div>
              </div>
            </Card>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="p-4 bg-accent/10 rounded-full mx-auto w-20 h-20 flex items-center justify-center mb-4">
                <ApperIcon name="CheckCircle" className="h-12 w-12 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Setup Complete!
              </h2>
              <p className="text-gray-600">
                Your organization is ready. Let's configure your billing models.
              </p>
            </div>
            
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Organization:</span>
                  <span className="text-sm text-gray-900">{formData.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Business Type:</span>
                  <span className="text-sm text-gray-900 capitalize">
                    {businessTypes.find(t => t.value === formData.businessType)?.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Currency:</span>
                  <span className="text-sm text-gray-900">{formData.currency}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Country:</span>
                  <span className="text-sm text-gray-900">
                    {countries.find(c => c.value === formData.country)?.label}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-8">
          <div className="mb-8">
            <ProgressBar
              currentStep={currentStep}
              totalSteps={4}
              steps={steps}
            />
          </div>
          
          {renderStep()}
          
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-gray-500"
            >
              Skip Setup
            </Button>
            
            <div className="flex space-x-4">
              {currentStep > 1 && (
                <Button
                  variant="secondary"
                  onClick={handlePrev}
                >
                  Previous
                </Button>
              )}
              
              {currentStep < 4 ? (
                <Button
                  variant="primary"
                  onClick={handleNext}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleComplete}
                >
                  Complete Setup
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Onboarding;