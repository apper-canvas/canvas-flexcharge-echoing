import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "react-toastify";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";

const ProductForm = ({ 
  product, 
  onSave, 
  onCancel,
  billingModel = null 
}) => {
const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category: '',
    status: 'active',
    price: '',
    comparePrice: '',
    creditsRequired: '',
    modelType: billingModel?.type || 'one-time',
    // One-time purchase specific fields
    deliveryMethod: 'download',
    downloadLimit: '5',
    downloadExpiration: '24h',
    emailTemplate: '',
    fileSizeLimit: '10',
    accountDuration: 'lifetime',
    deviceLimit: '3',
    licenseType: 'personal',
    generateLicenseKey: false,
    activationRequired: false,
    allowPreorders: false,
    partialPayments: false,
    minimumDeposit: '',
    refundPolicy: 'none',
    refundPeriod: '7',
    customRefundText: '',
    ...product
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'digital-products', label: 'Digital Products' },
    { value: 'software', label: 'Software' },
    { value: 'services', label: 'Services' },
    { value: 'templates', label: 'Templates' },
    { value: 'tools', label: 'Tools' },
    { value: 'other', label: 'Other' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }
    
    if (formData.modelType === 'one-time' && !formData.price) {
      newErrors.price = 'Price is required for one-time products';
    }
    
    if (formData.modelType === 'credit' && !formData.creditsRequired) {
      newErrors.creditsRequired = 'Credits required is mandatory for credit products';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      toast.success(product ? 'Product updated successfully' : 'Product created successfully');
    } catch (error) {
      toast.error('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

const renderModelSpecificFields = () => {
    switch (formData.modelType) {
      case 'one-time':
        return (
          <div className="space-y-6">
            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                error={errors.price}
                placeholder="0.00"
                required
              />
              <FormField
                label="Compare Price"
                type="number"
                value={formData.comparePrice}
                onChange={(e) => handleChange('comparePrice', e.target.value)}
                placeholder="0.00"
              />
            </div>

            {/* Delivery Method */}
            <div>
              <FormField
                label="Delivery Method"
                type="select"
                value={formData.deliveryMethod}
                onChange={(e) => handleChange('deliveryMethod', e.target.value)}
              >
                <option value="download">Instant Download</option>
                <option value="email">Email Delivery</option>
                <option value="account">Account-Based Access</option>
                <option value="api">API/Webhook</option>
                <option value="none">No Delivery</option>
              </FormField>
              
              {formData.deliveryMethod === 'download' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormField
                    label="Download Limit"
                    type="number"
                    value={formData.downloadLimit}
                    onChange={(e) => handleChange('downloadLimit', e.target.value)}
                    placeholder="5"
                  />
                  <FormField
                    label="Download Expiration"
                    type="select"
                    value={formData.downloadExpiration}
                    onChange={(e) => handleChange('downloadExpiration', e.target.value)}
                  >
                    <option value="24h">24 Hours</option>
                    <option value="7d">7 Days</option>
                    <option value="30d">30 Days</option>
                    <option value="never">Never</option>
                  </FormField>
                </div>
              )}
              
              {formData.deliveryMethod === 'email' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormField
                    label="Email Template"
                    value={formData.emailTemplate}
                    onChange={(e) => handleChange('emailTemplate', e.target.value)}
                    placeholder="Custom email template"
                  />
                  <FormField
                    label="File Size Limit (MB)"
                    type="number"
                    value={formData.fileSizeLimit}
                    onChange={(e) => handleChange('fileSizeLimit', e.target.value)}
                    placeholder="10"
                  />
                </div>
              )}
              
              {formData.deliveryMethod === 'account' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormField
                    label="Account Duration"
                    type="select"
                    value={formData.accountDuration}
                    onChange={(e) => handleChange('accountDuration', e.target.value)}
                  >
                    <option value="lifetime">Lifetime</option>
                    <option value="1y">1 Year</option>
                    <option value="6m">6 Months</option>
                    <option value="custom">Custom</option>
                  </FormField>
                  <FormField
                    label="Device Limit"
                    type="number"
                    value={formData.deviceLimit}
                    onChange={(e) => handleChange('deviceLimit', e.target.value)}
                    placeholder="3"
                  />
                </div>
              )}
            </div>

            {/* Licensing */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Licensing</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="License Type"
                  type="select"
                  value={formData.licenseType}
                  onChange={(e) => handleChange('licenseType', e.target.value)}
                >
                  <option value="personal">Personal</option>
                  <option value="commercial">Commercial</option>
                  <option value="extended">Extended</option>
                  <option value="custom">Custom</option>
                </FormField>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.generateLicenseKey}
                      onChange={(e) => handleChange('generateLicenseKey', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Generate License Keys</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.activationRequired}
                      onChange={(e) => handleChange('activationRequired', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Activation Required</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Payment Options</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.allowPreorders}
                      onChange={(e) => handleChange('allowPreorders', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Allow Pre-orders</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.partialPayments}
                      onChange={(e) => handleChange('partialPayments', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Partial Payments</span>
                  </label>
                </div>
                {formData.partialPayments && (
                  <FormField
                    label="Minimum Deposit"
                    type="number"
                    value={formData.minimumDeposit}
                    onChange={(e) => handleChange('minimumDeposit', e.target.value)}
                    placeholder="0.00"
                  />
                )}
              </div>
            </div>

            {/* Refund Policy */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Refund Policy</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Refund Policy"
                  type="select"
                  value={formData.refundPolicy}
                  onChange={(e) => handleChange('refundPolicy', e.target.value)}
                >
                  <option value="none">No Refunds</option>
                  <option value="7d">7 Days</option>
                  <option value="14d">14 Days</option>
                  <option value="30d">30 Days</option>
                  <option value="custom">Custom</option>
                </FormField>
                {formData.refundPolicy === 'custom' && (
                  <FormField
                    label="Custom Period (days)"
                    type="number"
                    value={formData.refundPeriod}
                    onChange={(e) => handleChange('refundPeriod', e.target.value)}
                    placeholder="7"
                  />
                )}
              </div>
              {formData.refundPolicy !== 'none' && (
                <FormField
                  label="Refund Policy Text"
                  value={formData.customRefundText}
                  onChange={(e) => handleChange('customRefundText', e.target.value)}
                  placeholder="Enter custom refund policy text"
                />
              )}
            </div>
          </div>
        );
      
      case 'credit':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Credits Required"
              type="number"
              value={formData.creditsRequired}
              onChange={(e) => handleChange('creditsRequired', e.target.value)}
              error={errors.creditsRequired}
              placeholder="1"
              required
            />
            <FormField
              label="Rate Override"
              type="number"
              value={formData.rateOverride}
              onChange={(e) => handleChange('rateOverride', e.target.value)}
              placeholder="Custom rate per credit"
            />
          </div>
        );
      
      case 'usage':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Base Fee"
              type="number"
              value={formData.baseFee}
              onChange={(e) => handleChange('baseFee', e.target.value)}
              placeholder="0.00"
            />
            <FormField
              label="Per Unit Rate"
              type="number"
              value={formData.perUnitRate}
              onChange={(e) => handleChange('perUnitRate', e.target.value)}
              placeholder="0.01"
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          {billingModel && (
            <div className="text-sm text-gray-600">
              Model: <span className="font-medium capitalize">{billingModel.type}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Product Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            placeholder="Enter product name"
            required
          />
          
          <FormField
            label="SKU"
            value={formData.sku}
            onChange={(e) => handleChange('sku', e.target.value)}
            error={errors.sku}
            placeholder="Enter SKU"
            required
          />
        </div>

        <FormField
          label="Description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter product description"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Category"
            type="select"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            options={categories}
          >
            <option value="">Select category</option>
          </FormField>
          
          <FormField
            label="Status"
            type="select"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </FormField>
        </div>

        {renderModelSpecificFields()}

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProductForm;