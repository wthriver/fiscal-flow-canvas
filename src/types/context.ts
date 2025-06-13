
import { Company, Invoice, Expense, TaxRate, Account, Transaction, Budget, Estimate, BankAccount, TimeEntry, Project, Sale, Customer, Employee } from './company';

export interface CompanyContextType {
  currentCompany: Company;
  companies: Company[];
  updateCompany: (updatedCompany: Company) => void;
  switchCompany: (companyId: string) => void;
  addCompany: (company: Company) => void;
  
  // Customer operations
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (customerId: string) => void;
  
  // Tax operations
  updateTaxRate: (taxRate: TaxRate) => void;
  addTaxRate: (taxRate: TaxRate) => void;
  deleteTaxRate: (taxRateId: string) => void;
  
  // Account operations
  updateAccount: (account: Account) => void;
  addAccount: (account: Account) => void;
  deleteAccount: (accountId: string) => void;
  
  // Bank Account operations
  addBankAccount: (bankAccount: BankAccount) => void;
  updateBankAccount: (bankAccount: BankAccount) => void;
  deleteBankAccount: (bankAccountId: string) => void;
  
  // Expense operations
  addExpense: (expense: Expense) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (expenseId: string) => void;
  
  // Invoice operations
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (invoiceId: string) => void;
  
  // Estimate operations
  addEstimate: (estimate: Estimate) => void;
  updateEstimate: (estimate: Estimate) => void;
  deleteEstimate: (estimateId: string) => void;
  
  // Budget operations
  addBudget: (budget: Budget) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (budgetId: string) => void;
  
  // Transaction operations
  updateTransaction: (transactionId: string, updates: Partial<Transaction>) => void;
  addTransaction: (transaction: Transaction) => void;
  deleteTransaction: (transactionId: string, bankAccountId: string) => void;
  
  // Project operations
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  
  // Employee operations
  addEmployee: (employee: Employee) => void;
  updateEmployee: (employee: Employee) => void;
  deleteEmployee: (employeeId: string) => void;
  
  // Time Entry operations
  addTimeEntry?: (timeEntry: TimeEntry) => void;
  updateTimeEntry?: (timeEntryId: string, updates: Partial<TimeEntry>) => void;
  deleteTimeEntry?: (timeEntryId: string) => void;
  
  // Sale operations
  addSale?: (sale: Sale) => void;
  updateSale?: (sale: Sale) => void;
  deleteSale?: (saleId: string) => void;
  
  // Payroll operations
  processPayroll: (payrollData: any) => void;
  
  // Utility functions
  calculateTotalRevenue: () => number;
  calculateTotalExpenses: () => number;
  getCustomerInvoices: (customerId: string) => Invoice[];
  getProjectsByCustomer: (customerId: string) => Project[];
}
