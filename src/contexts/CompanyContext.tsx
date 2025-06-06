
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Company, Customer, Invoice, Expense, TaxRate, Account, Transaction, Budget, Estimate, BankAccount, TimeEntry, Project, Sale } from '@/types/company';
import { CompanyContextType } from '@/types/context';

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Mock data with proper structure
const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Ave, Suite 100',
    website: 'https://acme.com',
    taxId: '12-3456789',
    industry: 'Technology',
    fiscalYearStart: '2025-01-01',
    fiscalYear: '2025',
    transactions: [
      {
        id: 'txn-1',
        date: '2025-05-20',
        description: 'Office supplies purchase',
        amount: '250.00',
        category: 'Office Expenses',
        account: 'Checking Account',
        reconciled: false,
        type: 'Withdrawal'
      }
    ],
    accounts: [
      {
        id: 'acc-1',
        number: '1000',
        name: 'Cash',
        type: 'Asset',
        balance: 50000,
        description: 'Main cash account'
      },
      {
        id: 'acc-2',
        number: '1100',
        name: 'Accounts Receivable',
        type: 'Asset',
        balance: 15000,
        description: 'Customer receivables'
      }
    ],
    taxRates: [
      {
        id: 'tax-1',
        name: 'Sales Tax',
        rate: 8.25,
        isDefault: true,
        description: 'Standard sales tax rate'
      }
    ],
    bankAccounts: [
      {
        id: 'bank-1',
        name: 'Main Checking',
        balance: 50000,
        transactions: [],
        type: 'Checking',
        accountNumber: '****1234',
        bankName: 'First National Bank'
      }
    ],
    customers: [
      {
        id: 'cust-1',
        name: 'Tech Solutions Inc',
        email: 'contact@techsolutions.com',
        phone: '+1 (555) 987-6543',
        address: '456 Corporate Blvd',
        company: 'Tech Solutions Inc',
        contactName: 'John Smith',
        type: 'Business',
        status: 'Active',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94105',
        country: 'USA'
      },
      {
        id: 'cust-2',
        name: 'Global Marketing LLC',
        email: 'info@globalmarketing.com',
        phone: '+1 (555) 456-7890',
        address: '789 Market Street',
        company: 'Global Marketing LLC',
        contactName: 'Sarah Johnson',
        type: 'Business',
        status: 'Active',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA'
      }
    ],
    invoices: [
      {
        id: 'inv-1',
        invoiceNumber: 'INV-001',
        customer: 'Tech Solutions Inc',
        customerId: 'cust-1',
        date: '2025-05-15',
        dueDate: '2025-06-15',
        items: [
          {
            id: 'item-1',
            description: 'Web Development Services',
            quantity: 1,
            price: 5000,
            total: 5000
          }
        ],
        status: 'Pending',
        total: 5000,
        amount: '$5,000.00'
      }
    ],
    expenses: [],
    revenue: {
      current: 45000,
      previous: 38000,
      percentChange: 18.4
    },
    profitMargin: {
      value: 23.5,
      trend: 1,
      percentChange: 2.1
    },
    outstandingInvoices: {
      amount: 12500,
      percentChange: -5.2
    },
    activeCustomers: {
      count: 2,
      percentChange: 15.0
    }
  }
];

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<Company[]>(() => {
    const stored = localStorage.getItem('companies');
    return stored ? JSON.parse(stored) : mockCompanies;
  });
  
  const [currentCompanyId, setCurrentCompanyId] = useState<string>(() => {
    return localStorage.getItem('currentCompanyId') || '1';
  });

  const currentCompany = companies.find(c => c.id === currentCompanyId) || companies[0];

  // Persist to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('companies', JSON.stringify(companies));
    localStorage.setItem('currentCompanyId', currentCompanyId);
  }, [companies, currentCompanyId]);

  const updateCompany = (updatedCompany: Company) => {
    setCompanies(prev => prev.map(c => c.id === updatedCompany.id ? updatedCompany : c));
  };

  const switchCompany = (companyId: string) => {
    setCurrentCompanyId(companyId);
  };

  const addCompany = (company: Company) => {
    setCompanies(prev => [...prev, company]);
  };

  // Customer operations
  const addCustomer = (customer: Customer) => {
    const updatedCompany = {
      ...currentCompany,
      customers: [...(currentCompany.customers || []), customer]
    };
    updateCompany(updatedCompany);
  };

  const updateCustomer = (customer: Customer) => {
    const updatedCompany = {
      ...currentCompany,
      customers: (currentCompany.customers || []).map(c => c.id === customer.id ? customer : c)
    };
    updateCompany(updatedCompany);
  };

  const deleteCustomer = (customerId: string) => {
    const updatedCompany = {
      ...currentCompany,
      customers: (currentCompany.customers || []).filter(c => c.id !== customerId)
    };
    updateCompany(updatedCompany);
  };

  // Invoice operations
  const addInvoice = (invoice: Invoice) => {
    const updatedCompany = {
      ...currentCompany,
      invoices: [...(currentCompany.invoices || []), invoice]
    };
    updateCompany(updatedCompany);
  };

  const updateInvoice = (invoice: Invoice) => {
    const updatedCompany = {
      ...currentCompany,
      invoices: (currentCompany.invoices || []).map(i => i.id === invoice.id ? invoice : i)
    };
    updateCompany(updatedCompany);
  };

  const deleteInvoice = (invoiceId: string) => {
    const updatedCompany = {
      ...currentCompany,
      invoices: (currentCompany.invoices || []).filter(i => i.id !== invoiceId)
    };
    updateCompany(updatedCompany);
  };

  // Expense operations
  const addExpense = (expense: Expense) => {
    const updatedCompany = {
      ...currentCompany,
      expenses: [...(currentCompany.expenses || []), expense]
    };
    updateCompany(updatedCompany);
  };

  const updateExpense = (expense: Expense) => {
    const updatedCompany = {
      ...currentCompany,
      expenses: (currentCompany.expenses || []).map(e => e.id === expense.id ? expense : e)
    };
    updateCompany(updatedCompany);
  };

  const deleteExpense = (expenseId: string) => {
    const updatedCompany = {
      ...currentCompany,
      expenses: (currentCompany.expenses || []).filter(e => e.id !== expenseId)
    };
    updateCompany(updatedCompany);
  };

  // Tax operations
  const updateTaxRate = (taxRate: TaxRate) => {
    const updatedCompany = {
      ...currentCompany,
      taxRates: currentCompany.taxRates.map(t => t.id === taxRate.id ? taxRate : t)
    };
    updateCompany(updatedCompany);
  };

  const addTaxRate = (taxRate: TaxRate) => {
    const updatedCompany = {
      ...currentCompany,
      taxRates: [...currentCompany.taxRates, taxRate]
    };
    updateCompany(updatedCompany);
  };

  const deleteTaxRate = (taxRateId: string) => {
    const updatedCompany = {
      ...currentCompany,
      taxRates: currentCompany.taxRates.filter(t => t.id !== taxRateId)
    };
    updateCompany(updatedCompany);
  };

  // Account operations
  const updateAccount = (account: Account) => {
    const updatedCompany = {
      ...currentCompany,
      accounts: currentCompany.accounts.map(a => a.id === account.id ? account : a)
    };
    updateCompany(updatedCompany);
  };

  const addAccount = (account: Account) => {
    const updatedCompany = {
      ...currentCompany,
      accounts: [...currentCompany.accounts, account]
    };
    updateCompany(updatedCompany);
  };

  const deleteAccount = (accountId: string) => {
    const updatedCompany = {
      ...currentCompany,
      accounts: currentCompany.accounts.filter(a => a.id !== accountId)
    };
    updateCompany(updatedCompany);
  };

  // Bank Account operations
  const addBankAccount = (bankAccount: BankAccount) => {
    const updatedCompany = {
      ...currentCompany,
      bankAccounts: [...currentCompany.bankAccounts, bankAccount]
    };
    updateCompany(updatedCompany);
  };

  const updateBankAccount = (bankAccount: BankAccount) => {
    const updatedCompany = {
      ...currentCompany,
      bankAccounts: currentCompany.bankAccounts.map(b => b.id === bankAccount.id ? bankAccount : b)
    };
    updateCompany(updatedCompany);
  };

  const deleteBankAccount = (bankAccountId: string) => {
    const updatedCompany = {
      ...currentCompany,
      bankAccounts: currentCompany.bankAccounts.filter(b => b.id !== bankAccountId)
    };
    updateCompany(updatedCompany);
  };

  // Transaction operations
  const updateTransaction = (transactionId: string, updates: Partial<Transaction>) => {
    const updatedCompany = {
      ...currentCompany,
      transactions: currentCompany.transactions.map(t => 
        t.id === transactionId ? { ...t, ...updates } : t
      )
    };
    updateCompany(updatedCompany);
  };

  const addTransaction = (transaction: Transaction) => {
    const updatedCompany = {
      ...currentCompany,
      transactions: [...currentCompany.transactions, transaction]
    };
    updateCompany(updatedCompany);
  };

  const deleteTransaction = (transactionId: string, bankAccountId: string) => {
    const updatedCompany = {
      ...currentCompany,
      transactions: currentCompany.transactions.filter(t => t.id !== transactionId),
      bankAccounts: currentCompany.bankAccounts.map(b => 
        b.id === bankAccountId 
          ? { ...b, transactions: b.transactions.filter(t => t.id !== transactionId) }
          : b
      )
    };
    updateCompany(updatedCompany);
  };

  // Budget operations
  const addBudget = (budget: Budget) => {
    const updatedCompany = {
      ...currentCompany,
      budgets: [...(currentCompany.budgets || []), budget]
    };
    updateCompany(updatedCompany);
  };

  const updateBudget = (budget: Budget) => {
    const updatedCompany = {
      ...currentCompany,
      budgets: (currentCompany.budgets || []).map(b => b.id === budget.id ? budget : b)
    };
    updateCompany(updatedCompany);
  };

  const deleteBudget = (budgetId: string) => {
    const updatedCompany = {
      ...currentCompany,
      budgets: (currentCompany.budgets || []).filter(b => b.id !== budgetId)
    };
    updateCompany(updatedCompany);
  };

  // Estimate operations
  const addEstimate = (estimate: Estimate) => {
    const updatedCompany = {
      ...currentCompany,
      estimates: [...(currentCompany.estimates || []), estimate]
    };
    updateCompany(updatedCompany);
  };

  const updateEstimate = (estimate: Estimate) => {
    const updatedCompany = {
      ...currentCompany,
      estimates: (currentCompany.estimates || []).map(e => e.id === estimate.id ? estimate : e)
    };
    updateCompany(updatedCompany);
  };

  const deleteEstimate = (estimateId: string) => {
    const updatedCompany = {
      ...currentCompany,
      estimates: (currentCompany.estimates || []).filter(e => e.id !== estimateId)
    };
    updateCompany(updatedCompany);
  };

  // Time Entry operations
  const addTimeEntry = (timeEntry: TimeEntry) => {
    const updatedCompany = {
      ...currentCompany,
      timeEntries: [...(currentCompany.timeEntries || []), timeEntry]
    };
    updateCompany(updatedCompany);
  };

  const updateTimeEntry = (timeEntryId: string, updates: Partial<TimeEntry>) => {
    const updatedCompany = {
      ...currentCompany,
      timeEntries: (currentCompany.timeEntries || []).map(t => 
        t.id === timeEntryId ? { ...t, ...updates } : t
      )
    };
    updateCompany(updatedCompany);
  };

  const deleteTimeEntry = (timeEntryId: string) => {
    const updatedCompany = {
      ...currentCompany,
      timeEntries: (currentCompany.timeEntries || []).filter(t => t.id !== timeEntryId)
    };
    updateCompany(updatedCompany);
  };

  // Sale operations
  const addSale = (sale: Sale) => {
    const updatedCompany = {
      ...currentCompany,
      sales: [...(currentCompany.sales || []), sale]
    };
    updateCompany(updatedCompany);
  };

  const updateSale = (sale: Sale) => {
    const updatedCompany = {
      ...currentCompany,
      sales: (currentCompany.sales || []).map(s => s.id === sale.id ? sale : s)
    };
    updateCompany(updatedCompany);
  };

  const deleteSale = (saleId: string) => {
    const updatedCompany = {
      ...currentCompany,
      sales: (currentCompany.sales || []).filter(s => s.id !== saleId)
    };
    updateCompany(updatedCompany);
  };

  // Payroll operations
  const processPayroll = (payrollData: any) => {
    const updatedCompany = {
      ...currentCompany,
      payrollData: payrollData
    };
    updateCompany(updatedCompany);
  };

  const value: CompanyContextType = {
    currentCompany,
    companies,
    updateCompany,
    switchCompany,
    addCompany,
    updateTaxRate,
    addTaxRate,
    deleteTaxRate,
    updateAccount,
    addAccount,
    deleteAccount,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    addExpense,
    updateExpense,
    deleteExpense,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    addEstimate,
    updateEstimate,
    deleteEstimate,
    addBudget,
    updateBudget,
    deleteBudget,
    updateTransaction,
    addTransaction,
    deleteTransaction,
    addTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
    addSale,
    updateSale,
    deleteSale,
    processPayroll,
    // Add missing operations
    addCustomer,
    updateCustomer,
    deleteCustomer
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

// Export Customer type for compatibility
export type { Customer };
