import React, { createContext, useContext, useState } from "react";

// Define types for Company and all related data
export interface Company {
  id: string;
  name: string;
  logo?: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  taxId?: string;
  currency: string;
  fiscalYear: string;
  fiscalYearStart?: string;
  industry?: string;
  inventory: InventoryItem[];
  invoices: Invoice[];
  expenses: Expense[];
  customers: Customer[];
  vendors: Vendor[];
  employees: Employee[];
  bankAccounts: BankAccount[];
  transactions: Transaction[];
  timeEntries: TimeEntry[];
  payrollData: PayrollData;
  auditTrail: AuditEntry[];
  budgets: Budget[];
  integrations: Integration[];
  accounts: BankAccount[]; // Adding accounts
  projects: Project[];
  sales: Sale[];
  taxReports: TaxReport[];
  taxRates: TaxRate[];
  // Dashboard metrics
  revenue: {
    current: number;
    lastMonth: number;
    percentChange: number;
  };
  outstandingInvoices: {
    amount: number;
    count: number;
    percentChange: number;
  };
  profitMargin: {
    value: number;
    percentChange: number;
  };
  activeCustomers: {
    count: number;
    percentChange: number;
  };
}

export interface InventoryItem {
  id: string;
  name: string;
  sku?: string;
  category: string;
  quantity: number;
  reorderPoint: number;
  costPrice: string;
  sellPrice: string;
  status: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  amount: string;
  status: string;
  paymentStatus?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: string;
  amount: string;
}

export interface Expense {
  id: string;
  date: string;
  vendor: string;
  category: string;
  description?: string;
  amount: string;
  status: string;
  paymentMethod: string;
  receiptImageUrl?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  balance: string;
  dateAdded: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  payRate: string;
  payType: string;
  startDate: string;
  status: string;
  taxInfo?: {
    ssn: string;
    withholdings: number;
    filingStatus: string;
  };
  bankInfo?: {
    accountNumber: string;
    routingNumber: string;
    accountType: string;
  };
}

export interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  balance: string;
  accountType: string;
  institution: string;
  lastReconciled?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description?: string;
  amount: string;
  type: string;
  category: string;
  bankAccount: string;
  account: string;
  reconciled: boolean;
}

export interface TimeEntry {
  id: string;
  employeeId: string;
  projectId?: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  description?: string;
  billable: boolean;
  billing?: {
    rate: string;
    amount: string;
  };
}

export interface PayrollData {
  payPeriods: PayPeriod[];
  taxSettings: TaxSettings;
  benefits: Benefit[];
}

export interface PayPeriod {
  id: string;
  startDate: string;
  endDate: string;
  payDate: string;
  status: string;
  employees: PayrollEmployee[];
  totalGross: string;
  totalNet: string;
  totalTaxes: string;
  totalDeductions: string;
}

export interface PayrollEmployee {
  employeeId: string;
  hoursWorked: number;
  grossPay: string;
  taxes: string;
  deductions: string;
  netPay: string;
}

export interface TaxSettings {
  federalEin: string;
  stateId: string;
  filingFrequency: string;
  taxRates: {
    federal: number;
    state: number;
    fica: {
      social: number;
      medicare: number;
    };
    futa: number;
    suta: number;
  };
}

export interface Benefit {
  id: string;
  name: string;
  type: string;
  employerContribution: string;
  employeeContribution: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
}

export interface Budget {
  id: string;
  name: string;
  period: string;
  startDate: string;
  endDate: string;
  categories: BudgetCategory[];
  totalBudgeted: string;
  totalActual: string;
  variance?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  budgetedAmount: string;
  actualAmount: string;
  variance: string;
}

export interface Integration {
  id: string;
  name: string;
  provider: string;
  status: string;
  lastSync: string;
  syncFrequency: string;
  connectionDetails: {
    [key: string]: string;
  };
}

export interface Project {
  id: string;
  name: string;
  client: string;
  startDate: string;
  dueDate: string;
  status: string;
  budget: number;
  spent: number;
  progress: number;
  description?: string;
  endDate?: string;
  tracked?: string;
  billed?: string;
  remaining?: string;
  documents?: ProjectDocument[];
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  lastModified: string;
  url: string;
}

export interface Sale {
  id: string;
  date: string;
  customer: string;
  amount: string;
  items: SaleItem[];
  status: string;
  paymentStatus?: string;
  total?: string;
}

export interface SaleItem {
  id: string;
  product: string;
  quantity: number;
  price: string;
  total: string;
}

export interface TaxReport {
  id: string;
  name: string;
  period: string;
  dueDate: string;
  status: string;
  amount: string;
}

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  type: string;
  effectiveDate: string;
}

export interface Estimate {
  id: string;
  estimateNumber: string;
  customer: string;
  date: string;
  expiryDate: string;
  items: EstimateItem[];
  amount: string;
  status: string;
  notes?: string;
  termsAndConditions?: string;
}

