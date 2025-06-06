
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CompanyContextType } from '@/types/context';
import { Company, Customer, TaxRate, Account, Expense, Invoice, Transaction, BankAccount, Budget, Estimate, TimeEntry, Sale } from '@/types/company';
import { saveToLocalStorage, loadFromLocalStorage } from '@/services/localStorageService';

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Default company data with proper structure
const createDefaultCompany = (): Company => ({
  id: `company-${Date.now()}`,
  name: "My Company",
  address: "",
  phone: "",
  email: "",
  website: "",
  taxId: "",
  industry: "",
  fiscalYearStart: "January 1",
  transactions: [],
  accounts: [
    {
      id: 'acc-1',
      number: '1000',
      name: 'Cash',
      type: 'Asset',
      balance: 0,
      description: 'Cash account'
    },
    {
      id: 'acc-2',
      number: '1200',
      name: 'Accounts Receivable',
      type: 'Asset',
      balance: 0,
      description: 'Accounts receivable'
    },
    {
      id: 'acc-3',
      number: '2000',
      name: 'Accounts Payable',
      type: 'Liability',
      balance: 0,
      description: 'Accounts payable'
    }
  ],
  taxRates: [
    {
      id: 'tax-1',
      name: 'Standard Tax',
      rate: 10,
      isDefault: true,
      description: 'Standard tax rate'
    }
  ],
  bankAccounts: [
    {
      id: 'bank-1',
      name: 'Main Checking',
      balance: 1000,
      transactions: [],
      type: 'Checking'
    }
  ],
  customers: [],
  invoices: [],
  expenses: [],
  projects: [],
  timeEntries: [],
  employees: [],
  inventory: {
    items: [],
    categories: [],
    locations: [],
    bundles: [],
    serialNumbers: [],
    lotTracking: []
  },
  budgets: [],
  estimates: [],
  payrollData: { payPeriods: [] },
  auditTrail: [],
  integrations: [],
  sales: [],
  revenue: { current: 0, previous: 0, percentChange: 0 },
  profitMargin: { value: 0, trend: 0, percentChange: 0 },
  outstandingInvoices: { amount: 0, percentChange: 0 },
  activeCustomers: { count: 0, percentChange: 0 },
  leads: [],
  opportunities: [],
  bankConnections: [],
  users: [],
  roles: [],
  paymentTemplates: [],
  recurringInvoices: [],
  mileageEntries: [],
  vendorBills: [],
  scannedReceipts: []
});

