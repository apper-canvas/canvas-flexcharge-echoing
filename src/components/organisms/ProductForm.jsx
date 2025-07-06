import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'react-toastify';

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