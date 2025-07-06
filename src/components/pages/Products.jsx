import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import SearchBar from '@/components/molecules/SearchBar';
import StatusBadge from '@/components/molecules/StatusBadge';
import ProductForm from '@/components/organisms/ProductForm';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import { productService } from '@/services/api/productService';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'react-toastify';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [billingModels] = useLocalStorage('flexcharge-billing-models', []);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, statusFilter]);

  const loadProducts = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;
    
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(product => product.status === statusFilter);
    }
    
    setFilteredProducts(filtered);
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        const updated = await productService.update(editingProduct.Id, productData);
        setProducts(products.map(p => p.Id === editingProduct.Id ? updated : p));
        toast.success('Product updated successfully');
      } else {
        const newProduct = await productService.create(productData);
        setProducts([...products, newProduct]);
        toast.success('Product created successfully');
      }
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      toast.error('Failed to save product');
      throw err;
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.delete(productId);
        setProducts(products.filter(p => p.Id !== productId));
        toast.success('Product deleted successfully');
      } catch (err) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleToggleStatus = async (product) => {
    try {
      const newStatus = product.status === 'active' ? 'inactive' : 'active';
      const updated = await productService.update(product.Id, { ...product, status: newStatus });
      setProducts(products.map(p => p.Id === product.Id ? updated : p));
      toast.success(`Product ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
    } catch (err) {
      toast.error('Failed to update product status');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        </div>
        <Loading type="table" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        </div>
        <Error
          message="Failed to load products"
          description={error}
          onRetry={loadProducts}
        />
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h1>
          <Button
            variant="secondary"
            onClick={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
          >
            <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">
            Manage your product catalog and pricing
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
          disabled={billingModels.length === 0}
        >
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <SearchBar
            placeholder="Search products..."
            onSearch={setSearchTerm}
            className="w-full sm:w-80"
          />
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
            <div className="text-sm text-gray-600">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </Card>

      {/* Products List */}
      {filteredProducts.length === 0 ? (
        <Empty
          title="No Products Found"
          description={
            products.length === 0
              ? "Get started by adding your first product"
              : "No products match your search criteria"
          }
          actionText="Add Product"
          onAction={() => setShowForm(true)}
          icon="Package"
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pricing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <motion.tr
                    key={product.Id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          SKU: {product.sku}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">
                        {product.modelType?.replace('-', ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.price ? `$${product.price}` : 
                         product.creditsRequired ? `${product.creditsRequired} credits` :
                         'Variable'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(product)}
                        className="hover:scale-105 transition-transform duration-200"
                      >
                        <StatusBadge status={product.status} />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                        >
                          <ApperIcon name="Edit" className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.Id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <ApperIcon name="Trash2" className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* No Billing Models Warning */}
      {billingModels.length === 0 && (
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center space-x-3">
            <ApperIcon name="AlertTriangle" className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                No billing models configured
              </p>
              <p className="text-sm text-yellow-700">
                Configure your billing models first to add products.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Products;