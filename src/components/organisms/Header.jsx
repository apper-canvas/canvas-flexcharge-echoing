import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { useLocation } from 'react-router-dom';
import MobileSidebar from '@/components/organisms/MobileSidebar';

const Header = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/':
      case '/dashboard':
        return 'Dashboard';
      case '/billing-models':
        return 'Billing Models';
      case '/products':
        return 'Products';
      case '/customers':
        return 'Customers';
      case '/orders':
        return 'Orders';
      case '/settings':
        return 'Settings';
      default:
        return 'FlexCharge';
    }
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    if (segments.length === 0) return ['Dashboard'];
    
    return segments.map(segment => 
      segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ')
    );
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <ApperIcon name="Menu" className="h-6 w-6" />
            </Button>
          </div>

          {/* Page title and breadcrumbs */}
          <div className="flex-1 lg:flex-initial">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {getPageTitle()}
            </h1>
            <nav className="flex space-x-2 text-sm text-gray-500">
              {getBreadcrumbs().map((crumb, index) => (
                <span key={index} className="flex items-center">
                  {index > 0 && <ApperIcon name="ChevronRight" className="h-4 w-4 mx-1" />}
                  <span className={index === getBreadcrumbs().length - 1 ? "text-secondary font-medium" : ""}>
                    {crumb}
                  </span>
                </span>
              ))}
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <ApperIcon name="Bell" className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <ApperIcon name="HelpCircle" className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <MobileSidebar 
            isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;