export interface EstimateItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: string;
  amount: string;
}

// Sample data
// ... keep existing code (sample company data, sampleCompany and sampleCompany2)

// Create context
type CompanyContextType = {
  companies: Company[];
  currentCompany: Company;
  setCurrentCompany: (company: Company) => void;
  switchCompany: (companyId: string) => void;
  addCompany: (companyData: Partial<Company>) => void;
  updateCompany: (companyId: string, companyData: Partial<Company>) => void;
  addTransaction: (transaction: Partial<Transaction>) => void;
  addExpense: (expense: Partial<Expense>) => void;
  addInvoice: (invoice: Partial<Invoice>) => void;
  addEstimate: (estimate: Partial<Estimate>) => void;
  addProjectDocument: (projectId: string, document: ProjectDocument) => void;
  addTimeEntry: (timeEntry: Partial<TimeEntry>) => void;
  calculateTax: (amount: number, taxRateId: string) => number;
  processPayroll: (payrollId: string) => void;
  updateBudget: (budgetId: string, budgetData: Partial<Budget>) => void;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Provider component
export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<Company[]>([sampleCompany, sampleCompany2]);
  const [currentCompany, setCurrentCompany] = useState<Company>(companies[0]);

  // Switch between companies
  const switchCompany = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      setCurrentCompany(company);
    }
  };

  // Add a new company
  const addCompany = (companyData: Partial<Company>) => {
    const newCompany: Company = {
      id: `comp-${Date.now()}`,
      name: companyData.name || "New Company",
      address: companyData.address || "",
      phone: companyData.phone || "",
      email: companyData.email || "",
      website: companyData.website || "",
      taxId: companyData.taxId || "",
      currency: companyData.currency || "USD",
      fiscalYear: companyData.fiscalYear || "Jan 1 - Dec 31",
      fiscalYearStart: companyData.fiscalYearStart || "January 1",
      industry: companyData.industry || "",
      inventory: companyData.inventory || [],
      invoices: companyData.invoices || [],
      expenses: companyData.expenses || [],
      customers: companyData.customers || [],
      vendors: companyData.vendors || [],
      employees: companyData.employees || [],
      bankAccounts: companyData.bankAccounts || [],
      transactions: companyData.transactions || [],
      timeEntries: companyData.timeEntries || [],
      payrollData: companyData.payrollData || {
        payPeriods: [],
        taxSettings: {
          federalEin: "",
          stateId: "",
          filingFrequency: "Monthly",
          taxRates: {
            federal: 0,
            state: 0,
            fica: {
              social: 0,
              medicare: 0
            },
            futa: 0,
            suta: 0
          }
        },
        benefits: []
      },
      auditTrail: companyData.auditTrail || [],
      budgets: companyData.budgets || [],
      integrations: companyData.integrations || [],
      accounts: companyData.accounts || [],
      projects: companyData.projects || [],
      sales: companyData.sales || [],
      taxReports: companyData.taxReports || [],
      taxRates: companyData.taxRates || [],
      revenue: companyData.revenue || {
        current: 0,
        lastMonth: 0,
        percentChange: 0
      },
      outstandingInvoices: companyData.outstandingInvoices || {
        amount: 0,
        count: 0,
        percentChange: 0
      },
      profitMargin: companyData.profitMargin || {
        value: 0,
        percentChange: 0
      },
      activeCustomers: companyData.activeCustomers || {
        count: 0,
        percentChange: 0
      }
    };
    
    setCompanies(prev => [...prev, newCompany]);
    setCurrentCompany(newCompany);
  };

  // Update company information
  const updateCompany = (companyId: string, companyData: Partial<Company>) => {
    setCompanies(prev => 
      prev.map(company => 
        company.id === companyId 
          ? { ...company, ...companyData } 
          : company
      )
    );
    
    if (currentCompany.id === companyId) {
      setCurrentCompany(prev => ({ ...prev, ...companyData }));
    }
  };

  // Add a new transaction
  const addTransaction = (transaction: Partial<Transaction>) => {
    const newTransaction: Transaction = {
      id: transaction.id || `trans-${Date.now()}`,
      date: transaction.date || new Date().toISOString().split('T')[0],
      description: transaction.description || "",
      amount: transaction.amount || "$0.00",
      type: transaction.type || "Deposit",
      category: transaction.category || "Uncategorized",
      bankAccount: transaction.bankAccount || "",
      account: transaction.account || "",
      reconciled: transaction.reconciled || false
    };
    
    updateCompany(currentCompany.id, {
      transactions: [...currentCompany.transactions, newTransaction]
    });
  };

  // Add a new expense
  const addExpense = (expense: Partial<Expense>) => {
    const newExpense: Expense = {
      id: expense.id || `exp-${Date.now()}`,
      date: expense.date || new Date().toISOString().split('T')[0],
      vendor: expense.vendor || "",
      category: expense.category || "Uncategorized",
      description: expense.description || "",
      amount: expense.amount || "$0.00",
      status: expense.status || "Pending",
      paymentMethod: expense.paymentMethod || "Cash"
    };
    
    updateCompany(currentCompany.id, {
      expenses: [...currentCompany.expenses, newExpense]
    });
  };

  // Add a new invoice
  const addInvoice = (invoice: Partial<Invoice>) => {
    const newInvoice: Invoice = {
      id: invoice.id || `inv-${Date.now()}`,
      invoiceNumber: invoice.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`,
      customer: invoice.customer || "",
      date: invoice.date || new Date().toISOString().split('T')[0],
      dueDate: invoice.dueDate || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      items: invoice.items || [],
      amount: invoice.amount || "$0.00",
      status: invoice.status || "Draft"
    };
    
    updateCompany(currentCompany.id, {
      invoices: [...currentCompany.invoices, newInvoice]
    });
  };

  // Add a new estimate
  const addEstimate = (estimate: Partial<Estimate>) => {
    const newEstimate: Estimate = {
      id: estimate.id || `est-${Date.now()}`,
      estimateNumber: estimate.estimateNumber || `EST-${Date.now().toString().slice(-6)}`,
      customer: estimate.customer || "",
      date: estimate.date || new Date().toISOString().split('T')[0],
      expiryDate: estimate.expiryDate || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      items: estimate.items || [],
      amount: estimate.amount || "$0.00",
      status: estimate.status || "Draft",
      notes: estimate.notes,
      termsAndConditions: estimate.termsAndConditions
    };
    
    // Add estimates to company data
    const currentEstimates = currentCompany.estimates || [];
    updateCompany(currentCompany.id, {
      estimates: [...currentEstimates, newEstimate]
    });
  };

  // Add a project document
  const addProjectDocument = (projectId: string, document: ProjectDocument) => {
    const updatedProjects = currentCompany.projects.map(project => {
      if (project.id === projectId) {
        const documents = project.documents || [];
        return {
          ...project,
          documents: [...documents, document]
        };
      }
      return project;
    });
    
    updateCompany(currentCompany.id, { projects: updatedProjects });
  };

  // Add a new time entry
  const addTimeEntry = (timeEntry: Partial<TimeEntry>) => {
    const newTimeEntry: TimeEntry = {
      id: timeEntry.id || `time-${Date.now()}`,
      employeeId: timeEntry.employeeId || "",
      projectId: timeEntry.projectId,
      date: timeEntry.date || new Date().toISOString().split('T')[0],
      startTime: timeEntry.startTime || "",
      endTime: timeEntry.endTime || "",
      duration: timeEntry.duration || "0:00",
      description: timeEntry.description,
      billable: timeEntry.billable || false,
      billing: timeEntry.billing
    };
    
    updateCompany(currentCompany.id, {
      timeEntries: [...currentCompany.timeEntries, newTimeEntry]
    });
  };

  // Calculate tax based on amount and tax rate
  const calculateTax = (amount: number, taxRateId: string): number => {
    const taxRate = currentCompany.taxRates.find(rate => rate.id === taxRateId);
    if (!taxRate) return 0;
    
    return amount * (taxRate.rate / 100);
  };

  // Process payroll
  const processPayroll = (payrollId: string) => {
    const updatedPayPeriods = currentCompany.payrollData.payPeriods.map(period => {
      if (period.id === payrollId) {
        return {
          ...period,
          status: "Completed"
        };
      }
      return period;
    });
    
    const updatedPayrollData = {
      ...currentCompany.payrollData,
      payPeriods: updatedPayPeriods
    };
    
    updateCompany(currentCompany.id, { payrollData: updatedPayrollData });
  };

  // Update budget
  const updateBudget = (budgetId: string, budgetData: Partial<Budget>) => {
    const updatedBudgets = currentCompany.budgets.map(budget => {
      if (budget.id === budgetId) {
        return {
          ...budget,
          ...budgetData
        };
      }
      return budget;
    });
    
    updateCompany(currentCompany.id, { budgets: updatedBudgets });
  };

  const contextValue: CompanyContextType = {
    companies,
    currentCompany,
    setCurrentCompany,
    switchCompany,
    addCompany,
    updateCompany,
    addTransaction,
    addExpense,
    addInvoice,
    addEstimate,
    addProjectDocument,
    addTimeEntry,
    calculateTax,
    processPayroll,
    updateBudget
  };

  return (
    <CompanyContext.Provider value={contextValue}>
      {children}
    </CompanyContext.Provider>
  );
};

// Custom hook to use the context
export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
};
