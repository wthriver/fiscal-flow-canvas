
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '@/services/localStorageService';

// Define all the necessary types
export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  isDefault: boolean;
}

export interface BankAccount {
  id: string;
  name: string;
  balance: number;
  transactions: Transaction[];
  type?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: string;
  category: string;
  account: string;
  reconciled: boolean;
  type: "Deposit" | "Withdrawal" | "Transfer";
  bankAccount?: string;
}

export interface Account {
  id: string;
  number: string;
  name: string;
  type: string;
  balance: number;
  description: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
}

export interface Invoice {
  id: string;
  customer: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  status: string;
  total: number;
  amount: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Expense {
  id: string;
  date: string;
  vendor: string;
  category: string;
  amount: number;
  description: string;
  status: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  status: string;
  startDate: string;
  endDate?: string;
  budget?: number;
  documents: ProjectDocument[];
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy?: string;
  date?: string;
  uploadDate?: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  salary: number;
  hireDate: string;
  status: string;
}

export interface TimeEntry {
  id: string;
  employeeId: string;
  projectId: string;
  date: string;
  hours: number;
  description: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  cost: number;
  category: string;
  location?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  type: "income" | "expense";
  budgeted: number;
  actual: number;
}

export interface Budget {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  categories: BudgetCategory[];
  status: string;
  period?: string;
}

export interface Estimate {
  id: string;
  customer: string;
  date: string;
  expiryDate: string;
  items: InvoiceItem[];
  status: string;
  total: number;
}

export interface PayPeriod {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  totalPaid: number;
  payDate?: string;
  employees?: any[];
  totalGross?: number;
}

export interface PayrollData {
  payPeriods: PayPeriod[];
}

export interface RevenueData {
  current: number;
  previous: number;
  percentChange: number;
}

export interface ProfitMarginData {
  value: number;
  trend: number;
  percentChange: number;
}

export interface OutstandingInvoicesData {
  amount: number;
  percentChange: number;
}

export interface ActiveCustomersData {
  count: number;
  percentChange: number;
}

export interface InventoryData {
  items: InventoryItem[];
  categories: string[];
  locations: string[];
  bundles: any[];
  serialNumbers: any[];
  lotTracking: any[];
}

export interface Company {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  taxId?: string;
  industry?: string;
  fiscalYearStart?: string;
  transactions: Transaction[];
  accounts: Account[];
  taxRates: TaxRate[];
  bankAccounts: BankAccount[];
  customers?: Customer[];
  invoices?: Invoice[];
  expenses?: Expense[];
  projects?: Project[];
  timeEntries?: TimeEntry[];
  employees?: Employee[];
  inventory?: InventoryData;
  budgets?: Budget[];
  estimates?: Estimate[];
  payrollData?: PayrollData;
  auditTrail?: any[];
  integrations?: any[];
  sales?: any[];
  revenue?: RevenueData;
  profitMargin?: ProfitMarginData;
  outstandingInvoices?: OutstandingInvoicesData;
  activeCustomers?: ActiveCustomersData;
}

export interface CompanyContextType {
  currentCompany: Company;
  companies: Company[];
  updateCompany: (updatedCompany: Company) => void;
  switchCompany: (companyId: string) => void;
  addCompany: (company: Company) => void;
  updateTaxRate: (taxRate: TaxRate) => void;
  addTaxRate: (taxRate: TaxRate) => void;
  deleteTaxRate: (taxRateId: string) => void;
  updateAccount: (account: Account) => void;
  addAccount: (account: Account) => void;
  deleteAccount: (accountId: string) => void;
  addExpense: (expense: Expense) => void;
  addEstimate: (estimate: Estimate) => void;
  updateBudget: (budget: Budget) => void;
  processPayroll: (payrollData: any) => void;
  addInvoice: (invoice: Invoice) => void;
  updateTransaction: (transaction: Transaction) => void;
  addTransaction: (transaction: Transaction, bankAccountId: string) => void;
}

// Create the context with default values
const CompanyContext = createContext<CompanyContextType>({
  currentCompany: {
    id: '',
    name: '',
    transactions: [],
    accounts: [],
    taxRates: [],
    bankAccounts: []
  },
  companies: [],
  updateCompany: () => {},
  switchCompany: () => {},
  addCompany: () => {},
  updateTaxRate: () => {},
  addTaxRate: () => {},
  deleteTaxRate: () => {},
  updateAccount: () => {},
  addAccount: () => {},
  deleteAccount: () => {},
  addExpense: () => {},
  addEstimate: () => {},
  updateBudget: () => {},
  processPayroll: () => {},
  addInvoice: () => {},
  updateTransaction: () => {},
  addTransaction: () => {},
});

interface CompanyProviderProps {
  children: ReactNode;
}

export const CompanyProvider: React.FC<CompanyProviderProps> = ({ children }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentCompanyId, setCurrentCompanyId] = useState<string>('');

  // Initialize with default company if none exists
  useEffect(() => {
    const storedData = loadFromLocalStorage();
    
    if (storedData) {
      setCompanies([storedData]);
      setCurrentCompanyId(storedData.id);
    } else {
      // Create default company
      const defaultCompany: Company = {
        id: `company-${Date.now()}`,
        name: 'My Company',
        transactions: [],
        accounts: [],
        taxRates: [],
        bankAccounts: [
          {
            id: 'bank-1',
            name: 'Checking Account',
            balance: 1000,
            transactions: [
              {
                id: 'transaction-1',
                date: '2023-01-01',
                description: 'Initial Deposit',
                amount: '+$1000.00',
                category: 'Deposit',
                account: 'Checking Account',
                reconciled: false,
                type: 'Deposit'
              }
            ]
          }
        ],
        customers: [],
        invoices: [],
        expenses: [],
        projects: [],
        employees: [],
        timeEntries: [],
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
        activeCustomers: { count: 0, percentChange: 0 }
      };
      
      setCompanies([defaultCompany]);
      setCurrentCompanyId(defaultCompany.id);
      saveToLocalStorage(defaultCompany);
    }
  }, []);

