import React, { createContext, useContext, useState } from "react";

// Define types for Company and all related data
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

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: string;
  amount: string;
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
  contactName?: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  balance: string;
  dateAdded: string;
  type?: string;
  status?: string;
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
  taxInfo: {
    ssn: string;
    withholdings: number;
    filingStatus: string;
  };
  bankInfo: {
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
  lastReconciled: string;
  lastSync?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: string;
  type: string;
  category: string;
  bankAccount: string;
  account: string;
  reconciled: boolean;
}

export interface PayrollEmployee {
  employeeId: string;
  hoursWorked: number;
  grossPay: string;
  taxes: string;
  deductions: string;
  netPay: string;
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

export interface Benefit {
  id: string;
  name: string;
  type: string;
  employerContribution: string;
  employeeContribution: string;
}

export interface PayrollData {
  payPeriods: PayPeriod[];
  taxSettings: {
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
  };
  benefits: Benefit[];
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
}

export interface Integration {
  id: string;
  name: string;
  provider: string;
  status: string;
  lastSync: string;
  syncFrequency: string;
  connectionDetails: {
    institution?: string;
    accountsConnected?: string;
    account?: string;
    apiVersion?: string;
  };
}

export interface Project {
  id: string;
  name: string;
  client: string;
  startDate: string;
  dueDate: string;
  endDate?: string;
  status: string;
  budget: number;
  spent: number;
  progress: number;
  description?: string;
  remaining?: string;
  tracked?: string;
  billed?: string;
}

export interface SaleItem {
  id: string;
  product: string;
  quantity: number;
  price: string;
  total: string;
}

export interface Sale {
  id: string;
  date: string;
  customer: string;
  amount: string;
  items: SaleItem[];
  status: string;
  total?: string;
  paymentStatus?: string;
}

export interface TaxReport {
  id: string;
  name: string;
  period: string;
  dueDate: string;
  status: string;
  amount: string;
  paymentStatus?: string;
}

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  type: string;
  effectiveDate: string;
  jurisdiction?: string;
}

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

