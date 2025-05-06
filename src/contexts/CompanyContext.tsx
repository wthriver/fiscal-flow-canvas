
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for our domain
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactName?: string;
  type?: string;
  status?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface Invoice {
  id: string;
  customerId: string;
  amount: string;
  status: string;
  date: string;
  dueDate: string;
  customer?: string; // Added for compatibility
}

export interface Transaction {
  id: string;
  date: string;
  amount: string;
  description: string;
  category: string;
  type: string;
  bankAccount: string;
  reconciled?: boolean;
  account?: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  sku: string;
  stock: number;
}

export interface BankAccount {
  id: string;
  name: string;
  type: string;
  balance: string;
  lastTransaction: string;
  lastSync?: string;
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  lastModified?: string;
  url?: string; // Added for compatibility
}

export interface ProjectTask {
  id: string;
  name: string;
  status: string;
  assignee: string;
  dueDate: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  status: string;
  dueDate: string;
  budget: string;
  spent: string;
  manager: string;
  team: string[];
  documents: ProjectDocument[];
  tasks: ProjectTask[];
  tracked?: number | string;
  billed?: number | string;
  description?: string; // Added for compatibility
  startDate?: string; // Added for compatibility
  endDate?: string; // Added for compatibility
  progress?: number; // Added for compatibility
  remaining?: string; // Added for compatibility
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  startDate: string;
  status?: string;
  payRate?: string;
  payType?: string;
}

export interface PayrollEmployee {
  employeeId: string;
  grossPay: string;
  netPay: string;
  taxes: string;
  deductions: string;
}

export interface PayPeriod {
  id: string;
  startDate: string;
  endDate: string;
  payDate: string;
  status: string;
  totalGross: string;
  totalNet: string;
  totalTaxes: string;
  totalDeductions: string;
  employees: PayrollEmployee[];
}

export interface PayrollData {
  payPeriods: PayPeriod[];
}

export interface TimeEntry {
  id: string;
  projectId: string;
  employeeId: string;
  date: string;
  hours: number;
  description: string;
  billable: boolean;
  status: string;
  duration?: number | string;
  startTime?: string;
  endTime?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  budgetedAmount: string;
  actualAmount: string;
  variance: string;
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
  variance: string;
}

export interface EstimateItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: string;
  amount: string;
}

export interface Estimate {
  id: string;
  customerId: string;
  amount: string;
  status: string;
  date: string;
  expiryDate: string;
  items: EstimateItem[];
  notes: string;
  termsAndConditions?: string;
  customer?: string; // For compatibility
  estimateNumber?: string; // For compatibility
}

// Additional interfaces for components
export interface OutstandingInvoice {
  amount: number;
  percentChange: number;
}

export interface ActiveCustomers {
  count: number;
  percentChange: number;
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

export interface Expense {
  id: string;
  date: string;
  vendor: string;
  category: string;
  amount: string;
  status: string;
  receipt?: string;
  paymentMethod?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  cost: string;
  location: string;
}

export interface InventoryCategory {
  id: string;
  name: string;
  description: string;
}

export interface InventoryLocation {
  id: string;
  name: string;
  address: string;
}

export interface Inventory {
  items: InventoryItem[];
  categories: InventoryCategory[];
  locations: InventoryLocation[];
  bundles: any[];
  serialNumbers: any[];
  lotTracking: any[];
}

export interface Integration {
  id: string;
  name: string;
  type: string;
  status: string;
  lastSync?: string;
  provider?: string;
  syncFrequency?: string;
}

export interface AuditTrailEntry {
  id: string;
  date: string;
  user: string;
  action: string;
  details: string;
  timestamp?: string;
  userName?: string;
  module?: string;
  ipAddress?: string;
}

export interface Sale {
  id: string;
  customerId: string;
  amount: string;
  date: string;
  items: any[];
  status: string;
  customer?: string;
}

// Additional needed properties for various components
export interface Company {
  id: string;
  name: string;
  customers: Customer[];
  invoices: Invoice[];
  products: Product[];
  bankAccounts: BankAccount[];
  transactions: Transaction[];
  projects: Project[];
  employees: Employee[];
  payrollData: PayrollData;
  timeEntries: TimeEntry[];
  budgets: Budget[];
  estimates: Estimate[];
  
