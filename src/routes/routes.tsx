
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Invoices from '@/pages/Invoices';
import Expenses from '@/pages/Expenses';
import Banking from '@/pages/Banking';
import Accounting from '@/pages/Accounting';
import AdvancedAccounting from '@/pages/AdvancedAccounting';
import Payroll from '@/pages/Payroll';
import AdvancedPayroll from '@/pages/AdvancedPayroll';
import Reports from '@/pages/Reports';
import AdvancedReporting from '@/pages/AdvancedReporting';
import Budgeting from '@/pages/Budgeting';
import Customers from '@/pages/Customers';
import Inventory from '@/pages/Inventory';
import Projects from '@/pages/Projects';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/invoices" element={<Invoices />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/banking" element={<Banking />} />
      <Route path="/accounting" element={<Accounting />} />
      <Route path="/advanced-accounting" element={<AdvancedAccounting />} />
      <Route path="/payroll" element={<Payroll />} />
      <Route path="/advanced-payroll" element={<AdvancedPayroll />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/advanced-reporting" element={<AdvancedReporting />} />
      <Route path="/budgeting" element={<Budgeting />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
