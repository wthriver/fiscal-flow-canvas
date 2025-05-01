
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
}

export interface InventoryItem {
  id: string;
  name: string;
  sku?: string;
  description?: string;
  category: string;
  quantity: number;
  reorderPoint: number;
  costPrice: string; 
  sellPrice: string;
  status: "In Stock" | "Low Stock" | "Out of Stock" | "Service Item";
  lotNumbers?: LotNumber[];
  serialNumbers?: SerialNumber[];
}

export interface LotNumber {
  id: string;
  lotNumber: string;
  expirationDate: string;
  quantity: number;
}

export interface SerialNumber {
  id: string;
  serialNumber: string;
  purchaseDate?: string;
  customer?: string;
  status: "In Stock" | "Sold" | "Returned" | "Defective";
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  amount: string;
  status: "Draft" | "Sent" | "Viewed" | "Paid" | "Overdue" | "Cancelled";
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
  status: "Paid" | "Pending" | "Denied";
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
  notes?: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  accountNumber?: string;
  website?: string;
  contactPerson?: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  payRate: string;
  payType: "Hourly" | "Salary";
  startDate: string;
  status: "Active" | "Inactive" | "On Leave";
  taxInfo: {
    ssn: string;
    withholdings: number;
    filingStatus: string;
  };
  bankInfo: {
    accountNumber: string;
    routingNumber: string;
    accountType: "Checking" | "Savings";
  };
}

export interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  balance: string;
  accountType: "Checking" | "Savings" | "Credit Card";
  institution: string;
  lastReconciled?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: string; 
  type: "Deposit" | "Withdrawal" | "Transfer";
  category: string;
  bankAccount: string;
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
  status: "Draft" | "Processing" | "Completed" | "Cancelled";
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
  filingFrequency: "Monthly" | "Quarterly" | "Annually";
  taxRates: {
    federal: number;
    state: number;
    localTax?: number;
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
  type: "Health" | "Retirement" | "Other";
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
  status: "Active" | "Inactive" | "Error";
  lastSync: string;
  syncFrequency: string;
  connectionDetails: Record<string, string>;
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
      email: "contact@xyzcorp.com",
      phone: "(555) 987-6543",
      address: "456 Business Ave, Enterprise City, USA",
      balance: "$199.98",
      dateAdded: "2023-01-15"
    },
    {
      id: "cust2",
      name: "ABC Ltd",
      email: "info@abcltd.com",
      phone: "(555) 234-5678",
      address: "789 Corporate Blvd, Commerce Town, USA",
      balance: "$0.00",
      dateAdded: "2023-03-22"
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
      lastReconciled: "2025-03-31"
    },
    {
      id: "bank2",
      name: "Business Savings",
      accountNumber: "XXXXX4321",
      balance: "$42,876.54",
      accountType: "Savings",
      institution: "First National Bank",
      lastReconciled: "2025-03-31"
    },
    {
      id: "bank3",
      name: "Business Credit Card",
      accountNumber: "XXXX-XXXX-XXXX-1234",
      balance: "-$4,567.23",
      accountType: "Credit Card",
      institution: "Finance Card Services",
      lastReconciled: "2025-03-25"
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
      reconciled: true
    }
  ],
  timeEntries: [
    {
      id: "time1",
      employeeId: "emp1",
      projectId: "proj1",
      date: "2025-04-01",
      startTime: "09:00",
      endTime: "17:00",
      duration: "8:00",
      description: "Development work on new feature",
      billable: true,
      billing: {
        rate: "$45.00",
        amount: "$360.00"
      }
    },
    {
      id: "time2",
      employeeId: "emp2",
      projectId: "proj2",
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
  ]
};

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
      reconciled: true
    }
  ],
  timeEntries: [
    {
      id: "time1",
      employeeId: "emp1",
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
  ]
};

// Create context
type CompanyContextType = {
  companies: Company[];
  currentCompany: Company;
  setCurrentCompany: (company: Company) => void;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Provider component
export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<Company[]>([sampleCompany, sampleCompany2]);
  const [currentCompany, setCurrentCompany] = useState<Company>(companies[0]);

  const contextValue: CompanyContextType = {
    companies,
    currentCompany,
    setCurrentCompany,
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