  // Additional properties needed by components
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  taxId?: string;
  industry?: string;
  fiscalYearStart?: string;
  fiscalYear?: string;
  revenue?: RevenueData | any[];
  profitMargin?: ProfitMarginData | any[];
  taxRates?: any[];
  accounts?: any[];
  expenses?: Expense[];
  inventory?: Inventory;
  outstandingInvoices?: OutstandingInvoice;
  activeCustomers?: ActiveCustomers;
  integrations?: Integration[];
  auditTrail?: AuditTrailEntry[];
  sales?: Sale[];
}

// Context interface
interface CompanyContextType {
  currentCompany: Company;
  updateCompany: (id: string, updatedFields: Partial<Company>) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updatedFields: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, updatedFields: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  addProduct: (product: Product) => void;
  addBankAccount: (account: BankAccount) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updatedFields: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updatedFields: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addProjectDocument: (projectId: string, document: ProjectDocument) => void;
  deleteProjectDocument: (projectId: string, documentId: string) => void;
  addTimeEntry: (entry: TimeEntry) => void;
  updateTimeEntry: (id: string, updatedFields: Partial<TimeEntry>) => void;
  deleteTimeEntry: (id: string) => void;
  processPayroll: (payrollId: string) => void;
  updateBudget: (id: string, updatedFields: Partial<Budget>) => void;
  addEstimate: (estimate: Estimate) => void;
  updateEstimate: (id: string, updatedFields: Partial<Estimate>) => void;
  deleteEstimate: (id: string) => void;
  companies?: Company[];
  switchCompany?: (id: string) => void;
  addCompany?: (company: Company) => void;
  addExpense?: (expense: any) => void;
  calculateTax?: (data: any) => any;
  addSale?: (sale: Sale) => void;
  updateSale?: (id: string, updatedFields: Partial<Sale>) => void;
  deleteSale?: (id: string) => void;
}

// Create context with default value
const CompanyContext = createContext<CompanyContextType | null>(null);

// Initial company data
const initialCompany: Company = {
  id: "company-1",
  name: "Acme Corporation",
  customers: [
    {
      id: "customer-1",
      name: "ABC Corp",
      email: "contact@abccorp.com",
      phone: "(555) 123-4567",
      address: "123 Main St, Anytown, USA",
      contactName: "John Smith",
      type: "Business",
      status: "Active",
      city: "Anytown",
      state: "CA",
      postalCode: "12345",
      country: "USA"
    },
    {
      id: "customer-2",
      name: "XYZ Industries",
      email: "info@xyzindustries.com",
      phone: "(555) 987-6543",
      address: "456 Oak Ave, Othertown, USA",
      contactName: "Jane Doe",
      type: "Business",
      status: "Active",
      city: "Othertown",
      state: "NY",
      postalCode: "67890",
      country: "USA"
    }
  ],
  invoices: [
    {
      id: "invoice-1",
      customerId: "customer-1",
      amount: "$1,200.00",
      status: "Paid",
      date: "2023-09-15",
      dueDate: "2023-10-15",
      customer: "ABC Corp" // Added for compatibility
    },
    {
      id: "invoice-2",
      customerId: "customer-2",
      amount: "$2,500.00",
      status: "Pending",
      date: "2023-09-20",
      dueDate: "2023-10-20",
      customer: "XYZ Industries" // Added for compatibility
    }
  ],
  products: [
    {
      id: "product-1",
      name: "Premium Widget",
      price: "$120.00",
      sku: "WDG-001",
      stock: 50
    },
    {
      id: "product-2",
      name: "Deluxe Gadget",
      price: "$250.00",
      sku: "GDG-001",
      stock: 25
    }
  ],
  bankAccounts: [
    {
      id: "account-1",
      name: "Operating Account",
      type: "Checking",
      balance: "$24,500.00",
      lastTransaction: "2023-09-25",
      lastSync: "2023-09-25"
    },
    {
      id: "account-2",
      name: "Savings Account",
      type: "Savings",
      balance: "$100,000.00",
      lastTransaction: "2023-09-20",
      lastSync: "2023-09-20"
    }
  ],
  transactions: [
    {
      id: "transaction-1",
      date: "2023-09-25",
      amount: "$1,200.00",
      description: "Payment from ABC Corp",
      category: "Income",
      type: "Credit",
      bankAccount: "Operating Account",
      reconciled: true
    },
    {
      id: "transaction-2",
      date: "2023-09-24",
      amount: "$350.00",
      description: "Office Supplies",
      category: "Expenses",
      type: "Debit",
      bankAccount: "Operating Account",
      reconciled: false
    }
  ],
  projects: [
    {
      id: "project-1",
      name: "Website Redesign",
      client: "ABC Corp",
      status: "In Progress",
      dueDate: "2023-11-30",
      budget: "$15,000.00",
      spent: "$8,200.00",
      manager: "Jane Smith",
      team: ["John Doe", "Alice Johnson"],
      documents: [
        {
          id: "doc-1",
          name: "Website Requirements.pdf",
          type: "PDF",
          size: "2.3 MB",
          uploadDate: "2023-08-15"
        },
        {
          id: "doc-2",
          name: "Design Mockups.zip",
          type: "ZIP",
          size: "34.5 MB",
          uploadDate: "2023-09-10"
        }
      ],
      tasks: [
        {
          id: "task-1",
          name: "Create wireframes",
          status: "Completed",
          assignee: "John Doe",
          dueDate: "2023-09-15"
        },
        {
          id: "task-2",
          name: "Develop frontend",
          status: "In Progress",
          assignee: "Alice Johnson",
          dueDate: "2023-10-15"
        }
      ],
      description: "Complete website redesign for ABC Corp",
      startDate: "2023-08-01",
      progress: 60
    },
    {
      id: "project-2",
      name: "Mobile App Development",
      client: "XYZ Industries",
      status: "Planning",
      dueDate: "2023-12-31",
      budget: "$35,000.00",
      spent: "$5,000.00",
      manager: "Robert Chen",
      team: ["Lisa Wang", "David Garcia"],
      documents: [
        {
          id: "doc-3",
          name: "App Specifications.docx",
          type: "DOCX",
          size: "1.5 MB",
          uploadDate: "2023-09-20"
        }
      ],
      tasks: [
        {
          id: "task-3",
          name: "Requirements gathering",
          status: "In Progress",
          assignee: "Lisa Wang",
          dueDate: "2023-10-05"
        }
      ],
      description: "Native mobile app for iOS and Android",
      startDate: "2023-09-01",
      progress: 15
    }
  ],
  employees: [
    {
      id: "emp-1",
      name: "John Doe",
      position: "Software Developer",
      department: "Engineering",
      email: "john@acme.com",
      phone: "(555) 111-2222",
      startDate: "2022-03-15"
    },
    {
      id: "emp-2",
      name: "Jane Smith",
      position: "Project Manager",
      department: "Project Management",
      email: "jane@acme.com",
      phone: "(555) 222-3333",
      startDate: "2021-07-10"
    }
  ],
  payrollData: {
    payPeriods: [
      {
        id: "pay-period-1",
        startDate: "2023-09-01",
        endDate: "2023-09-15",
        payDate: "2023-09-20",
        status: "Completed",
        totalGross: "$15,000.00",
        totalNet: "$11,250.00",
        totalTaxes: "$3,000.00",
        totalDeductions: "$750.00",
        employees: [
          {
            employeeId: "emp-1",
            grossPay: "$5,000.00",
            netPay: "$3,750.00",
            taxes: "$1,000.00",
            deductions: "$250.00"
          },
          {
            employeeId: "emp-2",
            grossPay: "$6,000.00",
            netPay: "$4,500.00",
            taxes: "$1,200.00",
            deductions: "$300.00"
          }
        ]
      },
      {
        id: "pay-period-2",
        startDate: "2023-09-16",
        endDate: "2023-09-30",
        payDate: "2023-10-05",
        status: "Pending",
        totalGross: "$15,000.00",
        totalNet: "$11,250.00",
        totalTaxes: "$3,000.00",
        totalDeductions: "$750.00",
        employees: [
          {
            employeeId: "emp-1",
            grossPay: "$5,000.00",
            netPay: "$3,750.00",
            taxes: "$1,000.00",
            deductions: "$250.00"
          },
          {
            employeeId: "emp-2",
            grossPay: "$6,000.00",
            netPay: "$4,500.00",
            taxes: "$1,200.00",
            deductions: "$300.00"
          }
        ]
      }
    ]
  },
  timeEntries: [
    {
      id: "time-1",
      projectId: "project-1",
      employeeId: "emp-1",
      date: "2023-09-25",
      hours: 8,
      description: "Frontend development",
      billable: true,
      status: "Approved"
    },
    {
      id: "time-2",
      projectId: "project-1",
      employeeId: "emp-2",
      date: "2023-09-25",
      hours: 6,
      description: "Project management",
      billable: true,
      status: "Pending"
    }
  ],
  budgets: [
    {
      id: "budget-1",
      name: "Q4 2023 Marketing",
      period: "Quarterly",
      startDate: "2023-10-01",
      endDate: "2023-12-31",
      categories: [
        {
          id: "cat-1",
          name: "Digital Advertising",
          budgetedAmount: "$5,000.00",
          actualAmount: "$2,500.00",
          variance: "$2,500.00"
        },
        {
          id: "cat-2",
          name: "Content Creation",
          budgetedAmount: "$3,000.00",
          actualAmount: "$1,000.00",
          variance: "$2,000.00"
        }
      ],
      totalBudgeted: "$8,000.00",
      totalActual: "$3,500.00",
      variance: "$4,500.00"
    }
  ],
  estimates: [
    {
      id: "estimate-1",
      customerId: "customer-1",
      amount: "$15,000.00",
      status: "Sent",
      date: "2023-09-10",
      expiryDate: "2023-10-10",
      items: [
        {
          id: "item-1",
          description: "Website Design",
          quantity: 1,
          unitPrice: "$5,000.00",
          amount: "$5,000.00"
        },
        {
          id: "item-2",
          description: "Frontend Development",
          quantity: 1,
          unitPrice: "$10,000.00",
          amount: "$10,000.00"
        }
      ],
      notes: "Payment due within 30 days of project completion",
      customer: "ABC Corp", // Added for compatibility
      estimateNumber: "EST-001" // Added for compatibility
    }
  ],
  // Added missing properties
  revenue: {
    current: 150000,
    previous: 125000,
    percentChange: 20
  },
  profitMargin: {
    value: 30,
    trend: 5,
    percentChange: 10
  },
  outstandingInvoices: {
    amount: 25000,
    percentChange: -15
  },
  activeCustomers: {
    count: 24,
    percentChange: 33
  },
  expenses: [
    {
      id: "expense-1",
      date: "2023-09-15",
      vendor: "Office Supply Co",
      category: "Office Supplies",
      amount: "$250.00",
      status: "Paid",
      paymentMethod: "Credit Card"
    },
    {
      id: "expense-2",
      date: "2023-09-20",
      vendor: "Travel Agency",
      category: "Travel",
      amount: "$850.00",
      status: "Pending",
      paymentMethod: "Company Card"
    }
  ],
  inventory: {
    items: [
      {
        id: "inv-1",
        name: "Premium Widget",
        sku: "WDG-001",
        category: "Widgets",
        quantity: 50,
        cost: "$80.00",
        location: "Main Warehouse"
      },
      {
        id: "inv-2",
        name: "Deluxe Gadget",
        sku: "GDG-001",
        category: "Gadgets",
        quantity: 25,
        cost: "$150.00",
        location: "Main Warehouse"
      }
    ],
    categories: [
      {
        id: "cat-1",
        name: "Widgets",
        description: "All widget products"
      },
      {
        id: "cat-2",
        name: "Gadgets",
        description: "All gadget products"
      }
    ],
    locations: [
      {
        id: "loc-1",
        name: "Main Warehouse",
        address: "123 Storage Ln, Warehouse District"
      }
    ],
    bundles: [],
    serialNumbers: [],
    lotTracking: []
  },
  integrations: [
    {
      id: "int-1",
      name: "Payment Processor",
      type: "Payment",
      status: "Active",
      lastSync: "2023-09-25",
      provider: "Stripe",
      syncFrequency: "Daily"
    },
    {
      id: "int-2",
      name: "CRM System",
      type: "CRM",
      status: "Pending",
      provider: "Salesforce",
      syncFrequency: "Hourly"
    }
  ],
  auditTrail: [
    {
      id: "audit-1",
      date: "2023-09-25",
      user: "admin",
      action: "Login",
      details: "User logged in from 192.168.1.1",
      timestamp: "2023-09-25T09:30:00",
      userName: "Administrator",
      module: "Authentication",
      ipAddress: "192.168.1.1"
    },
    {
      id: "audit-2",
      date: "2023-09-25",
      user: "john",
      action: "Create Invoice",
      details: "Created invoice #INV-001",
      timestamp: "2023-09-25T10:15:00",
      userName: "John Doe",
      module: "Invoicing",
      ipAddress: "192.168.1.2"
    }
  ],
  sales: [
    {
      id: "sale-1",
      customerId: "customer-1",
      amount: "$1,200.00",
      date: "2023-09-15",
      items: [
        {
          id: "item-1",
          name: "Premium Widget",
          quantity: 10,
          unitPrice: "$120.00",
          amount: "$1,200.00"
        }
      ],
      status: "Completed",
      customer: "ABC Corp"
    }
  ]
};

// Provider component
interface CompanyProviderProps {
  children: ReactNode;
}

export const CompanyProvider: React.FC<CompanyProviderProps> = ({ children }) => {
  const [currentCompany, setCurrentCompany] = useState<Company>(initialCompany);

  const updateCompany = (id: string, updatedFields: Partial<Company>) => {
    setCurrentCompany(prevCompany => {
      if (prevCompany.id !== id) return prevCompany;
      return { ...prevCompany, ...updatedFields };
    });
  };

  const addCustomer = (customer: Customer) => {
    setCurrentCompany(prevCompany => ({
      ...prevCompany,
      customers: [...prevCompany.customers, customer]
    }));
  };

  const updateCustomer = (id: string, updatedFields: Partial<Customer>) => {
    setCurrentCompany(prevCompany => ({
      ...prevCompany,
      customers: prevCompany.customers.map(customer => 
        customer.id === id ? { ...customer, ...updatedFields } : customer
      )
    }));
  };

  const deleteCustomer = (id: string) => {
    setCurrentCompany(prevCompany => ({
      ...prevCompany,
      customers: prevCompany.customers.filter(customer => customer.id !== id)
    }));
  };

  const addInvoice = (invoice: Invoice) => {
    setCurrentCompany(prevCompany => ({
      ...prevCompany,
      invoices: [...prevCompany.invoices, invoice]
    }));
  };

  const updateInvoice = (id: string, updatedFields: Partial<Invoice>) => {
    setCurrentCompany(prevCompany => ({
      ...prevCompany,
      invoices: prevCompany.invoices.map(invoice => 
        invoice.id === id ? { ...invoice, ...updatedFields } : invoice
      )
    }));
  };

  const deleteInvoice = (id: string) => {
    setCurrentCompany(prevCompany => ({
      ...prevCompany,
      invoices: prevCompany.invoices.filter(invoice => invoice.id !== id)
    }));
  };

  const addProduct = (product: Product) => {
    setCurrentCompany(prevCompany => ({
      ...prevCompany,
      products: [...prevCompany.products, product]
    }));
  };

  const addBankAccount = (account: BankAccount) => {
    setCurrentCompany(prevCompany => ({
      ...prevCompany,
      bankAccounts: [...prevCompany.bankAccounts, account]
    }));
  };

  const addTransaction = (transaction: Transaction) => {
    setCurrentCompany(prevCompany => ({
      ...prevCompany,
      transactions: [...prevCompany.transactions, transaction]
    }));
  };

  const updateTransaction = (id: string, updatedFields: Partial<Transaction>) => {
    setCurrentCompany(prevCompany => ({
      ...prevCompany,
      transactions: prevCompany.transactions.map(transaction => 
        transaction.id === id ? { ...transaction, ...updatedFields } : transaction
      )
    }));
  };

  const deleteTransaction = (id: string) => {
    setCurrentCompany(prevCompany => ({
      ...prevCompany,
      transactions: prevCompany.transactions.filter(transaction => transaction.id !== id)
    }));
  };

  const addProject = (project: Project) => {
    setCurrentCompany(prevCompany => ({
      ...prevCompany,
      projects: [...prevCompany.projects, project]
    }));
  };

  const updateProject = (id: string, updatedFields: Partial<Project>) => {
    setCurrentCompany(prevCompany => ({
      ...prevCompany,
      projects: prevCompany.projects.map(project => 
        project.id === id ? { ...project, ...updatedFields } : project
      )
    }));
  };

  const deleteProject = (id: string) => {
    setCurrentCompany(prevCompany => ({
      ...prevCompany,
      projects: prevCompany.projects.filter(project => project.id !== id)
    }));
  };

  const addProjectDocument = (projectId: string, document: ProjectDocument) => {
    setCurrentCompany(prevCompany => ({
      ...prevCompany,
      projects: prevCompany.projects.map(project => 
        project.id === projectId 
          ? { ...project, documents: [...project.documents, document] } 
          : project
      )
    }));
  };

  const deleteProjectDocument = (projectId: string, documentId: string) => {
    setCurrentCompany(prevCompany => ({
      ...prevCompany,
      projects: prevCompany.projects.map(project => 
        project.id === projectId 
          ? { 
              ...project, 
              documents: project.documents.filter(doc => doc.id !== documentId) 
            } 
          : project
      )
    }));
  };

  const addTimeEntry = (entry: TimeEntry) => {
    setCurrentCompany(prevCompany => ({
      ...prevCompany,
      timeEntries: [...prevCompany.timeEntries, entry]
    }));
  };

  const updateTimeEntry = (id: string, updatedFields: Partial<TimeEntry>) => {
    setCurrentCompany(prevCompany => ({
      ...prevCompany,
      timeEntries: prevCompany.timeEntries.map(entry => 
        entry.id === id ? { ...entry, ...updatedFields } : entry
      )
    }));
  };

  const deleteTimeEntry = (id: string) => {
    setCurrentCompany(prevCompany => ({
      ...prevCompany,
      timeEntries: prevCompany.timeEntries.filter(entry => entry.id !== id)
    }));
  };

  const processPayroll = (payrollId: string) => {
    setCurrentCompany(prevCompany => ({
      ...prevCompany,
      payrollData: {
        ...prevCompany.payrollData,
        payPeriods: prevCompany.payrollData.payPeriods.map(period => 
          period.id === payrollId 
            ? { ...period, status: "Completed" } 
            : period
        )
      }
    }));
  };

  const updateBudget = (id: string, updatedFields: Partial<Budget>) => {
    setCurrentCompany(prevCompany => ({
      ...prevCompany,
      budgets: prevCompany.budgets.map(budget => 
        budget.id === id ? { ...budget, ...updatedFields } : budget
      )
    }));
  };

  const addEstimate = (estimate: Estimate) => {
    setCurrentCompany(prevCompany => ({
      ...prevCompany,
      estimates: [...prevCompany.estimates, estimate]
    }));
  };

  const updateEstimate = (id: string, updatedFields: Partial<Estimate>) => {
    setCurrentCompany(prevCompany => ({
      ...prevCompany,
      estimates: prevCompany.estimates.map(estimate => 
        estimate.id === id ? { ...estimate, ...updatedFields } : estimate
      )
    }));
  };

  const deleteEstimate = (id: string) => {
    setCurrentCompany(prevCompany => ({
      ...prevCompany,
      estimates: prevCompany.estimates.filter(estimate => estimate.id !== id)
    }));
  };

  // Add sales management functions
  const addSale = (sale: Sale) => {
    setCurrentCompany(prevCompany => ({
      ...prevCompany,
      sales: [...(prevCompany.sales || []), sale]
    }));
  };

  const updateSale = (id: string, updatedFields: Partial<Sale>) => {
    setCurrentCompany(prevCompany => ({
      ...prevCompany,
      sales: (prevCompany.sales || []).map(sale => 
        sale.id === id ? { ...sale, ...updatedFields } : sale
      )
    }));
  };

  const deleteSale = (id: string) => {
    setCurrentCompany(prevCompany => ({
      ...prevCompany,
      sales: (prevCompany.sales || []).filter(sale => sale.id !== id)
    }));
  };

  // Mock implementation for the missing methods to fix build errors
  const calculateTax = (data: any) => {
    // Simple implementation to satisfy type requirements
    return { tax: parseFloat(data.income) * 0.2 };
  };

  const addExpense = (expense: any) => {
    // Simple implementation to satisfy type requirements
    console.log("Adding expense:", expense);
    
    setCurrentCompany(prevCompany => ({
      ...prevCompany,
      expenses: [...(prevCompany.expenses || []), expense]
    }));
  };

  const addCompany = (company: Company) => {
    // Actually implement addCompany for TopBar
    console.log(`Adding company ${company.name}`);
    setCurrentCompany(company);
  };

  return (
    <CompanyContext.Provider value={{ 
      currentCompany, 
      updateCompany,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      addProduct,
      addBankAccount,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addProject,
      updateProject,
      deleteProject,
      addProjectDocument,
      deleteProjectDocument,
      addTimeEntry,
      updateTimeEntry,
      deleteTimeEntry,
      processPayroll,
      updateBudget,
      addEstimate,
      updateEstimate,
      deleteEstimate,
      // Add missing methods to fix build errors
      calculateTax,
      addExpense,
      companies: [initialCompany],
      switchCompany: (id: string) => console.log(`Switch to company ${id}`),
      addCompany,
      addSale,
      updateSale,
      deleteSale
    }}>
      {children}
    </CompanyContext.Provider>
  );
};

// Custom hook to use the context
export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === null) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
