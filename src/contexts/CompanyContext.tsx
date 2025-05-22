
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '@/services/localStorageService';
import { Company, TaxRate, Account, Transaction, Invoice, Expense, Estimate, Budget, BankAccount, TimeEntry, Project, ProjectDocument, Customer } from '@/types/company';
import { CompanyContextType } from '@/types/context';

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
  updateExpense: () => {},
  deleteExpense: () => {},
  addInvoice: () => {},
  updateInvoice: () => {},
  deleteInvoice: () => {},
  addEstimate: () => {},
  updateEstimate: () => {},
  deleteEstimate: () => {},
  updateBudget: () => {},
  addBudget: () => {},
  deleteBudget: () => {},
  processPayroll: () => {},
  updateTransaction: () => {},
  addTransaction: () => {},
  deleteTransaction: () => {},
  addBankAccount: () => {},
  updateBankAccount: () => {},
  deleteBankAccount: () => {},
  addTimeEntry: () => {},
  updateTimeEntry: () => {},
  deleteTimeEntry: () => {},
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
                amount: '$1000.00',
                category: 'Deposit',
                account: 'Checking Account',
                reconciled: false,
                type: 'Deposit'
              }
            ],
            lastTransaction: '2023-01-01'
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

  // Bank account operations
  const addBankAccount = (bankAccount: BankAccount) => {
    const updatedCompany = {
      ...currentCompany,
      bankAccounts: [...currentCompany.bankAccounts, bankAccount]
    };
    
    updateCompany(updatedCompany);
  };

  const updateBankAccount = (bankAccount: BankAccount) => {
    const updatedBankAccounts = currentCompany.bankAccounts.map(acc => 
      acc.id === bankAccount.id ? bankAccount : acc
    );
    
    const updatedCompany = {
      ...currentCompany,
      bankAccounts: updatedBankAccounts
    };
    
    updateCompany(updatedCompany);
  };

  const deleteBankAccount = (bankAccountId: string) => {
    const updatedCompany = {
      ...currentCompany,
      bankAccounts: currentCompany.bankAccounts.filter(acc => acc.id !== bankAccountId)
    };
    
    updateCompany(updatedCompany);
  };

  // Tax rate operations
  const addTaxRate = (taxRate: TaxRate) => {
    const updatedCompany = {
      ...currentCompany,
      taxRates: [...currentCompany.taxRates, taxRate]
    };
    
    updateCompany(updatedCompany);
  };

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
  
  const updateExpense = (expense: Expense) => {
    const expenses = currentCompany.expenses || [];
    const updatedExpenses = expenses.map(exp => 
      exp.id === expense.id ? expense : exp
    );
    
    const updatedCompany = {
      ...currentCompany,
      expenses: updatedExpenses
    };
    
    updateCompany(updatedCompany);
  };
  
  const deleteExpense = (expenseId: string) => {
    const expenses = currentCompany.expenses || [];
    const updatedCompany = {
      ...currentCompany,
      expenses: expenses.filter(exp => exp.id !== expenseId)
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
  
  const updateInvoice = (invoice: Invoice) => {
    const invoices = currentCompany.invoices || [];
    const updatedInvoices = invoices.map(inv => 
      inv.id === invoice.id ? invoice : inv
    );
    
    const updatedCompany = {
      ...currentCompany,
      invoices: updatedInvoices
    };
    
    updateCompany(updatedCompany);
  };
  
  const deleteInvoice = (invoiceId: string) => {
    const invoices = currentCompany.invoices || [];
    const updatedCompany = {
      ...currentCompany,
      invoices: invoices.filter(inv => inv.id !== invoiceId)
    };
    
    updateCompany(updatedCompany);
  };

  // Transaction operations
  const updateTransaction = (transactionId: string, updates: Partial<Transaction>) => {
    // Find the bank account this transaction belongs to
    const bankAccount = currentCompany.bankAccounts.find(
      account => account.transactions.some(t => t.id === transactionId)
    );

    if (bankAccount) {
      // Get the transaction
      const transaction = bankAccount.transactions.find(t => t.id === transactionId);
      
      if (transaction) {
        // Update the transaction with new values
        const updatedTransaction = { ...transaction, ...updates };
        
        // Update the transaction in the bank account
        const updatedTransactions = bankAccount.transactions.map(
          t => t.id === transactionId ? updatedTransaction : t
        );

        // Update the bank account with new transactions list and last transaction date
        const updatedBankAccounts = currentCompany.bankAccounts.map(account => 
          account.id === bankAccount.id 
            ? { 
                ...account, 
                transactions: updatedTransactions,
                lastTransaction: updatedTransaction.date || account.lastTransaction
              }
            : account
        );

        // Update company with new bank accounts list
        const updatedCompany = {
          ...currentCompany,
          bankAccounts: updatedBankAccounts
        };

        updateCompany(updatedCompany);
      }
    }
  };

  const addTransaction = (transaction: Transaction) => {
    // Default to the first bank account if none specified
    const bankAccountId = transaction.bankAccount || currentCompany.bankAccounts[0]?.id;
    
    if (bankAccountId) {
      // Find the bank account to add the transaction to
      const bankAccount = currentCompany.bankAccounts.find(account => account.id === bankAccountId);

      if (bankAccount) {
        // Add the transaction to the bank account
        const updatedTransactions = [...bankAccount.transactions, transaction];

        // Update the bank account with new transactions list and last transaction date
        const updatedBankAccounts = currentCompany.bankAccounts.map(account => 
          account.id === bankAccountId 
            ? { 
                ...account, 
                transactions: updatedTransactions,
                lastTransaction: transaction.date
              }
            : account
        );

        // Update company with new bank accounts list
        const updatedCompany = {
          ...currentCompany,
          bankAccounts: updatedBankAccounts
        };

        updateCompany(updatedCompany);
      }
    }
  };
  
  const deleteTransaction = (transactionId: string, bankAccountId: string) => {
    // Find the bank account
    const bankAccount = currentCompany.bankAccounts.find(account => account.id === bankAccountId);

    if (bankAccount) {
      // Remove the transaction from the bank account
      const updatedTransactions = bankAccount.transactions.filter(t => t.id !== transactionId);

      // Find the latest transaction date for lastTransaction
      const latestTransaction = [...updatedTransactions].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];

      // Update the bank account with new transactions list
      const updatedBankAccounts = currentCompany.bankAccounts.map(account => 
        account.id === bankAccountId 
          ? { 
              ...account, 
              transactions: updatedTransactions,
              lastTransaction: latestTransaction?.date || account.lastTransaction
            }
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

  // Time Entry operations
  const addTimeEntry = (timeEntry: TimeEntry) => {
    const timeEntries = currentCompany.timeEntries || [];
    const updatedCompany = {
      ...currentCompany,
      timeEntries: [...timeEntries, timeEntry]
    };
    
    updateCompany(updatedCompany);
  };
  
  const updateTimeEntry = (timeEntryId: string, updates: Partial<TimeEntry>) => {
    const timeEntries = currentCompany.timeEntries || [];
    
    const updatedTimeEntries = timeEntries.map(entry => 
      entry.id === timeEntryId ? { ...entry, ...updates } : entry
    );
    
    const updatedCompany = {
      ...currentCompany,
      timeEntries: updatedTimeEntries
    };
    
    updateCompany(updatedCompany);
  };
  
  const deleteTimeEntry = (timeEntryId: string) => {
    const timeEntries = currentCompany.timeEntries || [];
    
    const updatedCompany = {
      ...currentCompany,
      timeEntries: timeEntries.filter(entry => entry.id !== timeEntryId)
    };
    
    updateCompany(updatedCompany);
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
  
  const updateEstimate = (estimate: Estimate) => {
    const estimates = currentCompany.estimates || [];
    const updatedEstimates = estimates.map(est => 
      est.id === estimate.id ? estimate : est
    );
    
    const updatedCompany = {
      ...currentCompany,
      estimates: updatedEstimates
    };
    
    updateCompany(updatedCompany);
  };
  
  const deleteEstimate = (estimateId: string) => {
    const estimates = currentCompany.estimates || [];
    const updatedCompany = {
      ...currentCompany,
      estimates: estimates.filter(est => est.id !== estimateId)
    };
    
    updateCompany(updatedCompany);
  };

  // Budget operations
  const addBudget = (budget: Budget) => {
    const budgets = currentCompany.budgets || [];
    const updatedCompany = {
      ...currentCompany,
      budgets: [...budgets, budget]
    };
    
    updateCompany(updatedCompany);
  };
  
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
  
  const deleteBudget = (budgetId: string) => {
    const budgets = currentCompany.budgets || [];
    const updatedCompany = {
      ...currentCompany,
      budgets: budgets.filter(b => b.id !== budgetId)
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
        processPayroll,
        updateTransaction,
        addTransaction,
        deleteTransaction,
        addBankAccount,
        updateBankAccount,
        deleteBankAccount,
        addTimeEntry,
        updateTimeEntry,
        deleteTimeEntry
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

// Re-export types
export type { Company, TaxRate, Account, Transaction, Invoice, Expense, Estimate, Budget, BankAccount, TimeEntry, Project, ProjectDocument, Customer } from '@/types/company';