// Sample data
const sampleCompany: Company = {
  id: "1",
  name: "Acme, Inc.",
  address: "123 Main St, Anytown, USA",
  phone: "(555) 123-4567",
  email: "contact@acmeinc.com",
  website: "www.acmeinc.com",
  taxId: "12-3456789",
  currency: "USD",
  fiscalYear: "Jan 1 - Dec 31",
  fiscalYearStart: "January 1",
  industry: "Technology",
  inventory: [
    {
      id: "inv1",
      name: "Product A",
      sku: "SKU001",
      category: "Hardware",
      quantity: 50,
      reorderPoint: 10,
      costPrice: "$50.00",
      sellPrice: "$99.99",
      status: "In Stock"
    },
    {
      id: "inv2",
      name: "Product B",
      sku: "SKU002",
      category: "Electronics",
      quantity: 25,
      reorderPoint: 8,
      costPrice: "$35.00",
      sellPrice: "$79.99",
      status: "In Stock"
    },
    {
      id: "inv3",
      name: "Service A",
      category: "Services",
      quantity: 0,
      reorderPoint: 0,
      costPrice: "$0.00",
      sellPrice: "$150.00",
      status: "Service Item"
    }
  ],
  invoices: [
    {
      id: "inv1",
      invoiceNumber: "INV-2025-001",
      customer: "XYZ Corp",
      date: "2025-04-01",
      dueDate: "2025-05-01",
      items: [
        {
          id: "item1",
          description: "Product A",
          quantity: 2,
          unitPrice: "$99.99",
          amount: "$199.98"
        }
      ],
      amount: "$199.98",
      status: "Sent"
    },
    {
      id: "inv2",
      invoiceNumber: "INV-2025-002",
      customer: "ABC Ltd",
      date: "2025-04-05",
      dueDate: "2025-05-05",
      items: [
        {
          id: "item2",
          description: "Service A",
          quantity: 1,
          unitPrice: "$150.00",
          amount: "$150.00"
        }
      ],
      amount: "$150.00",
      status: "Paid"
    }
  ],
  expenses: [
    {
      id: "exp1",
      date: "2025-04-02",
      vendor: "Office Supply Co",
      category: "Office Supplies",
      amount: "$125.45",
      status: "Paid",
      paymentMethod: "Credit Card"
    },
    {
      id: "exp2",
      date: "2025-04-05",
      vendor: "Rent LLC",
      category: "Rent",
      amount: "$2,000.00",
      status: "Paid",
      paymentMethod: "Bank Transfer"
    },
    {
      id: "exp3",
      date: "2025-04-10",
      vendor: "Internet Provider",
      category: "Utilities",
      amount: "$89.99",
      status: "Pending",
      paymentMethod: "Credit Card"
    }
  ],
  customers: [
    {
      id: "cust1",
      name: "XYZ Corp",
      contactName: "John Smith",
      email: "contact@xyzcorp.com",
      phone: "(555) 987-6543",
      address: "456 Business Ave, Enterprise City, USA",
      city: "Enterprise City",
      state: "CA",
      postalCode: "90210",
      country: "USA",
      balance: "$199.98",
      dateAdded: "2023-01-15",
      type: "Business",
      status: "Active"
    },
    {
      id: "cust2",
      name: "ABC Ltd",
      contactName: "Jane Doe",
      email: "info@abcltd.com",
      phone: "(555) 234-5678",
      address: "789 Corporate Blvd, Commerce Town, USA",
      city: "Commerce Town",
      state: "NY",
      postalCode: "10001",
      country: "USA",
      balance: "$0.00",
      dateAdded: "2023-03-22",
      type: "Business",
      status: "Active"
    }
  ],
  vendors: [
    {
      id: "vend1",
      name: "Office Supply Co",
      email: "orders@officesupply.com",
      phone: "(555) 444-3333",
      address: "100 Supplier St, Vendor City, USA"
    },
    {
      id: "vend2",
      name: "Rent LLC",
      email: "admin@rentllc.com",
      phone: "(555) 222-1111",
      address: "200 Real Estate Rd, Property Town, USA"
    }
  ],
  employees: [
    {
      id: "emp1",
      name: "John Doe",
      position: "Software Developer",
      department: "Engineering",
      payRate: "$45.00",
      payType: "Hourly",
      startDate: "2023-01-10",
      status: "Active",
      taxInfo: {
        ssn: "XXX-XX-1234",
        withholdings: 2,
        filingStatus: "Single"
      },
      bankInfo: {
        accountNumber: "XXXX1234",
        routingNumber: "XXXXX5678",
        accountType: "Checking"
      }
    },
    {
      id: "emp2",
      name: "Jane Smith",
      position: "Marketing Manager",
      department: "Marketing",
      payRate: "$75,000.00",
      payType: "Salary",
      startDate: "2023-02-15",
      status: "Active",
      taxInfo: {
        ssn: "XXX-XX-5678",
        withholdings: 1,
        filingStatus: "Married"
      },
      bankInfo: {
        accountNumber: "XXXX5678",
        routingNumber: "XXXXX1234",
        accountType: "Savings"
      }
    }
  ],
  bankAccounts: [
    {
      id: "bank1",
      name: "Business Checking",
      accountNumber: "XXXXX7890",
      balance: "$15,243.89",
      accountType: "Checking",
      institution: "First National Bank",
      lastReconciled: "2025-03-31",
      lastSync: "2025-04-04"
    },
    {
      id: "bank2",
      name: "Business Savings",
      accountNumber: "XXXXX4321",
      balance: "$42,876.54",
      accountType: "Savings",
      institution: "First National Bank",
      lastReconciled: "2025-03-31",
      lastSync: "2025-04-04"
    },
    {
      id: "bank3",
      name: "Business Credit Card",
      accountNumber: "XXXX-XXXX-XXXX-1234",
      balance: "-$4,567.23",
      accountType: "Credit Card",
      institution: "Finance Card Services",
      lastReconciled: "2025-03-25",
      lastSync: "2025-04-04"
    }
  ],
  transactions: [
    {
      id: "trans1",
      date: "2025-04-01",
      description: "Client Payment - ABC Ltd",
      amount: "$150.00",
      type: "Deposit",
      category: "Revenue",
      bankAccount: "Business Checking",
      account: "Business Checking",
      reconciled: true
    },
    {
      id: "trans2",
      date: "2025-04-02",
      description: "Office Supplies",
      amount: "$125.45",
      type: "Withdrawal",
      category: "Office Expense",
      bankAccount: "Business Credit Card",
      account: "Business Credit Card",
      reconciled: true
    },
    {
      id: "trans3",
      date: "2025-04-05",
      description: "Monthly Rent",
      amount: "$2,000.00",
      type: "Withdrawal",
      category: "Rent",
      bankAccount: "Business Checking",
      account: "Business Checking",
      reconciled: true
    }
  ],
  timeEntries: [
    {
      id: "time1",
      employeeId: "emp1",
      projectId: undefined,
      date: "2025-04-01",
      startTime: "09:00",
      endTime: "17:00",
      duration: "8:00",
      description: undefined,
      billable: true,
      billing: {
        rate: "$45.00",
        amount: "$360.00"
      }
    },
    {
      id: "time2",
      employeeId: "emp2",
      projectId: undefined,
      date: "2025-04-01",
      startTime: "10:00",
      endTime: "16:00",
      duration: "6:00",
      description: "Marketing campaign planning",
      billable: false
    }
  ],
  payrollData: {
    payPeriods: [
      {
        id: "pp1",
        startDate: "2025-03-16",
        endDate: "2025-03-31",
        payDate: "2025-04-05",
        status: "Completed",
        employees: [
          {
            employeeId: "emp1",
            hoursWorked: 80,
            grossPay: "$3,600.00",
            taxes: "$864.00",
            deductions: "$250.00",
            netPay: "$2,486.00"
          },
          {
            employeeId: "emp2",
            hoursWorked: 80,
            grossPay: "$3,125.00",
            taxes: "$750.00",
            deductions: "$325.00",
            netPay: "$2,050.00"
          }
        ],
        totalGross: "$6,725.00",
        totalNet: "$4,536.00",
        totalTaxes: "$1,614.00",
        totalDeductions: "$575.00"
      }
    ],
    taxSettings: {
      federalEin: "12-3456789",
      stateId: "987654321",
      filingFrequency: "Quarterly",
      taxRates: {
        federal: 0.15,
        state: 0.05,
        fica: {
          social: 0.062,
          medicare: 0.0145
        },
        futa: 0.006,
        suta: 0.03
      }
    },
    benefits: [
      {
        id: "ben1",
        name: "Health Insurance",
        type: "Health",
        employerContribution: "$300.00",
        employeeContribution: "$150.00"
      },
      {
        id: "ben2",
        name: "401(k)",
        type: "Retirement",
        employerContribution: "3%",
        employeeContribution: "5%"
      }
    ]
  },
  auditTrail: [
    {
      id: "audit1",
      timestamp: "2025-04-01T10:15:30Z",
      userId: "user1",
      userName: "Admin User",
      action: "Created Invoice",
      module: "Invoices",
      details: "Created invoice INV-2025-001 for XYZ Corp",
      ipAddress: "192.168.1.1"
    },
    {
      id: "audit2",
      timestamp: "2025-04-02T14:22:15Z",
      userId: "user2",
      userName: "John Doe",
      action: "Recorded Expense",
      module: "Expenses",
      details: "Added expense for Office Supply Co",
      ipAddress: "192.168.1.2"
    }
  ],
  budgets: [
    {
      id: "budget1",
      name: "Q2 2025 Operating Budget",
      period: "Quarterly",
      startDate: "2025-04-01",
      endDate: "2025-06-30",
      categories: [
        {
          id: "bc1",
          name: "Rent",
          budgetedAmount: "$6,000.00",
          actualAmount: "$2,000.00",
          variance: "$4,000.00"
        },
        {
          id: "bc2",
          name: "Utilities",
          budgetedAmount: "$1,500.00",
          actualAmount: "$89.99",
          variance: "$1,410.01"
        },
        {
          id: "bc3",
          name: "Payroll",
          budgetedAmount: "$40,000.00",
          actualAmount: "$6,725.00",
          variance: "$33,275.00"
        }
      ],
      totalBudgeted: "$47,500.00",
      totalActual: "$8,814.99"
    }
  ],
  integrations: [
    {
      id: "int1",
      name: "Bank Connection",
      provider: "Plaid",
      status: "Active",
      lastSync: "2025-04-01T00:00:00Z",
      syncFrequency: "Daily",
      connectionDetails: {
        institution: "First National Bank",
        accountsConnected: "2"
      }
    },
    {
      id: "int2",
      name: "Payment Processing",
      provider: "Stripe",
      status: "Active",
      lastSync: "2025-04-01T00:00:00Z",
      syncFrequency: "Real-time",
      connectionDetails: {
        account: "Acme Inc. Stripe",
        apiVersion: "2025-01"
      }
    }
  ],
  accounts: [
    {
      id: "bank1",
      name: "Business Checking",
      accountNumber: "XXXXX7890",
      balance: "$15,243.89",
      accountType: "Checking",
      institution: "First National Bank",
      lastReconciled: "2025-03-31",
      lastSync: "2025-04-04"
    },
    {
      id: "bank2",
      name: "Business Savings",
      accountNumber: "XXXXX4321",
      balance: "$42,876.54",
      accountType: "Savings",
      institution: "First National Bank",
      lastReconciled: "2025-03-31",
      lastSync: "2025-04-04"
    },
    {
      id: "bank3",
      name: "Business Credit Card",
      accountNumber: "XXXX-XXXX-XXXX-1234",
      balance: "-$4,567.23",
      accountType: "Credit Card",
      institution: "Finance Card Services",
      lastReconciled: "2025-03-25",
      lastSync: "2025-04-04"
    }
  ],
  projects: [
    {
      id: "proj1",
      name: "Website Redesign",
      client: "XYZ Corp",
      description: "Complete website overhaul with new branding and features",
      startDate: "2025-01-15",
      dueDate: "2025-05-30",
      endDate: "",
      status: "In Progress",
      budget: 10000,
      spent: 4500,
      progress: 45,
      remaining: "$5,500.00",
      tracked: "45 hours",
      billed: "40 hours"
    },
    {
      id: "proj2",
      name: "Marketing Campaign",
      client: "ABC Ltd",
      description: "Q2 digital marketing campaign for product launch",
      startDate: "2025-03-01",
      dueDate: "2025-04-15",
      endDate: "2025-04-12",
      status: "Completed",
      budget: 5000,
      spent: 4800,
      progress: 100,
      remaining: "$200.00",
      tracked: "32 hours",
      billed: "32 hours"
    }
  ],
  sales: [
    {
      id: "sale1",
      date: "2025-04-01",
      customer: "XYZ Corp",
      amount: "$499.98",
      total: "$499.98",
      items: [
        {
          id: "item1",
          product: "Product A",
          quantity: 5,
          price: "$99.99",
          total: "$499.95"
        }
      ],
      status: "Completed",
      paymentStatus: "Paid"
    },
    {
      id: "sale2",
      date: "2025-04-03",
      customer: "ABC Ltd",
      amount: "$299.97",
      total: "$299.97",
      items: [
        {
          id: "item2",
          product: "Product B",
          quantity: 3,
          price: "$79.99",
          total: "$239.97"
        },
        {
          id: "item3",
          product: "Service A",
          quantity: 0.4,
          price: "$150.00",
          total: "$60.00"
        }
      ],
      status: "Processing",
      paymentStatus: "Pending"
    }
  ],
  taxReports: [
    {
      id: "tax1",
      name: "Quarterly Sales Tax",
      period: "Q1 2025",
      dueDate: "2025-04-30",
      status: "Pending",
      amount: "$1,245.67",
      paymentStatus: "Not Paid"
    }
  ],
  taxRates: [
    {
      id: "tr1",
      name: "Standard Sales Tax",
      rate: 7.5,
      type: "Sales",
      effectiveDate: "2025-01-01",
      jurisdiction: "State"
    }
  ],
  revenue: {
    current: 12500,
    lastMonth: 10000,
    percentChange: 25
  },
  outstandingInvoices: {
    amount: 1999,
    count: 3,
    percentChange: -10
  },
  profitMargin: {
    value: 32,
    percentChange: 5
  },
  activeCustomers: {
    count: 12,
    percentChange: 20
  }
};

