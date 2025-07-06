import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { cn } from '@/utils/cn';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const MobileSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [billingModels] = useLocalStorage('flexcharge-billing-models', []);

  const baseNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'BarChart3' },
    { name: 'Billing Models', href: '/billing-models', icon: 'CreditCard' },
    { name: 'Products', href: '/products', icon: 'Package' },
    { name: 'Customers', href: '/customers', icon: 'Users' },
    { name: 'Orders', href: '/orders', icon: 'ShoppingCart' },
    { name: 'Settings', href: '/settings', icon: 'Settings' }
  ];

  // Add conditional navigation based on active billing models
  const activeModels = billingModels.filter(model => model.isActive);
  const hasMarketplace = activeModels.some(model => model.type === 'marketplace');
  const hasMilestone = activeModels.some(model => model.type === 'milestone');

  const navigation = [
    ...baseNavigation.slice(0, 5),
    ...(hasMarketplace ? [{ name: 'Vendors', href: '/vendors', icon: 'Store' }] : []),
    ...(hasMilestone ? [{ name: 'Projects', href: '/projects', icon: 'Briefcase' }] : []),
    { name: 'Reports', href: '/reports', icon: 'FileText' },
    baseNavigation[5] // Settings
  ];

  return (
    <div className="lg:hidden fixed inset-0 z-50">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-secondary to-accent rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold gradient-text">FlexCharge</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ApperIcon name="X" className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
                            (item.href === '/dashboard' && location.pathname === '/');
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-secondary text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-50 hover:text-secondary"
                )}
              >
                <ApperIcon name={item.icon} className="h-5 w-5 mr-3" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">Admin User</p>
              <p className="text-xs">admin@flexcharge.com</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MobileSidebar;