  // Get current company object
  const currentCompany = companies.find(c => c.id === currentCompanyId) || companies[0] || {
    id: '',
    name: '',
    transactions: [],
    accounts: [],
    taxRates: [],
    bankAccounts: []
  };

  // Update a company
  const updateCompany = (updatedCompany: Company) => {
    const updatedCompanies = companies.map(company => 
      company.id === updatedCompany.id ? updatedCompany : company
    );
    
    setCompanies(updatedCompanies);
    saveToLocalStorage(updatedCompany);
  };

  // Switch active company
  const switchCompany = (companyId: string) => {
    setCurrentCompanyId(companyId);
  };

  // Add a new company
  const addCompany = (company: Company) => {
    setCompanies([...companies, company]);
    setCurrentCompanyId(company.id);
    saveToLocalStorage(company);
  };

  // Tax rate operations
  const updateTaxRate = (taxRate: TaxRate) => {
    const updatedTaxRates = currentCompany.taxRates.map(tr => 
      tr.id === taxRate.id ? taxRate : tr
    );
    
    const updatedCompany = {
      ...currentCompany,
      taxRates: updatedTaxRates
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
      taxRates: currentCompany.taxRates.filter(tr => tr.id !== taxRateId)
    };
    
    updateCompany(updatedCompany);
  };

  // Account operations
  const updateAccount = (account: Account) => {
    const updatedAccounts = currentCompany.accounts.map(acc => 
      acc.id === account.id ? account : acc
    );
    
    const updatedCompany = {
      ...currentCompany,
      accounts: updatedAccounts
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
      accounts: currentCompany.accounts.filter(acc => acc.id !== accountId)
    };
    
    updateCompany(updatedCompany);
  };

  // Expense operations
  const addExpense = (expense: Expense) => {
    const expenses = currentCompany.expenses || [];
    const updatedCompany = {
      ...currentCompany,
      expenses: [...expenses, expense]
    };
    
    updateCompany(updatedCompany);
  };

  // Invoice operations
  const addInvoice = (invoice: Invoice) => {
    const invoices = currentCompany.invoices || [];
    const updatedCompany = {
      ...currentCompany,
      invoices: [...invoices, invoice]
    };
    
    updateCompany(updatedCompany);
  };

  // Transaction operations
  const updateTransaction = (transaction: Transaction) => {
    // Find the bank account this transaction belongs to
    const bankAccount = currentCompany.bankAccounts.find(
      account => account.transactions.some(t => t.id === transaction.id)
    );

    if (bankAccount) {
      // Update the transaction in the bank account
      const updatedTransactions = bankAccount.transactions.map(
        t => t.id === transaction.id ? transaction : t
      );

      // Update the bank account with new transactions list
      const updatedBankAccounts = currentCompany.bankAccounts.map(account => 
        account.id === bankAccount.id 
          ? { ...account, transactions: updatedTransactions }
          : account
      );

      // Update company with new bank accounts list
      const updatedCompany = {
        ...currentCompany,
        bankAccounts: updatedBankAccounts
      };

      updateCompany(updatedCompany);
    }
  };

  const addTransaction = (transaction: Transaction, bankAccountId: string) => {
    // Find the bank account to add the transaction to
    const bankAccount = currentCompany.bankAccounts.find(account => account.id === bankAccountId);

    if (bankAccount) {
      // Add the transaction to the bank account
      const updatedTransactions = [...bankAccount.transactions, transaction];

      // Update the bank account with new transactions list
      const updatedBankAccounts = currentCompany.bankAccounts.map(account => 
        account.id === bankAccountId 
          ? { ...account, transactions: updatedTransactions }
          : account
      );

      // Update company with new bank accounts list
      const updatedCompany = {
        ...currentCompany,
        bankAccounts: updatedBankAccounts
      };

      updateCompany(updatedCompany);
    }
  };

  // Estimate operations
  const addEstimate = (estimate: Estimate) => {
    const estimates = currentCompany.estimates || [];
    const updatedCompany = {
      ...currentCompany,
      estimates: [...estimates, estimate]
    };
    
    updateCompany(updatedCompany);
  };

  // Budget operations
  const updateBudget = (budget: Budget) => {
    const budgets = currentCompany.budgets || [];
    const updatedBudgets = budgets.map(b => 
      b.id === budget.id ? budget : b
    );
    
    const updatedCompany = {
      ...currentCompany,
      budgets: updatedBudgets
    };
    
    updateCompany(updatedCompany);
  };

  // Payroll operations
  const processPayroll = (payrollData: any) => {
    const currentPayrollData = currentCompany.payrollData || { payPeriods: [] };
    const updatedCompany = {
      ...currentCompany,
      payrollData: {
        ...currentPayrollData,
        payPeriods: [...currentPayrollData.payPeriods, payrollData]
      }
    };
    
    updateCompany(updatedCompany);
  };

  return (
    <CompanyContext.Provider 
      value={{ 
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
        addExpense,
        addInvoice,
        addEstimate,
        updateBudget,
        processPayroll,
        updateTransaction,
        addTransaction
      }}
    >
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
