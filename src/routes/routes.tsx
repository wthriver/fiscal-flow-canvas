
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Invoices from '@/pages/Invoices';
import Expenses from '@/pages/Expenses';
import Banking from '@/pages/Banking';
import Accounting from '@/pages/Accounting';
import Payroll from '@/pages/Payroll';
import Reports from '@/pages/Reports';
import Budgeting from '@/pages/Budgeting';
import Customers from '@/pages/Customers';
import Inventory from '@/pages/Inventory';
import Projects from '@/pages/Projects';
import TimeTracking from '@/pages/TimeTracking';
import Settings from '@/pages/Settings';
import CRM from '@/pages/CRM';
import Integrations from '@/pages/Integrations';
import PurchaseOrders from '@/pages/PurchaseOrders';
import PaymentProcessing from '@/pages/PaymentProcessing';
import Sales from '@/pages/Sales';
import BankingIntegration from '@/pages/BankingIntegration';
import ChartOfAccounts from '@/pages/ChartOfAccounts';
import VendorBills from '@/pages/VendorBills';
import FixedAssets from '@/pages/FixedAssets';
import Taxes from '@/pages/Taxes';
import Journal from '@/pages/Journal';
import UserManagement from '@/pages/UserManagement';
import AuditTrail from '@/pages/AuditTrail';
import MultiCurrency from '@/pages/MultiCurrency';
import NotFound from '@/pages/NotFound';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/invoices" element={<Invoices />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/banking" element={<Banking />} />
      <Route path="/accounting" element={<Accounting />} />
      <Route path="/payroll" element={<Payroll />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/budgeting" element={<Budgeting />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/crm" element={<CRM />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/time-tracking" element={<TimeTracking />} />
      <Route path="/integrations" element={<Integrations />} />
      <Route path="/purchase-orders" element={<PurchaseOrders />} />
      <Route path="/payment-processing" element={<PaymentProcessing />} />
      <Route path="/sales" element={<Sales />} />
      <Route path="/banking-integration" element={<BankingIntegration />} />
      <Route path="/chart-of-accounts" element={<ChartOfAccounts />} />
      <Route path="/vendor-bills" element={<VendorBills />} />
      <Route path="/fixed-assets" element={<FixedAssets />} />
      <Route path="/taxes" element={<Taxes />} />
      <Route path="/journal" element={<Journal />} />
      <Route path="/user-management" element={<UserManagement />} />
      <Route path="/audit-trail" element={<AuditTrail />} />
      <Route path="/multi-currency" element={<MultiCurrency />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
