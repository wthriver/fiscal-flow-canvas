
import { Company, Invoice, Expense, TaxRate, Account, Transaction, Budget, Estimate, BudgetCategory } from './company';

export interface CompanyContextType {
  currentCompany: Company;
  companies: Company[];
  updateCompany: (updatedCompany: Company) => void;
  switchCompany: (companyId: string) => void;
  addCompany: (company: Company) => void;
  
  // Tax operations
  updateTaxRate: (taxRate: TaxRate) => void;
  addTaxRate: (taxRate: TaxRate) => void;
  deleteTaxRate: (taxRateId: string) => void;
  
  // Account operations
  updateAccount: (account: Account) => void;
  addAccount: (account: Account) => void;
  deleteAccount: (accountId: string) => void;
  
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
  updateTransaction: (transaction: Transaction) => void;
  addTransaction: (transaction: Transaction, bankAccountId: string) => void;
  deleteTransaction: (transactionId: string, bankAccountId: string) => void;
  
  // Payroll operations
  processPayroll: (payrollData: any) => void;
}
