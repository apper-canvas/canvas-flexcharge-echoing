import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import Dashboard from '@/components/pages/Dashboard';
import Onboarding from '@/components/pages/Onboarding';
import BillingModels from '@/components/pages/BillingModels';
import Products from '@/components/pages/Products';
import Customers from '@/components/pages/Customers';
import Orders from '@/components/pages/Orders';
import Settings from '@/components/pages/Settings';
import { useLocalStorage } from '@/hooks/useLocalStorage';

function App() {
  const [isOnboarded] = useLocalStorage('flexcharge-onboarded', false);

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={<Layout />}>
            <Route index element={isOnboarded ? <Dashboard /> : <Onboarding />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="billing-models" element={<BillingModels />} />
            <Route path="products" element={<Products />} />
            <Route path="customers" element={<Customers />} />
            <Route path="orders" element={<Orders />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;