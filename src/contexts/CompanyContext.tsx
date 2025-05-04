
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for our domain
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactName?: string; // Add missing property
  type?: string; // Add missing property
  status?: string; // Add missing property
  city?: string; // Add missing property
  state?: string; // Add missing property
  postalCode?: string; // Add missing property
  country?: string; // Add missing property
}

export interface Invoice {
  id: string;
  customerId: string;
  amount: string;
  status: string;
  date: string;
  dueDate: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: string;
  description: string; // Required field
  category: string;
  type: string; // Added type
  bankAccount: string; // Added bankAccount
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
  lastSync?: string; // Added missing property
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
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
}

export interface ProjectTask {
  id: string;
  name: string;
  status: string;
  assignee: string;
  dueDate: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  startDate: string;
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

export interface Estimate {
  id: string;
  customerId: string;
  amount: string;
  status: string;
  date: string;
  expiryDate: string;
  items: EstimateItem[];
  notes: string;
}

export interface EstimateItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: string;
  amount: string;
}

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
  estimates: Estimate[]; // Add missing property
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
      dueDate: "2023-10-15"
    },
    {
      id: "invoice-2",
      customerId: "customer-2",
      amount: "$2,500.00",
      status: "Pending",
      date: "2023-09-20",
      dueDate: "2023-10-20"
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
      bankAccount: "Operating Account"
    },
    {
      id: "transaction-2",
      date: "2023-09-24",
      amount: "$350.00",
      description: "Office Supplies",
      category: "Expenses",
      type: "Debit",
      bankAccount: "Operating Account"
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
      ]
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
      ]
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
      notes: "Payment due within 30 days of project completion"
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
      deleteEstimate
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
