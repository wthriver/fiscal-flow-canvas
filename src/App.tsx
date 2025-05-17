
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import AppLayout from './components/layout/AppLayout';
import { CompanyProvider } from './contexts/CompanyContext';

// Import pages
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Invoices from './pages/Invoices';
import Inventory from './pages/Inventory';
import Projects from './pages/Projects';
import Reports from './pages/Reports';
import Accounting from './pages/Accounting';
import Banking from './pages/Banking';
import TimeTracking from './pages/TimeTracking';
import Settings from './pages/Settings';
import Taxes from './pages/Taxes';
import ChartOfAccounts from './pages/ChartOfAccounts';
import Budgeting from './pages/Budgeting';
import Expenses from './pages/Expenses';
import Payroll from './pages/Payroll';
import Sales from './pages/Sales';

const App = () => {
  return (
    <CompanyProvider>
      <Router>
        <Toaster position="top-right" closeButton />
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/accounting" element={<Accounting />} />
            <Route path="/banking" element={<Banking />} />
            <Route path="/time-tracking" element={<TimeTracking />} />
            <Route path="/taxes" element={<Taxes />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/chart-of-accounts" element={<ChartOfAccounts />} />
            <Route path="/budgeting" element={<Budgeting />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/payroll" element={<Payroll />} />
            <Route path="/sales" element={<Sales />} />
          </Route>
        </Routes>
      </Router>
    </CompanyProvider>
  );
};

export default App;