export const CompanyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentCompany, setCurrentCompany] = useState<Company>(createDefaultCompany());

  // Load data on component mount
  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (savedData) {
      setCurrentCompany(savedData);
      setCompanies([savedData]);
    }
  }, []);

  // Save data whenever company changes
  useEffect(() => {
    if (currentCompany.id) {
      saveToLocalStorage(currentCompany);
    }
  }, [currentCompany]);

  const updateCompany = (updatedCompany: Company) => {
    setCurrentCompany(updatedCompany);
    setCompanies(prev => prev.map(c => c.id === updatedCompany.id ? updatedCompany : c));
  };

  const switchCompany = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      setCurrentCompany(company);
    }
  };

  const addCompany = (company: Company) => {
    setCompanies(prev => [...prev, company]);
    setCurrentCompany(company);
  };

  // Customer operations
  const addCustomer = (customer: Customer) => {
    const updatedCompany = {
      ...currentCompany,
      customers: [...(currentCompany.customers || []), customer]
    };
    setCurrentCompany(updatedCompany);
  };

  const updateCustomer = (customer: Customer) => {
    const updatedCompany = {
      ...currentCompany,
      customers: (currentCompany.customers || []).map(c => c.id === customer.id ? customer : c)
    };
    setCurrentCompany(updatedCompany);
  };

  const deleteCustomer = (customerId: string) => {
    const updatedCompany = {
      ...currentCompany,
      customers: (currentCompany.customers || []).filter(c => c.id !== customerId)
    };
    setCurrentCompany(updatedCompany);
  };

  // Tax operations
  const updateTaxRate = (taxRate: TaxRate) => {
    const updatedCompany = {
      ...currentCompany,
      taxRates: currentCompany.taxRates.map(t => t.id === taxRate.id ? taxRate : t)
    };
    setCurrentCompany(updatedCompany);
  };

  const addTaxRate = (taxRate: TaxRate) => {
    const updatedCompany = {
      ...currentCompany,
      taxRates: [...currentCompany.taxRates, taxRate]
    };
    setCurrentCompany(updatedCompany);
  };

  const deleteTaxRate = (taxRateId: string) => {
    const updatedCompany = {
      ...currentCompany,
      taxRates: currentCompany.taxRates.filter(t => t.id !== taxRateId)
    };
    setCurrentCompany(updatedCompany);
  };

  // Account operations
  const updateAccount = (account: Account) => {
    const updatedCompany = {
      ...currentCompany,
      accounts: currentCompany.accounts.map(a => a.id === account.id ? account : a)
    };
    setCurrentCompany(updatedCompany);
  };

  const addAccount = (account: Account) => {
    const updatedCompany = {
      ...currentCompany,
      accounts: [...currentCompany.accounts, account]
    };
    setCurrentCompany(updatedCompany);
  };

  const deleteAccount = (accountId: string) => {
    const updatedCompany = {
      ...currentCompany,
      accounts: currentCompany.accounts.filter(a => a.id !== accountId)
    };
    setCurrentCompany(updatedCompany);
  };

  // Bank Account operations
  const addBankAccount = (bankAccount: BankAccount) => {
    const updatedCompany = {
      ...currentCompany,
      bankAccounts: [...currentCompany.bankAccounts, bankAccount]
    };
    setCurrentCompany(updatedCompany);
  };

  const updateBankAccount = (bankAccount: BankAccount) => {
    const updatedCompany = {
      ...currentCompany,
      bankAccounts: currentCompany.bankAccounts.map(b => b.id === bankAccount.id ? bankAccount : b)
    };
    setCurrentCompany(updatedCompany);
  };

  const deleteBankAccount = (bankAccountId: string) => {
    const updatedCompany = {
      ...currentCompany,
      bankAccounts: currentCompany.bankAccounts.filter(b => b.id !== bankAccountId)
    };
    setCurrentCompany(updatedCompany);
  };

  // Expense operations
  const addExpense = (expense: Expense) => {
    const updatedCompany = {
      ...currentCompany,
      expenses: [...(currentCompany.expenses || []), expense]
    };
    setCurrentCompany(updatedCompany);
  };

  const updateExpense = (expense: Expense) => {
    const updatedCompany = {
      ...currentCompany,
      expenses: (currentCompany.expenses || []).map(e => e.id === expense.id ? expense : e)
    };
    setCurrentCompany(updatedCompany);
  };

  const deleteExpense = (expenseId: string) => {
    const updatedCompany = {
      ...currentCompany,
      expenses: (currentCompany.expenses || []).filter(e => e.id !== expenseId)
    };
    setCurrentCompany(updatedCompany);
  };

  // Invoice operations
  const addInvoice = (invoice: Invoice) => {
    const updatedCompany = {
      ...currentCompany,
      invoices: [...(currentCompany.invoices || []), invoice]
    };
    setCurrentCompany(updatedCompany);
  };

  const updateInvoice = (invoice: Invoice) => {
    const updatedCompany = {
      ...currentCompany,
      invoices: (currentCompany.invoices || []).map(i => i.id === invoice.id ? invoice : i)
    };
    setCurrentCompany(updatedCompany);
  };

  const deleteInvoice = (invoiceId: string) => {
    const updatedCompany = {
      ...currentCompany,
      invoices: (currentCompany.invoices || []).filter(i => i.id !== invoiceId)
    };
    setCurrentCompany(updatedCompany);
  };

  // Estimate operations
  const addEstimate = (estimate: Estimate) => {
    const updatedCompany = {
      ...currentCompany,
      estimates: [...(currentCompany.estimates || []), estimate]
    };
    setCurrentCompany(updatedCompany);
  };

  const updateEstimate = (estimate: Estimate) => {
    const updatedCompany = {
      ...currentCompany,
      estimates: (currentCompany.estimates || []).map(e => e.id === estimate.id ? estimate : e)
    };
    setCurrentCompany(updatedCompany);
  };

  const deleteEstimate = (estimateId: string) => {
    const updatedCompany = {
      ...currentCompany,
      estimates: (currentCompany.estimates || []).filter(e => e.id !== estimateId)
    };
    setCurrentCompany(updatedCompany);
  };

  // Budget operations
  const addBudget = (budget: Budget) => {
    const updatedCompany = {
      ...currentCompany,
      budgets: [...(currentCompany.budgets || []), budget]
    };
    setCurrentCompany(updatedCompany);
  };

  const updateBudget = (budget: Budget) => {
    const updatedCompany = {
      ...currentCompany,
      budgets: (currentCompany.budgets || []).map(b => b.id === budget.id ? budget : b)
    };
    setCurrentCompany(updatedCompany);
  };

  const deleteBudget = (budgetId: string) => {
    const updatedCompany = {
      ...currentCompany,
      budgets: (currentCompany.budgets || []).filter(b => b.id !== budgetId)
    };
    setCurrentCompany(updatedCompany);
  };

  // Transaction operations
  const updateTransaction = (transactionId: string, updates: Partial<Transaction>) => {
    const updatedCompany = {
      ...currentCompany,
      transactions: currentCompany.transactions.map(t => 
        t.id === transactionId ? { ...t, ...updates } : t
      ),
      bankAccounts: currentCompany.bankAccounts.map(account => ({
        ...account,
        transactions: account.transactions.map(t => 
          t.id === transactionId ? { ...t, ...updates } : t
        )
      }))
    };
    setCurrentCompany(updatedCompany);
  };

  const addTransaction = (transaction: Transaction) => {
    const updatedCompany = {
      ...currentCompany,
      transactions: [...currentCompany.transactions, transaction]
    };
    setCurrentCompany(updatedCompany);
  };

  const deleteTransaction = (transactionId: string, bankAccountId: string) => {
    const updatedCompany = {
      ...currentCompany,
      transactions: currentCompany.transactions.filter(t => t.id !== transactionId),
      bankAccounts: currentCompany.bankAccounts.map(account => 
        account.id === bankAccountId 
          ? { ...account, transactions: account.transactions.filter(t => t.id !== transactionId) }
          : account
      )
    };
    setCurrentCompany(updatedCompany);
  };

  // Time Entry operations
  const addTimeEntry = (timeEntry: TimeEntry) => {
    const updatedCompany = {
      ...currentCompany,
      timeEntries: [...(currentCompany.timeEntries || []), timeEntry]
    };
    setCurrentCompany(updatedCompany);
  };

  const updateTimeEntry = (timeEntryId: string, updates: Partial<TimeEntry>) => {
    const updatedCompany = {
      ...currentCompany,
      timeEntries: (currentCompany.timeEntries || []).map(te => 
        te.id === timeEntryId ? { ...te, ...updates } : te
      )
    };
    setCurrentCompany(updatedCompany);
  };

  const deleteTimeEntry = (timeEntryId: string) => {
    const updatedCompany = {
      ...currentCompany,
      timeEntries: (currentCompany.timeEntries || []).filter(te => te.id !== timeEntryId)
    };
    setCurrentCompany(updatedCompany);
  };

  // Sale operations
  const addSale = (sale: Sale) => {
    const updatedCompany = {
      ...currentCompany,
      sales: [...(currentCompany.sales || []), sale]
    };
    setCurrentCompany(updatedCompany);
  };

  const updateSale = (sale: Sale) => {
    const updatedCompany = {
      ...currentCompany,
      sales: (currentCompany.sales || []).map(s => s.id === sale.id ? sale : s)
    };
    setCurrentCompany(updatedCompany);
  };

  const deleteSale = (saleId: string) => {
    const updatedCompany = {
      ...currentCompany,
      sales: (currentCompany.sales || []).filter(s => s.id !== saleId)
    };
    setCurrentCompany(updatedCompany);
  };

  // Payroll operations
  const processPayroll = (payrollData: any) => {
    const updatedCompany = {
      ...currentCompany,
      payrollData: {
        ...currentCompany.payrollData,
        payPeriods: [...(currentCompany.payrollData?.payPeriods || []), payrollData]
      }
    };
    setCurrentCompany(updatedCompany);
  };

  const value: CompanyContextType = {
    currentCompany,
    companies,
    updateCompany,
    switchCompany,
    addCompany,
    addCustomer,
    updateCustomer,
    deleteCustomer,
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
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = (): CompanyContextType => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
