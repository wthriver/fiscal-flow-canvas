
import { Company } from '@/types/company';

export const sampleCompany: Company = {
  id: 'company-1',
  name: 'Sample Business Inc.',
  address: '123 Business St, Business City, BC 12345',
  phone: '(555) 123-4567',
  email: 'info@samplebusiness.com',
  website: 'www.samplebusiness.com',
  taxId: '12-3456789',
  industry: 'Technology',
  
  // Required enhanced properties
  currency: 'USD',
  dateFormat: 'MM/dd/yyyy',
  timeZone: 'America/New_York',
  businessType: 'Corporation',
  accountingMethod: 'Accrual',
  
  // Initialize with empty arrays for all collections
  customers: [],
  invoices: [],
  expenses: [],
  projects: [],
  employees: [],
  bankAccounts: [{
    id: 'bank-1',
    name: 'Main Checking',
    type: 'Checking',
    balance: 25000,
    accountNumber: '****1234',
    routingNumber: '123456789',
    bankName: 'First National Bank',
    transactions: []
  }],
  accounts: [
    {
      id: 'acc-1',
      number: '1000',
      name: 'Cash',
      type: 'Asset',
      balance: 25000,
      description: 'Main cash account'
    },
    {
      id: 'acc-2',
      number: '4000',
      name: 'Revenue',
      type: 'Revenue',
      balance: 0,
      description: 'Main revenue account'
    },
    {
      id: 'acc-3',
      number: '5000',
      name: 'Expenses',
      type: 'Expense',
      balance: 0,
      description: 'General expenses'
    }
  ],
  taxRates: [{
    id: 'tax-1',
    name: 'Sales Tax',
    rate: 8.5,
    isDefault: true,
    description: 'Standard sales tax rate'
  }],
  budgets: [],
  estimates: [],
  timeEntries: [],
  sales: [],
  transactions: [],
  vendors: [],
  purchaseOrders: []
};
