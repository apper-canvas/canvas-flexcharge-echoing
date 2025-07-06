import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MetricCard from '@/components/molecules/MetricCard';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Link } from 'react-router-dom';
import { organizationService } from '@/services/api/organizationService';
import { billingModelService } from '@/services/api/billingModelService';
import { productService } from '@/services/api/productService';
import { customerService } from '@/services/api/customerService';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [organization] = useLocalStorage('flexcharge-organization', null);
  const [billingModels] = useLocalStorage('flexcharge-billing-models', []);
  
  const primaryModel = billingModels.find(model => model.isPrimary) || billingModels[0];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [products, customers] = await Promise.all([
        productService.getAll(),
        customerService.getAll()
      ]);
      
      // Calculate metrics
      const totalRevenue = customers.reduce((sum, customer) => {
        return sum + (customer.orders?.reduce((orderSum, order) => orderSum + order.amount, 0) || 0);
      }, 0);
      
      const totalOrders = customers.reduce((sum, customer) => sum + (customer.orders?.length || 0), 0);
      
      setMetrics({
        totalRevenue,
        totalOrders,
        totalCustomers: customers.length,
        totalProducts: products.length
      });
      
      // Mock recent activity
      setRecentActivity([
        { id: 1, type: 'order', description: 'New order received', time: '2 minutes ago' },
        { id: 2, type: 'customer', description: 'New customer registered', time: '1 hour ago' },
        { id: 3, type: 'product', description: 'Product updated', time: '3 hours ago' }
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getModelSpecificMetrics = () => {
    if (!primaryModel) return [];
    
    switch (primaryModel.type) {
      case 'credit':
        return [
          { title: 'Credits Sold', value: '15,420', change: '+12%', changeType: 'positive', icon: 'Coins' },
          { title: 'Credit Balance', value: '$2,340', change: '+5%', changeType: 'positive', icon: 'Wallet' }
        ];
      case 'usage':
        return [
          { title: 'API Calls', value: '142,350', change: '+18%', changeType: 'positive', icon: 'Activity' },
          { title: 'Usage Revenue', value: '$4,230', change: '+22%', changeType: 'positive', icon: 'TrendingUp' }
        ];
      case 'marketplace':
        return [
          { title: 'Commission', value: '$1,250', change: '+15%', changeType: 'positive', icon: 'Percent' },
          { title: 'Vendors', value: '24', change: '+3', changeType: 'positive', icon: 'Store' }
        ];
      case 'milestone':
        return [
          { title: 'Active Projects', value: '8', change: '+2', changeType: 'positive', icon: 'Briefcase' },
          { title: 'Completed', value: '15', change: '+5', changeType: 'positive', icon: 'CheckCircle' }
        ];
      default:
        return [];
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'order':
        return 'ShoppingCart';
      case 'customer':
        return 'Users';
      case 'product':
        return 'Package';
      default:
        return 'Activity';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back to FlexCharge</p>
          </div>
        </div>
        <Loading type="card" rows={4} />
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-secondary/10 rounded-full">
              <ApperIcon name="Zap" className="h-12 w-12 text-secondary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Welcome to FlexCharge</h3>
              <p className="text-gray-600 max-w-md">
                Get started by completing your organization setup and selecting your billing models.
              </p>
            </div>
            <div className="flex space-x-4">
              <Button as={Link} to="/onboarding" variant="primary">
                Complete Setup
              </Button>
              <Button as={Link} to="/billing-models" variant="secondary">
                Configure Billing
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back to {organization.name}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {primaryModel && (
            <div className="text-sm text-gray-600">
              Primary Model: <span className="font-medium capitalize">{primaryModel.type}</span>
            </div>
          )}
          <Button as={Link} to="/products" variant="primary">
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          change="+12% from last month"
          changeType="positive"
          icon="DollarSign"
        />
        <MetricCard
          title="Total Orders"
          value={metrics.totalOrders.toLocaleString()}
          change="+8% from last month"
          changeType="positive"
          icon="ShoppingCart"
        />
        <MetricCard
          title="Customers"
          value={metrics.totalCustomers.toLocaleString()}
          change="+15% from last month"
          changeType="positive"
          icon="Users"
        />
        <MetricCard
          title="Products"
          value={metrics.totalProducts.toLocaleString()}
          change="+3 this month"
          changeType="positive"
          icon="Package"
        />
      </div>

      {/* Model-Specific Metrics */}
      {getModelSpecificMetrics().length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {getModelSpecificMetrics().map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              change={metric.change}
              changeType={metric.changeType}
              icon={metric.icon}
            />
          ))}
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <ApperIcon name={getActivityIcon(activity.type)} className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="space-y-3">
            <Button 
              as={Link} 
              to="/products" 
              variant="ghost" 
              className="w-full justify-start"
            >
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
            <Button 
              as={Link} 
              to="/billing-models" 
              variant="ghost" 
              className="w-full justify-start"
            >
              <ApperIcon name="Settings" className="h-4 w-4 mr-2" />
              Configure Billing
            </Button>
            <Button 
              as={Link} 
              to="/customers" 
              variant="ghost" 
              className="w-full justify-start"
            >
              <ApperIcon name="Users" className="h-4 w-4 mr-2" />
              View Customers
            </Button>
            <Button 
              as={Link} 
              to="/orders" 
              variant="ghost" 
              className="w-full justify-start"
            >
              <ApperIcon name="ShoppingCart" className="h-4 w-4 mr-2" />
              View Orders
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;