// Second sample company
const sampleCompany2: Company = {
  id: "2",
  name: "Globex Corporation",
  address: "456 Corporate Dr, Metropolis, USA",
  phone: "(555) 987-6543",
  email: "info@globexcorp.com",
  website: "www.globexcorp.com",
  taxId: "98-7654321",
  currency: "USD",
  fiscalYear: "Jul 1 - Jun 30",
  fiscalYearStart: "July 1",
  industry: "Manufacturing",
  inventory: [
    {
      id: "inv1",
      name: "Widget X",
      sku: "WID-X-001",
      category: "Widgets",
      quantity: 150,
      reorderPoint: 30,
      costPrice: "$25.00",
      sellPrice: "$49.99",
      status: "In Stock"
    },
    {
      id: "inv2",
      name: "Gadget Pro",
      sku: "GAD-PRO-002",
      category: "Gadgets",
      quantity: 5,
      reorderPoint: 10,
      costPrice: "$75.00",
      sellPrice: "$149.99",
      status: "Low Stock"
    },
    {
      id: "inv3",
      name: "Tool Basic",
      sku: "TOOL-001",
      category: "Tools",
      quantity: 0,
      reorderPoint: 5,
      costPrice: "$15.00",
      sellPrice: "$29.99",
      status: "Out of Stock"
    }
  ],
  invoices: [
    {
      id: "inv1",
      invoiceNumber: "INV-2025-101",
      customer: "Acme Corp",
      date: "2025-03-15",
      dueDate: "2025-04-15",
      items: [
        {
          id: "item1",
          description: "Widget X",
          quantity: 10,
          unitPrice: "$49.99",
          amount: "$499.90"
        },
        {
          id: "item2",
          description: "Gadget Pro",
          quantity: 2,
          unitPrice: "$149.99",
          amount: "$299.98"
        }
      ],
      amount: "$799.88",
      status: "Paid"
    }
  ],
  expenses: [
    {
      id: "exp1",
      date: "2025-03-20",
      vendor: "Manufacturing Supplies Inc",
      category: "Materials",
      amount: "$1,250.75",
      status: "Paid",
      paymentMethod: "Check"
    },
    {
      id: "exp2",
      date: "2025-03-25",
      vendor: "City Utilities",
      category: "Utilities",
      amount: "$345.82",
      status: "Paid",
      paymentMethod: "Bank Transfer"
    }
  ],
  customers: [
    {
      id: "cust1",
      name: "Acme Corp",
      email: "orders@acme.com",
      phone: "(555) 111-2222",
      address: "789 Industrial Pkwy, Commerce City, USA",
      balance: "$0.00",
      dateAdded: "2022-10-01"
    }
  ],
  vendors: [
    {
      id: "vend1",
      name: "Manufacturing Supplies Inc",
      email: "sales@mansupplies.com",
      phone: "(555) 333-4444",
      address: "100 Vendor Way, Supplier City, USA"
    },
    {
      id: "vend2",
      name: "City Utilities",
      email: "service@cityutil.com",
      phone: "(555) 555-5555",
      address: "200 Power Rd, Utility Town, USA"
    }
  ],
  employees: [
    {
      id: "emp1",
      name: "Robert Johnson",
      position: "Production Manager",
      department: "Operations",
      payRate: "$85,000.00",
      payType: "Salary",
      startDate: "2021-05-15",
      status: "Active",
      taxInfo: {
        ssn: "XXX-XX-9876",
        withholdings: 3,
        filingStatus: "Married"
      },
      bankInfo: {
        accountNumber: "XXXX9876",
        routingNumber: "XXXXX5432",
        accountType: "Checking"
      }
    }
  ],
  bankAccounts: [
    {
      id: "bank1",
      name: "Operations Account",
      accountNumber: "XXXXX5432",
      balance: "$32,567.89",
      accountType: "Checking",
      institution: "Business Bank",
      lastReconciled: "2025-03-31"
    }
  ],
  transactions: [
    {
      id: "trans1",
      date: "2025-03-15",
      description: "Payment from Acme Corp",
      amount: "$799.88",
      type: "Deposit",
      category: "Revenue",
      bankAccount: "Operations Account",
      account: "Operations Account",
      reconciled: true
    },
    {
      id: "trans2",
      date: "2025-03-20",
      description: "Manufacturing Supplies",
      amount: "$1,250.75",
      type: "Withdrawal",
      category: "Materials",
      bankAccount: "Operations Account",
      account: "Operations Account",
      reconciled: true
    }
  ],
  timeEntries: [
    {
      id: "time1",
      employeeId: "emp1",
      projectId: undefined,
      date: "2025-03-30",
      startTime: "08:00",
      endTime: "17:00",
      duration: "9:00",
      description: "Production oversight",
      billable: false
    }
  ],
  payrollData: {
    payPeriods: [
      {
        id: "pp1",
        startDate: "2025-03-16",
        endDate: "2025-03-31",
        payDate: "2025-04-05",
        status: "Processing",
        employees: [
          {
            employeeId: "emp1",
            hoursWorked: 80,
            grossPay: "$3,541.67",
            taxes: "$885.42",
            deductions: "$325.00",
            netPay: "$2,331.25"
          }
        ],
        totalGross: "$3,541.67",
        totalNet: "$2,331.25",
        totalTaxes: "$885.42",
        totalDeductions: "$325.00"
      }
    ],
    taxSettings: {
      federalEin: "98-7654321",
      stateId: "123456789",
      filingFrequency: "Quarterly",
      taxRates: {
        federal: 0.15,
        state: 0.05,
        fica: {
          social: 0.062,
          medicare: 0.0145
        },
        futa: 0.006,
        suta: 0.03
      }
    },
    benefits: [
      {
        id: "ben1",
        name: "Health Insurance",
        type: "Health",
        employerContribution: "$350.00",
        employeeContribution: "$175.00"
      }
    ]
  },
  auditTrail: [
    {
      id: "audit1",
      timestamp: "2025-03-15T11:32:45Z",
      userId: "user1",
      userName: "Admin User",
      action: "Recorded Payment",
      module: "Invoices",
      details: "Recorded payment for invoice INV-2025-101",
      ipAddress: "192.168.1.5"
    }
  ],
  budgets: [
    {
      id: "budget1",
      name: "FY 2025 Operating Budget",
      period: "Annual",
      startDate: "2024-07-01",
      endDate: "2025-06-30",
      categories: [
        {
          id: "bc1",
          name: "Materials",
          budgetedAmount: "$15,000.00",
          actualAmount: "$10,250.75",
          variance: "$4,749.25"
        },
        {
          id: "bc2",
          name: "Utilities",
          budgetedAmount: "$4,000.00",
          actualAmount: "$2,845.82",
          variance: "$1,154.18"
        }
      ],
      totalBudgeted: "$19,000.00",
      totalActual: "$13,096.57"
    }
  ],
  integrations: [
    {
      id: "int1",
      name: "Bank Connection",
      provider: "Plaid",
      status: "Active",
      lastSync: "2025-04-01T00:00:00Z",
      syncFrequency: "Daily",
      connectionDetails: {
        institution: "Business Bank",
        accountsConnected: "1"
      }
    }
  ],
  accounts: [
    {
      id: "bank1",
      name: "Operations Account",
      accountNumber: "XXXXX5432",
      balance: "$32,567.89",
      accountType: "Checking",
      institution: "Business Bank",
      lastReconciled: "2025-03-31"
    }
  ],
  projects: [
    {
      id: "proj1",
      name: "Product Development",
      client: "Internal",
      startDate: "2025-02-01",
      dueDate: "2025-08-15",
      status: "In Progress",
      budget: 50000,
      spent: 15000,
      progress: 30
    }
  ],
  sales: [
    {
      id: "sale1",
      date: "2025-03-15",
      customer: "Acme Corp",
      amount: "$799.88",
      items: [
        {
          id: "item1",
          product: "Widget X",
          quantity: 10,
          price: "$49.99",
          total: "$499.90"
        }
      ],
      status: "Completed"
    }
  ],
  taxReports: [
    {
      id: "tax1",
      name: "Annual Business Tax",
      period: "FY 2025",
      dueDate: "2025-09-15",
      status: "Not Started",
      amount: "$12,450.00"
    }
  ],
  taxRates: [
    {
      id: "tr1",
      name: "Manufacturing Tax",
      rate: 5.2,
      type: "Sales",
      effectiveDate: "2025-01-01"
    }
  ],
  revenue: {
    current: 45000,
    lastMonth: 42000,
    percentChange: 7.14
  },
  outstandingInvoices: {
    amount: 0,
    count: 0,
    percentChange: -100
  },
  profitMargin: {
    value: 28,
    percentChange: -2
  },
  activeCustomers: {
    count: 8,
    percentChange: 0
  }
};

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

  const contextValue: CompanyContextType = {
    companies,
    currentCompany,
    setCurrentCompany,
    switchCompany,
    addCompany,
    updateCompany,
    addTransaction,
    addExpense,
    addInvoice
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
