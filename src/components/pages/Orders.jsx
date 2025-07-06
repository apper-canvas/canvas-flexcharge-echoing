import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import SearchBar from '@/components/molecules/SearchBar';
import StatusBadge from '@/components/molecules/StatusBadge';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import { orderService } from '@/services/api/orderService';
import { toast } from 'react-toastify';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const loadOrders = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await orderService.getAll();
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error loading orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;
    
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toString().includes(searchTerm) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    setFilteredOrders(filtered);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const updated = await orderService.update(orderId, { status: newStatus });
      setOrders(orders.map(order => order.Id === orderId ? updated : order));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        </div>
        <Loading type="table" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        </div>
        <Error
          message="Failed to load orders"
          description={error}
          onRetry={loadOrders}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">
            Track and manage your order transactions
          </p>
        </div>
        <Button variant="primary">
          <ApperIcon name="Download" className="h-4 w-4 mr-2" />
          Export Orders
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <SearchBar
            placeholder="Search orders..."
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
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="text-sm text-gray-600">
              {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </Card>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2">
          {filteredOrders.length === 0 ? (
            <Empty
              title="No Orders Found"
              description={
                orders.length === 0
                  ? "Your order history is empty. Orders will appear here once customers make purchases."
                  : "No orders match your search criteria"
              }
              icon="ShoppingCart"
            />
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <motion.tr
                        key={order.Id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                          selectedOrder?.Id === order.Id ? 'bg-secondary/5' : ''
                        }`}
                        onClick={() => handleOrderClick(order)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{order.id}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.modelType}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {order.customerName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customerEmail}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {order.productName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${order.amount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>

        {/* Order Details Sidebar */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <Card className="p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Order #{selectedOrder.id}
                </h3>
                <StatusBadge status={selectedOrder.status} />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Customer</label>
                  <p className="text-sm text-gray-900">{selectedOrder.customerName}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.customerEmail}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Product</label>
                  <p className="text-sm text-gray-900">{selectedOrder.productName}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Billing Model</label>
                  <p className="text-sm text-gray-900 capitalize">{selectedOrder.modelType}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Amount</label>
                  <p className="text-lg font-semibold text-gray-900">
                    ${selectedOrder.amount.toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <p className="text-sm text-gray-900">
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-4">Quick Actions</h4>
                <div className="space-y-2">
                  {selectedOrder.status === 'pending' && (
                    <Button
                      variant="accent"
                      size="sm"
                      className="w-full"
                      onClick={() => handleUpdateOrderStatus(selectedOrder.Id, 'completed')}
                    >
                      Mark as Completed
                    </Button>
                  )}
                  {selectedOrder.status === 'pending' && (
                    <Button
                      variant="danger"
                      size="sm"
                      className="w-full"
                      onClick={() => handleUpdateOrderStatus(selectedOrder.Id, 'cancelled')}
                    >
                      Cancel Order
                    </Button>
                  )}
                  <Button variant="secondary" size="sm" className="w-full">
                    <ApperIcon name="Mail" className="h-4 w-4 mr-2" />
                    Send Receipt
                  </Button>
                  <Button variant="secondary" size="sm" className="w-full">
                    <ApperIcon name="Download" className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 sticky top-6">
              <div className="text-center">
                <ApperIcon name="ShoppingCart" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select an Order
                </h3>
                <p className="text-sm text-gray-600">
                  Click on an order to view details and manage the transaction
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;