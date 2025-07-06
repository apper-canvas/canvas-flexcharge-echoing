import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import { customerService } from '@/services/api/customerService';
import { toast } from 'react-toastify';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm]);

  const loadCustomers = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (err) {
      setError('Failed to load customers');
      console.error('Error loading customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = customers;
    
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredCustomers(filtered);
  };

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
  };

  const getCustomerStats = (customer) => {
    const totalOrders = customer.orders?.length || 0;
    const totalSpent = customer.orders?.reduce((sum, order) => sum + order.amount, 0) || 0;
    const lastOrder = customer.orders?.[0];
    
    return {
      totalOrders,
      totalSpent,
      lastOrder
    };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        </div>
        <Loading type="table" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        </div>
        <Error
          message="Failed to load customers"
          description={error}
          onRetry={loadCustomers}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">
            Manage your customer relationships and order history
          </p>
        </div>
        <Button variant="primary">
          <ApperIcon name="UserPlus" className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <SearchBar
            placeholder="Search customers..."
            onSearch={setSearchTerm}
            className="w-full sm:w-80"
          />
          <div className="text-sm text-gray-600">
            {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''}
          </div>
        </div>
      </Card>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customers List */}
        <div className="lg:col-span-2">
          {filteredCustomers.length === 0 ? (
            <Empty
              title="No Customers Found"
              description={
                customers.length === 0
                  ? "Your customer list is empty. Add your first customer to get started."
                  : "No customers match your search criteria"
              }
              actionText="Add Customer"
              onAction={() => toast.info('Add customer feature coming soon')}
              icon="Users"
            />
          ) : (
            <Card className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => {
                const stats = getCustomerStats(customer);
                return (
                  <motion.div
                    key={customer.Id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                      selectedCustomer?.Id === customer.Id ? 'bg-secondary/5 border-l-4 border-secondary' : ''
                    }`}
                    onClick={() => handleCustomerClick(customer)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {customer.name}
                          </h3>
                          <p className="text-sm text-gray-600">{customer.email}</p>
                          {customer.creditBalance > 0 && (
                            <Badge variant="accent" size="sm" className="mt-1">
                              {customer.creditBalance} credits
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          ${stats.totalSpent.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          {stats.totalOrders} order{stats.totalOrders !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </Card>
          )}
        </div>

        {/* Customer Details Sidebar */}
        <div className="lg:col-span-1">
          {selectedCustomer ? (
            <Card className="p-6 sticky top-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-xl">
                    {selectedCustomer.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-gray-600">{selectedCustomer.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total Orders:</span>
                  <span className="text-sm text-gray-900">
                    {selectedCustomer.orders?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total Spent:</span>
                  <span className="text-sm text-gray-900">
                    ${selectedCustomer.orders?.reduce((sum, order) => sum + order.amount, 0).toLocaleString() || 0}
                  </span>
                </div>
                {selectedCustomer.creditBalance > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Credit Balance:</span>
                    <Badge variant="accent" size="sm">
                      {selectedCustomer.creditBalance} credits
                    </Badge>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-4">Recent Orders</h4>
                {selectedCustomer.orders?.length > 0 ? (
                  <div className="space-y-3">
                    {selectedCustomer.orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-900">Order #{order.id}</p>
                          <p className="text-xs text-gray-500">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ${order.amount.toLocaleString()}
                          </p>
                          <Badge variant="success" size="sm">
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No orders found</p>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button variant="primary" className="w-full mb-2">
                  <ApperIcon name="Mail" className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="secondary" className="w-full">
                  <ApperIcon name="FileText" className="h-4 w-4 mr-2" />
                  View Full History
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-6 sticky top-6">
              <div className="text-center">
                <ApperIcon name="User" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a Customer
                </h3>
                <p className="text-sm text-gray-600">
                  Click on a customer to view their details and order history
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;