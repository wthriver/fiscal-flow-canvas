import React, { createContext, useContext, useState, useCallback } from 'react';
import { CompanyContextType } from '@/types/context';
import { Customer, Invoice, Expense, Project, Transaction, Employee, Sale, Estimate, Budget, TimeEntry, PurchaseOrder, PurchaseOrderStatus } from '@/types/company';
import { sampleCompany } from '@/data/sampleData';
import { safeNumberParse, safeStringReplace } from '@/utils/typeHelpers';

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCompany, setCurrentCompany] = useState(sampleCompany);
  const [companies] = useState([sampleCompany]);

  // Enhanced customer operations with data relations
  const addCustomer = useCallback((customer: Customer) => {
    setCurrentCompany(prev => ({
      ...prev,
      customers: [...(prev.customers || []), customer]
    }));
  }, []);

  const updateCustomer = useCallback((customer: Customer) => {
    setCurrentCompany(prev => ({
      ...prev,
      customers: prev.customers?.map(c => c.id === customer.id ? customer : c) || []
    }));
  }, []);

  const deleteCustomer = useCallback((customerId: string) => {
    setCurrentCompany(prev => ({
      ...prev,
      customers: prev.customers?.filter(c => c.id !== customerId) || [],
      // Also remove related invoices and projects
      invoices: prev.invoices?.filter(i => i.customerId !== customerId) || [],
      projects: prev.projects?.filter(p => p.clientId !== customerId) || []
    }));
  }, []);

  // Enhanced invoice operations with automatic calculations
  const addInvoice = useCallback((invoice: Invoice) => {
    setCurrentCompany(prev => {
      const updatedCustomers = prev.customers?.map(customer => {
        if (customer.id === invoice.customerId) {
          return {
            ...customer,
            totalSales: (customer.totalSales || 0) + invoice.total
          };
        }
        return customer;
      }) || [];

      return {
        ...prev,
        invoices: [...(prev.invoices || []), invoice],
        customers: updatedCustomers
      };
    });
  }, []);

  const updateInvoice = useCallback((invoice: Invoice) => {
    setCurrentCompany(prev => {
      const oldInvoice = prev.invoices?.find(i => i.id === invoice.id);
      const updatedCustomers = prev.customers?.map(customer => {
        if (customer.id === invoice.customerId) {
          const oldAmount = oldInvoice?.total || 0;
          return {
            ...customer,
            totalSales: (customer.totalSales || 0) - oldAmount + invoice.total
          };
        }
        return customer;
      }) || [];

      return {
        ...prev,
        invoices: prev.invoices?.map(i => i.id === invoice.id ? invoice : i) || [],
        customers: updatedCustomers
      };
    });
  }, []);

  const deleteInvoice = useCallback((invoiceId: string) => {
    setCurrentCompany(prev => {
      const invoice = prev.invoices?.find(i => i.id === invoiceId);
      const updatedCustomers = prev.customers?.map(customer => {
        if (customer.id === invoice?.customerId) {
          return {
            ...customer,
            totalSales: (customer.totalSales || 0) - (invoice?.total || 0)
          };
        }
        return customer;
      }) || [];

      return {
        ...prev,
        invoices: prev.invoices?.filter(i => i.id !== invoiceId) || [],
        customers: updatedCustomers
      };
    });
  }, []);

  // Enhanced expense operations with category tracking
  const addExpense = useCallback((expense: Expense) => {
    setCurrentCompany(prev => ({
      ...prev,
      expenses: [...(prev.expenses || []), expense]
    }));
  }, []);

  const updateExpense = useCallback((expense: Expense) => {
    setCurrentCompany(prev => ({
      ...prev,
      expenses: prev.expenses?.map(e => e.id === expense.id ? expense : e) || []
    }));
  }, []);

  const deleteExpense = useCallback((expenseId: string) => {
    setCurrentCompany(prev => ({
      ...prev,
      expenses: prev.expenses?.filter(e => e.id !== expenseId) || []
    }));
  }, []);

  // Enhanced transaction operations with balance updates
  const addTransaction = useCallback((transaction: Transaction) => {
    setCurrentCompany(prev => {
      const updatedBankAccounts = prev.bankAccounts?.map(account => {
        if (account.id === transaction.account || account.name === transaction.account) {
          const amount = safeNumberParse(transaction.amount);
          const currentBalance = typeof account.balance === 'string' 
            ? safeNumberParse(account.balance)
            : account.balance;
          return {
            ...account,
            balance: currentBalance + amount,
            transactions: [...(account.transactions || []), transaction]
          };
        }
        return account;
      }) || [];

      return {
        ...prev,
        bankAccounts: updatedBankAccounts
      };
    });
  }, []);

  const updateTransaction = useCallback((transactionId: string, updates: Partial<Transaction>) => {
    setCurrentCompany(prev => {
      const updatedBankAccounts = prev.bankAccounts?.map(account => {
        const transactionIndex = account.transactions?.findIndex(t => t.id === transactionId);
        if (transactionIndex !== undefined && transactionIndex >= 0) {
          const oldTransaction = account.transactions![transactionIndex];
          const updatedTransaction = { ...oldTransaction, ...updates };
          
          // Update balance if amount changed
          const oldAmount = safeNumberParse(oldTransaction.amount);
          const newAmount = safeNumberParse(updatedTransaction.amount);
          const balanceDiff = newAmount - oldAmount;
          const currentBalance = typeof account.balance === 'string' 
            ? safeNumberParse(account.balance)
            : account.balance;

          const updatedTransactions = [...account.transactions!];
          updatedTransactions[transactionIndex] = updatedTransaction;

          return {
            ...account,
            balance: currentBalance + balanceDiff,
            transactions: updatedTransactions
          };
        }
        return account;
      }) || [];

      return {
        ...prev,
        bankAccounts: updatedBankAccounts
      };
    });
  }, []);

  const deleteTransaction = useCallback((transactionId: string, bankAccountId: string) => {
    setCurrentCompany(prev => {
      const updatedBankAccounts = prev.bankAccounts?.map(account => {
        if (account.id === bankAccountId) {
          const transaction = account.transactions?.find(t => t.id === transactionId);
          const amount = transaction ? safeNumberParse(transaction.amount) : 0;
          const currentBalance = typeof account.balance === 'string' 
            ? safeNumberParse(account.balance)
            : account.balance;
          
          return {
            ...account,
            balance: currentBalance - amount,
            transactions: account.transactions?.filter(t => t.id !== transactionId) || []
          };
        }
        return account;
      }) || [];

      return {
        ...prev,
        bankAccounts: updatedBankAccounts
      };
    });
  }, []);

  // Project operations with proper linking
  const addProject = useCallback((project: Project) => {
    setCurrentCompany(prev => ({
      ...prev,
      projects: [...(prev.projects || []), project]
    }));
  }, []);

  const updateProject = useCallback((project: Project) => {
    setCurrentCompany(prev => ({
      ...prev,
      projects: prev.projects?.map(p => p.id === project.id ? project : p) || []
    }));
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setCurrentCompany(prev => ({
      ...prev,
      projects: prev.projects?.filter(p => p.id !== projectId) || [],
      // Also remove related time entries
      timeEntries: prev.timeEntries?.filter(te => te.projectId !== projectId) || []
    }));
  }, []);

  // Employee operations
  const addEmployee = useCallback((employee: Employee) => {
    setCurrentCompany(prev => ({
      ...prev,
      employees: [...(prev.employees || []), employee]
    }));
  }, []);

  const updateEmployee = useCallback((employee: Employee) => {
    setCurrentCompany(prev => ({
      ...prev,
      employees: prev.employees?.map(e => e.id === employee.id ? employee : e) || []
    }));
  }, []);

  const deleteEmployee = useCallback((employeeId: string) => {
    setCurrentCompany(prev => ({
      ...prev,
      employees: prev.employees?.filter(e => e.id !== employeeId) || []
    }));
  }, []);

  // Sales operations
  const addSale = useCallback((sale: Sale) => {
    setCurrentCompany(prev => ({
      ...prev,
      sales: [...(prev.sales || []), sale]
    }));
  }, []);

  const updateSale = useCallback((sale: Sale) => {
    setCurrentCompany(prev => ({
      ...prev,
      sales: prev.sales?.map(s => s.id === sale.id ? sale : s) || []
    }));
  }, []);

  const deleteSale = useCallback((saleId: string) => {
    setCurrentCompany(prev => ({
      ...prev,
      sales: prev.sales?.filter(s => s.id !== saleId) || []
    }));
  }, []);

  // Estimates operations
  const addEstimate = useCallback((estimate: Estimate) => {
    setCurrentCompany(prev => ({
      ...prev,
      estimates: [...(prev.estimates || []), estimate]
    }));
  }, []);

  const updateEstimate = useCallback((estimate: Estimate) => {
    setCurrentCompany(prev => ({
      ...prev,
      estimates: prev.estimates?.map(e => e.id === estimate.id ? estimate : e) || []
    }));
  }, []);

  const deleteEstimate = useCallback((estimateId: string) => {
    setCurrentCompany(prev => ({
      ...prev,
      estimates: prev.estimates?.filter(e => e.id !== estimateId) || []
    }));
  }, []);

  // Purchase Order operations
  const addPurchaseOrder = useCallback((po: PurchaseOrder) => {
    setCurrentCompany(prev => ({
      ...prev,
      purchaseOrders: [...(prev.purchaseOrders || []), po]
    }));
  }, []);

  const updatePurchaseOrder = useCallback((po: PurchaseOrder) => {
    setCurrentCompany(prev => ({
      ...prev,
      purchaseOrders: prev.purchaseOrders?.map(p => p.id === po.id ? po : p) || []
    }));
  }, []);

  const deletePurchaseOrder = useCallback((poId: string) => {
    setCurrentCompany(prev => ({
      ...prev,
      purchaseOrders: prev.purchaseOrders?.filter(p => p.id !== poId) || []
    }));
  }, []);

  const approvePurchaseOrder = useCallback((poId: string) => {
    setCurrentCompany(prev => ({
      ...prev,
      purchaseOrders: prev.purchaseOrders?.map(p => p.id === poId ? { ...p, status: 'Approved' } : p) || []
    }));
  }, []);

  const receivePurchaseOrder = useCallback((poId: string, items: { itemId: string; quantity: number }[]) => {
    setCurrentCompany(prev => {
      const updatedPOs = (prev.purchaseOrders || []).map(po => {
        if (po.id !== poId) return po;
        const updatedItems = po.items.map(it => {
          const found = items.find(i => i.itemId === (it.inventoryItemId || it.id));
          if (!found) return it;
          const newReceived = Math.min(it.quantity, (it.receivedQuantity || 0) + found.quantity);
          return { ...it, receivedQuantity: newReceived };
        });
        const fullyReceived = updatedItems.every(it => (it.receivedQuantity || 0) >= it.quantity);
        const status = fullyReceived ? 'Received' : 'Partially Received';
        return { ...po, items: updatedItems, status };
      });

      const updatedInventory = prev.inventory
        ? {
            ...prev.inventory,
            items: (prev.inventory.items || []).map(inv => {
              const inc = items.find(i => i.itemId === inv.id);
              if (!inc) return inv;
              return {
                ...inv,
                quantity: inv.quantity + inc.quantity,
                lastUpdated: new Date().toISOString().slice(0, 10)
              };
            })
          }
        : prev.inventory;

      return { ...prev, purchaseOrders: updatedPOs, inventory: updatedInventory };
    });
  }, []);

  // Enhanced utility functions
  const calculateTotalRevenue = useCallback(() => {
    return currentCompany.invoices?.reduce((total, invoice) => total + invoice.total, 0) || 0;
  }, [currentCompany.invoices]);

  const calculateTotalExpenses = useCallback(() => {
    return currentCompany.expenses?.reduce((total, expense) => {
      const amount = typeof expense.amount === 'number' ? expense.amount : parseFloat(expense.amount.toString());
      return total + amount;
    }, 0) || 0;
  }, [currentCompany.expenses]);

  const getCustomerInvoices = useCallback((customerId: string) => {
    return currentCompany.invoices?.filter(invoice => invoice.customerId === customerId) || [];
  }, [currentCompany.invoices]);

  const getProjectsByCustomer = useCallback((customerId: string) => {
    return currentCompany.projects?.filter(project => project.clientId === customerId) || [];
  }, [currentCompany.projects]);

  const value: CompanyContextType = {
    currentCompany,
    companies,
    updateCompany: setCurrentCompany,
    switchCompany: () => {},
    addCompany: () => {},
    
    // Customer operations
    addCustomer,
    updateCustomer,
    deleteCustomer,
    
    // Invoice operations
    addInvoice,
    updateInvoice,
    deleteInvoice,
    
    // Expense operations
    addExpense,
    updateExpense,
    deleteExpense,
    
    // Transaction operations
    addTransaction,
    updateTransaction,
    deleteTransaction,
    
    // Project operations
    addProject,
    updateProject,
    deleteProject,
    
    // Employee operations
    addEmployee,
    updateEmployee,
    deleteEmployee,
    
    // Sales operations
    addSale,
    updateSale,
    deleteSale,
    
    // Estimates operations
    addEstimate,
    updateEstimate,
    deleteEstimate,
    
    // Utility functions
    calculateTotalRevenue,
    calculateTotalExpenses,
    getCustomerInvoices,
    getProjectsByCustomer,
    
    // Tax Rate operations
    updateTaxRate: (taxRate) => {
      setCurrentCompany(prev => ({
        ...prev,
        taxRates: prev.taxRates?.map(tr => tr.id === taxRate.id ? taxRate : tr) || []
      }));
    },
    addTaxRate: (taxRate) => {
      setCurrentCompany(prev => ({
        ...prev,
        taxRates: [...(prev.taxRates || []), taxRate]
      }));
    },
    deleteTaxRate: (taxRateId) => {
      setCurrentCompany(prev => ({
        ...prev,
        taxRates: prev.taxRates?.filter(tr => tr.id !== taxRateId) || []
      }));
    },
    
    // Account operations
    updateAccount: (account) => {
      setCurrentCompany(prev => ({
        ...prev,
        accounts: prev.accounts?.map(acc => acc.id === account.id ? account : acc) || []
      }));
    },
    addAccount: (account) => {
      setCurrentCompany(prev => ({
        ...prev,
        accounts: [...(prev.accounts || []), account]
      }));
    },
    deleteAccount: (accountId) => {
      setCurrentCompany(prev => ({
        ...prev,
        accounts: prev.accounts?.filter(acc => acc.id !== accountId) || []
      }));
    },
    
    // Bank Account operations
    addBankAccount: (bankAccount) => {
      setCurrentCompany(prev => ({
        ...prev,
        bankAccounts: [...(prev.bankAccounts || []), bankAccount]
      }));
    },
    updateBankAccount: (bankAccount) => {
      setCurrentCompany(prev => ({
        ...prev,
        bankAccounts: prev.bankAccounts?.map(ba => ba.id === bankAccount.id ? bankAccount : ba) || []
      }));
    },
    deleteBankAccount: (bankAccountId) => {
      setCurrentCompany(prev => ({
        ...prev,
        bankAccounts: prev.bankAccounts?.filter(ba => ba.id !== bankAccountId) || []
      }));
    },
    
    // Budget operations
    addBudget: (budget) => {
      setCurrentCompany(prev => ({
        ...prev,
        budgets: [...(prev.budgets || []), budget]
      }));
    },
    updateBudget: (budget) => {
      setCurrentCompany(prev => ({
        ...prev,
        budgets: prev.budgets?.map(b => b.id === budget.id ? budget : b) || []
      }));
    },
    deleteBudget: (budgetId) => {
      setCurrentCompany(prev => ({
        ...prev,
        budgets: prev.budgets?.filter(b => b.id !== budgetId) || []
      }));
    },
    
    // Time Entry operations
    addTimeEntry: (timeEntry) => {
      setCurrentCompany(prev => ({
        ...prev,
        timeEntries: [...(prev.timeEntries || []), timeEntry]
      }));
    },
    updateTimeEntry: (timeEntryId, updates) => {
      setCurrentCompany(prev => ({
        ...prev,
        timeEntries: prev.timeEntries?.map(te => 
          te.id === timeEntryId ? { ...te, ...updates } : te
        ) || []
      }));
    },
    deleteTimeEntry: (timeEntryId) => {
      setCurrentCompany(prev => ({
        ...prev,
        timeEntries: prev.timeEntries?.filter(te => te.id !== timeEntryId) || []
      }));
    },
    
    // Payroll operations
    processPayroll: (payrollData) => {
      setCurrentCompany(prev => ({
        ...prev,
        payrollData: {
          ...prev.payrollData,
          ...payrollData
        }
      }));
    }
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
