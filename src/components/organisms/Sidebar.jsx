import { NavLink, useLocation } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const Sidebar = () => {
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
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-secondary to-accent rounded-lg flex items-center justify-center">
            <ApperIcon name="Zap" className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold gradient-text">FlexCharge</h1>
        </div>
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
    </div>
  );
};

export default Sidebar;