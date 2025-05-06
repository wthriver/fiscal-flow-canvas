
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Invoices from './pages/Invoices';
import Banking from './pages/Banking';
import Accounting from './pages/Accounting';
import Projects from './pages/Projects';
import Reports from './pages/Reports';
import Sales from './pages/Sales';
import Settings from './pages/Settings';
import TimeTracking from './pages/TimeTracking';
import Expenses from './pages/Expenses';
import Taxes from './pages/Taxes';
import Payroll from './pages/Payroll';
import Inventory from './pages/Inventory';
import Journal from './pages/Journal';
import Budgeting from './pages/Budgeting';
import AuditTrail from './pages/AuditTrail';
import MultiCurrency from './pages/MultiCurrency';
import Integrations from './pages/Integrations';
import NotFound from './pages/NotFound';
import { CompanyProvider } from './contexts/CompanyContext';
import './App.css';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CompanyProvider>
        <Router>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="customers" element={<Customers />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="banking" element={<Banking />} />
              <Route path="accounting" element={<Accounting />} />
              <Route path="projects" element={<Projects />} />
              <Route path="reports" element={<Reports />} />
              <Route path="sales" element={<Sales />} />
              <Route path="settings" element={<Settings />} />
              <Route path="time-tracking" element={<TimeTracking />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="taxes" element={<Taxes />} />
              <Route path="payroll" element={<Payroll />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="journal" element={<Journal />} />
              <Route path="budgeting" element={<Budgeting />} />
              <Route path="audit-trail" element={<AuditTrail />} />
              <Route path="multi-currency" element={<MultiCurrency />} />
              <Route path="integrations" element={<Integrations />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
        <SonnerToaster position="top-right" />
      </CompanyProvider>
    </QueryClientProvider>
  );
}

export default App;
