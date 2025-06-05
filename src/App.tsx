
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import AppLayout from './components/layout/AppLayout';
import { CompanyProvider } from './contexts/CompanyContext';

// Import all pages
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CRM from './pages/CRM';
import Invoices from './pages/Invoices';
import Sales from './pages/Sales';
import Banking from './pages/Banking';
import BankingIntegrationPage from './pages/BankingIntegration';
import PaymentProcessing from './pages/PaymentProcessing';
import Accounting from './pages/Accounting';
import Expenses from './pages/Expenses';
import Projects from './pages/Projects';
import AdvancedProjects from './pages/AdvancedProjects';
import TimeTracking from './pages/TimeTracking';
import Inventory from './pages/Inventory';
import Payroll from './pages/Payroll';
import Reports from './pages/Reports';
import Taxes from './pages/Taxes';
import Budgeting from './pages/Budgeting';
import Journal from './pages/Journal';
import UserManagementPage from './pages/UserManagement';
import AuditTrailPage from './pages/AuditTrail';
import MultiCurrency from './pages/MultiCurrency';
import Integrations from './pages/Integrations';
import Settings from './pages/Settings';
import ChartOfAccounts from './pages/ChartOfAccounts';
import PurchaseOrders from './pages/PurchaseOrders';
import FixedAssets from './pages/FixedAssets';
import VendorBills from './pages/VendorBills';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <CompanyProvider>
      <Router>
        <Toaster position="top-right" closeButton />
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            
            {/* Customers & Sales */}
            <Route path="/customers" element={<Customers />} />
            <Route path="/crm" element={<CRM />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/sales" element={<Sales />} />
            
            {/* Money Management */}
            <Route path="/banking" element={<Banking />} />
            <Route path="/banking-integration" element={<BankingIntegrationPage />} />
            <Route path="/payment-processing" element={<PaymentProcessing />} />
            <Route path="/accounting" element={<Accounting />} />
            <Route path="/chart-of-accounts" element={<ChartOfAccounts />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/purchase-orders" element={<PurchaseOrders />} />
            <Route path="/vendor-bills" element={<VendorBills />} />
            <Route path="/fixed-assets" element={<FixedAssets />} />
            
            {/* Tracking & Planning */}
            <Route path="/projects" element={<Projects />} />
            <Route path="/advanced-projects" element={<AdvancedProjects />} />
            <Route path="/time-tracking" element={<TimeTracking />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/payroll" element={<Payroll />} />
            
            {/* Reports & Taxes */}
            <Route path="/reports" element={<Reports />} />
            <Route path="/taxes" element={<Taxes />} />
            <Route path="/budgeting" element={<Budgeting />} />
            <Route path="/journal" element={<Journal />} />
            
            {/* Advanced Features */}
            <Route path="/user-management" element={<UserManagementPage />} />
            <Route path="/audit-trail" element={<AuditTrailPage />} />
            <Route path="/multi-currency" element={<MultiCurrency />} />
            <Route path="/integrations" element={<Integrations />} />
            
            {/* Settings */}
            <Route path="/settings" element={<Settings />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </CompanyProvider>
  );
};

export default App;
