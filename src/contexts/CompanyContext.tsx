import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
  industry: string;
  fiscalYearStart: string;
  customers: Customer[];
  invoices: Invoice[];
  expenses: Expense[];
  inventory: InventoryItem[];
  projects: Project[];
  sales: Sale[];
  taxReports: TaxReport[];
  taxRates: TaxRate[];
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

export interface Customer {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  type: string;
  status: string;
}

export interface Invoice {
  id: string;
  customer: string;
  date: string;
  dueDate: string;
  amount: string;
  status: string;
  items: number;
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  vendor: string;
  amount: string;
  status: string;
  paymentMethod: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: string;
  status: string;
  lastUpdated: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  startDate: string;
  endDate: string;
  dueDate: string; // Added missing property
  status: string;
  budget: string;
  spent: string;
  remaining: string;
  progress: number;
  description: string;
  tasks: Task[];
  team: TeamMember[];
  tracked: string; // Added missing property
  billed: string; // Added missing property
}

export interface Task {
  id: string;
  name: string;
  status: string;
  dueDate: string;
  assignedTo: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface Sale {
  id: string;
  date: string;
  customer: string;
  items: number;
  total: string;
  status: string;
  paymentStatus: string;
}

export interface TaxReport {
  id: string;
  name: string;
  period: string;
  dueDate: string;
  taxAmount: string;
  status: string;
  paymentStatus: string;
}

export interface TaxRate {
  id: string;
  name: string;
  jurisdiction: string;
  rate: string;
  type: string;
}

interface CompanyContextType {
  companies: Company[];
  currentCompany: Company;
  switchCompany: (companyId: string) => void;
  addCompany: (company: Omit<Company, "id">) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Demo company data
const demoCompany: Company = {
  id: "1",
  name: "Acme Corporation",
  address: "123 Main St, Suite 100, San Francisco, CA 94105",
  phone: "(555) 123-4567",
  email: "info@acmecorp.com",
  website: "www.acmecorp.com",
  taxId: "12-3456789",
  industry: "Technology",
  fiscalYearStart: "January 1",
  customers: [
    {
      id: "cust-001",
      name: "ABC Corporation",
      contactName: "John Smith",
      email: "john@abccorp.com",
      phone: "(555) 987-6543",
      address: "456 Market St",
      city: "San Francisco",
      state: "CA",
      postalCode: "94105",
      country: "USA",
      type: "Business",
      status: "Active"
    },
    {
      id: "cust-002",
      name: "XYZ Limited",
      contactName: "Jane Doe",
      email: "jane@xyzlimited.com",
      phone: "(555) 456-7890",
      address: "789 Oak St",
      city: "San Jose",
      state: "CA",
      postalCode: "95110",
      country: "USA",
      type: "Business",
      status: "Active"
    },
    {
      id: "cust-003",
      name: "123 Industries",
      contactName: "Bob Johnson",
      email: "bob@123industries.com",
      phone: "(555) 234-5678",
      address: "321 Pine St",
      city: "Oakland",
      state: "CA",
      postalCode: "94612",
      country: "USA",
      type: "Business",
      status: "Inactive"
    },
    {
      id: "cust-004",
      name: "Global Tech",
      contactName: "Alice Brown",
      email: "alice@globaltech.com",
      phone: "(555) 876-5432",
      address: "555 Broadway",
      city: "New York",
      state: "NY",
      postalCode: "10012",
      country: "USA",
      type: "Business",
      status: "Active"
    },
    {
      id: "cust-005",
      name: "John Williams",
      contactName: "John Williams",
      email: "john.williams@email.com",
      phone: "(555) 345-6789",
      address: "888 Maple Ave",
      city: "Chicago",
      state: "IL",
      postalCode: "60601",
      country: "USA",
      type: "Individual",
      status: "Active"
    }
  ],
  invoices: [
    {
      id: "INV-001",
      customer: "ABC Corporation",
      date: "2025-04-01",
      dueDate: "2025-05-01",
      amount: "$1,250.00",
      status: "Paid",
      items: 5
    },
    {
      id: "INV-002",
      customer: "XYZ Limited",
      date: "2025-03-15",
      dueDate: "2025-04-15",
      amount: "$2,500.00",
      status: "Pending",
      items: 3
    },
    {
      id: "INV-003",
      customer: "123 Industries",
      date: "2025-03-01",
      dueDate: "2025-04-01",
      amount: "$750.00",
      status: "Overdue",
      items: 2
    },
    {
      id: "INV-004",
      customer: "Global Tech",
      date: "2025-02-15",
      dueDate: "2025-03-15",
      amount: "$3,000.00",
      status: "Paid",
      items: 4
    },
    {
      id: "INV-005",
      customer: "John Williams",
      date: "2025-02-01",
      dueDate: "2025-03-01",
      amount: "$500.00",
      status: "Paid",
      items: 1
    }
  ],
  expenses: [
    {
      id: "EXP-001",
      date: "2025-04-05",
      category: "Office Supplies",
      vendor: "Office Depot",
      amount: "$250.00",
      status: "Paid",
      paymentMethod: "Credit Card"
    },
    {
      id: "EXP-002",
      date: "2025-03-28",
      category: "Utilities",
      vendor: "PG&E",
      amount: "$350.00",
      status: "Paid",
      paymentMethod: "Bank Transfer"
    },
    {
      id: "EXP-003",
      date: "2025-03-20",
      category: "Rent",
      vendor: "SF Properties",
      amount: "$4,000.00",
      status: "Paid",
      paymentMethod: "Bank Transfer"
    },
    {
      id: "EXP-004",
      date: "2025-03-15",
      category: "Software",
      vendor: "Adobe",
      amount: "$75.00",
      status: "Pending",
      paymentMethod: "Credit Card"
    },
    {
      id: "EXP-005",
      date: "2025-03-10",
      category: "Travel",
      vendor: "Delta Airlines",
      amount: "$850.00",
      status: "Paid",
      paymentMethod: "Credit Card"
    }
  ],
  inventory: [
    {
      id: "ITEM-001",
      name: "Widget Pro",
      category: "Widgets",
      quantity: 150,
      price: "$29.99",
      status: "In Stock",
      lastUpdated: "2025-04-01"
    },
    {
      id: "ITEM-002",
      name: "Premium Gadget",
      category: "Gadgets",
      quantity: 75,
      price: "$49.99",
      status: "In Stock",
      lastUpdated: "2025-03-25"
    },
    {
      id: "ITEM-003",
      name: "Basic Tool Kit",
      category: "Tools",
      quantity: 50,
      price: "$75.00",
      status: "Low Stock",
      lastUpdated: "2025-03-20"
    },
    {
      id: "ITEM-004",
      name: "Advanced Gizmo",
      category: "Gizmos",
      quantity: 25,
      price: "$99.99",
      status: "Low Stock",
      lastUpdated: "2025-03-15"
    },
    {
      id: "ITEM-005",
      name: "Super Thingamajig",
      category: "Thingamajigs",
      quantity: 0,
      price: "$149.99",
      status: "Out of Stock",
      lastUpdated: "2025-03-10"
    }
  ],
  projects: [
    {
      id: "PROJ-001",
      name: "Website Redesign",
      client: "ABC Corporation",
      startDate: "2025-03-01",
      endDate: "2025-05-31",
      dueDate: "2025-05-31",
      status: "In Progress",
      budget: "$15,000.00",
      spent: "$5,000.00",
      remaining: "$10,000.00",
      progress: 35,
      description: "Complete redesign of corporate website with new branding and improved user experience.",
      tasks: [
        {
          id: "TASK-001",
          name: "Design Mockups",
          status: "Completed",
          dueDate: "2025-03-15",
          assignedTo: "Jane Smith"
        },
        {
          id: "TASK-002",
          name: "Frontend Development",
          status: "In Progress",
          dueDate: "2025-04-15",
          assignedTo: "John Doe"
        },
        {
          id: "TASK-003",
          name: "Backend Integration",
          status: "Not Started",
          dueDate: "2025-05-15",
          assignedTo: "Bob Johnson"
        }
      ],
      team: [
        {
          id: "TEAM-001",
          name: "Jane Smith",
          role: "Designer",
          avatar: "/avatars/jane-smith.png"
        },
        {
          id: "TEAM-002",
          name: "John Doe",
          role: "Frontend Developer",
          avatar: "/avatars/john-doe.png"
        },
        {
          id: "TEAM-003",
          name: "Bob Johnson",
          role: "Backend Developer",
          avatar: "/avatars/bob-johnson.png"
        }
      ],
      tracked: "45h",
      billed: "40h"
    },
    {
      id: "PROJ-002",
      name: "Mobile App Development",
      client: "XYZ Limited",
      startDate: "2025-02-15",
      endDate: "2025-06-30",
      dueDate: "2025-06-30",
      status: "In Progress",
      budget: "$25,000.00",
      spent: "$10,000.00",
      remaining: "$15,000.00",
      progress: 40,
      description: "Development of a new mobile application for iOS and Android platforms.",
      tasks: [
        {
          id: "TASK-004",
          name: "Requirements Gathering",
          status: "Completed",
          dueDate: "2025-02-28",
          assignedTo: "Alice Brown"
        },
        {
          id: "TASK-005",
          name: "UI/UX Design",
          status: "Completed",
          dueDate: "2025-03-31",
          assignedTo: "Jane Smith"
        },
        {
          id: "TASK-006",
          name: "iOS Development",
          status: "In Progress",
          dueDate: "2025-05-15",
          assignedTo: "John Doe"
        },
        {
          id: "TASK-007",
          name: "Android Development",
          status: "In Progress",
          dueDate: "2025-05-15",
          assignedTo: "Bob Johnson"
        },
        {
          id: "TASK-008",
          name: "Testing",
          status: "Not Started",
          dueDate: "2025-06-15",
          assignedTo: "Alice Brown"
        }
      ],
      team: [
        {
          id: "TEAM-001",
          name: "Jane Smith",
          role: "Designer",
          avatar: "/avatars/jane-smith.png"
        },
        {
          id: "TEAM-002",
          name: "John Doe",
          role: "iOS Developer",
          avatar: "/avatars/john-doe.png"
        },
        {
          id: "TEAM-003",
          name: "Bob Johnson",
          role: "Android Developer",
          avatar: "/avatars/bob-johnson.png"
        },
        {
          id: "TEAM-004",
          name: "Alice Brown",
          role: "QA Engineer",
          avatar: "/avatars/alice-brown.png"
        }
      ],
      tracked: "120h",
      billed: "100h"
    },
    {
      id: "PROJ-003",
      name: "E-commerce Integration",
      client: "123 Industries",
      startDate: "2025-04-01",
      endDate: "2025-05-15",
      dueDate: "2025-05-15",
      status: "Not Started",
      budget: "$10,000.00",
      spent: "$0.00",
      remaining: "$10,000.00",
      progress: 0,
      description: "Integration of e-commerce platform with existing systems.",
      tasks: [
        {
          id: "TASK-009",
          name: "Requirements Analysis",
          status: "Not Started",
          dueDate: "2025-04-15",
          assignedTo: "Alice Brown"
        },
        {
          id: "TASK-010",
          name: "API Development",
          status: "Not Started",
          dueDate: "2025-04-30",
          assignedTo: "Bob Johnson"
        },
        {
          id: "TASK-011",
          name: "Frontend Integration",
          status: "Not Started",
          dueDate: "2025-05-10",
          assignedTo: "John Doe"
        }
      ],
      team: [
        {
          id: "TEAM-002",
          name: "John Doe",
          role: "Frontend Developer",
          avatar: "/avatars/john-doe.png"
        },
        {
          id: "TEAM-003",
          name: "Bob Johnson",
          role: "Backend Developer",
          avatar: "/avatars/bob-johnson.png"
        },
        {
          id: "TEAM-004",
          name: "Alice Brown",
          role: "Business Analyst",
          avatar: "/avatars/alice-brown.png"
        }
      ],
      tracked: "0h",
      billed: "0h"
    }
  ],
  sales: [
    { id: "SALE-001", date: "2025-04-10", customer: "ABC Corporation", items: 5, total: "$1,250.00", status: "Completed", paymentStatus: "Paid" },
    { id: "SALE-002", date: "2025-04-07", customer: "XYZ Limited", items: 2, total: "$780.50", status: "Completed", paymentStatus: "Paid" },
    { id: "SALE-003", date: "2025-04-05", customer: "123 Industries", items: 3, total: "$450.00", status: "Completed", paymentStatus: "Paid" },
    { id: "SALE-004", date: "2025-04-01", customer: "Global Tech", items: 1, total: "$1,200.00", status: "Processing", paymentStatus: "Pending" },
    { id: "SALE-005", date: "2025-03-28", customer: "Acme Inc", items: 4, total: "$875.25", status: "On Hold", paymentStatus: "Pending" },
    { id: "SALE-006", date: "2025-03-25", customer: "ABC Corporation", items: 2, total: "$340.00", status: "Completed", paymentStatus: "Paid" },
    { id: "SALE-007", date: "2025-03-20", customer: "XYZ Limited", items: 1, total: "$150.00", status: "Completed", paymentStatus: "Paid" },
    { id: "SALE-008", date: "2025-03-15", customer: "123 Industries", items: 3, total: "$560.00", status: "Completed", paymentStatus: "Paid" },
    { id: "SALE-009", date: "2025-03-10", customer: "Global Tech", items: 5, total: "$950.00", status: "Processing", paymentStatus: "Pending" },
    { id: "SALE-010", date: "2025-03-05", customer: "Acme Inc", items: 2, total: "$480.00", status: "Completed", paymentStatus: "Paid" }
  ],
  taxReports: [
    { id: "TR001", name: "Q1 Federal Income Tax", period: "Jan-Mar 2025", dueDate: "2025-04-15", taxAmount: "$4,250.00", status: "Prepared", paymentStatus: "Pending" },
    { id: "TR002", name: "Q1 State Income Tax", period: "Jan-Mar 2025", dueDate: "2025-04-15", taxAmount: "$1,780.50", status: "Prepared", paymentStatus: "Pending" },
    { id: "TR003", name: "Annual Property Tax", period: "Jan-Dec 2024", dueDate: "2025-01-15", taxAmount: "$3,450.00", status: "Filed", paymentStatus: "Paid" },
    { id: "TR004", name: "Q4 Sales Tax", period: "Oct-Dec 2024", dueDate: "2025-01-31", taxAmount: "$2,200.00", status: "Filed", paymentStatus: "Paid" },
    { id: "TR005", name: "Q3 Sales Tax", period: "Jul-Sep 2024", dueDate: "2024-10-31", taxAmount: "$1,875.25", status: "Filed", paymentStatus: "Paid" }
  ],
  taxRates: [
    { id: "TX001", name: "Federal Income Tax", jurisdiction: "Federal", rate: "21%", type: "Income" },
    { id: "TX002", name: "State Income Tax", jurisdiction: "California", rate: "8.84%", type: "Income" },
    { id: "TX003", name: "Sales Tax", jurisdiction: "Los Angeles", rate: "9.5%", type: "Sales" },
    { id: "TX004", name: "Property Tax", jurisdiction: "Los Angeles County", rate: "1.25%", type: "Property" }
  ],
  revenue: {
    current: 25000,
    lastMonth: 22000,
    percentChange: 13.64
  },
  outstandingInvoices: {
    amount: 3250,
    count: 2,
    percentChange: -15.58
  },
  profitMargin: {
    value: 28.5,
    percentChange: 2.15
  },
  activeCustomers: {
    count: 4,
    percentChange: 33.33
  }
};

// Update the demoCompanies to include sales and tax data
const demoCompanies: Company[] = [
  {
    ...demoCompany,
    id: "1",
    name: "Acme Corporation",
    taxId: "12-3456789",
    industry: "Technology",
    sales: [
      { id: "SALE-001", date: "2025-04-10", customer: "ABC Corporation", items: 5, total: "$1,250.00", status: "Completed", paymentStatus: "Paid" },
      { id: "SALE-002", date: "2025-04-07", customer: "XYZ Limited", items: 2, total: "$780.50", status: "Completed", paymentStatus: "Paid" },
      { id: "SALE-003", date: "2025-04-05", customer: "123 Industries", items: 3, total: "$450.00", status: "Completed", paymentStatus: "Paid" },
      { id: "SALE-004", date: "2025-04-01", customer: "Global Tech", items: 1, total: "$1,200.00", status: "Processing", paymentStatus: "Pending" },
      { id: "SALE-005", date: "2025-03-28", customer: "Acme Inc", items: 4, total: "$875.25", status: "On Hold", paymentStatus: "Pending" },
      { id: "SALE-006", date: "2025-03-25", customer: "ABC Corporation", items: 2, total: "$340.00", status: "Completed", paymentStatus: "Paid" },
      { id: "SALE-007", date: "2025-03-20", customer: "XYZ Limited", items: 1, total: "$150.00", status: "Completed", paymentStatus: "Paid" },
      { id: "SALE-008", date: "2025-03-15", customer: "123 Industries", items: 3, total: "$560.00", status: "Completed", paymentStatus: "Paid" },
      { id: "SALE-009", date: "2025-03-10", customer: "Global Tech", items: 5, total: "$950.00", status: "Processing", paymentStatus: "Pending" },
      { id: "SALE-010", date: "2025-03-05", customer: "Acme Inc", items: 2, total: "$480.00", status: "Completed", paymentStatus: "Paid" }
    ],
    taxReports: [
      { id: "TR001", name: "Q1 Federal Income Tax", period: "Jan-Mar 2025", dueDate: "2025-04-15", taxAmount: "$4,250.00", status: "Prepared", paymentStatus: "Pending" },
      { id: "TR002", name: "Q1 State Income Tax", period: "Jan-Mar 2025", dueDate: "2025-04-15", taxAmount: "$1,780.50", status: "Prepared", paymentStatus: "Pending" },
      { id: "TR003", name: "Annual Property Tax", period: "Jan-Dec 2024", dueDate: "2025-01-15", taxAmount: "$3,450.00", status: "Filed", paymentStatus: "Paid" },
      { id: "TR004", name: "Q4 Sales Tax", period: "Oct-Dec 2024", dueDate: "2025-01-31", taxAmount: "$2,200.00", status: "Filed", paymentStatus: "Paid" },
      { id: "TR005", name: "Q3 Sales Tax", period: "Jul-Sep 2024", dueDate: "2024-10-31", taxAmount: "$1,875.25", status: "Filed", paymentStatus: "Paid" }
    ],
    taxRates: [
      { id: "TX001", name: "Federal Income Tax", jurisdiction: "Federal", rate: "21%", type: "Income" },
      { id: "TX002", name: "State Income Tax", jurisdiction: "California", rate: "8.84%", type: "Income" },
      { id: "TX003", name: "Sales Tax", jurisdiction: "Los Angeles", rate: "9.5%", type: "Sales" },
      { id: "TX004", name: "Property Tax", jurisdiction: "Los Angeles County", rate: "1.25%", type: "Property" }
    ]
  },
  {
    ...demoCompany,
    id: "2",
    name: "TechNova Solutions",
    taxId: "98-7654321",
    industry: "Software",
    sales: [
      { id: "SALE-001", date: "2025-04-12", customer: "Enterprise Co", items: 3, total: "$2,450.00", status: "Completed", paymentStatus: "Paid" },
      { id: "SALE-002", date: "2025-04-08", customer: "Digital Systems", items: 1, total: "$950.00", status: "Completed", paymentStatus: "Paid" },
      { id: "SALE-003", date: "2025-04-05", customer: "Quantum LLC", items: 2, total: "$750.00", status: "Processing", paymentStatus: "Pending" },
      { id: "SALE-004", date: "2025-04-02", customer: "Future Tech", items: 4, total: "$1,800.00", status: "Completed", paymentStatus: "Paid" },
      { id: "SALE-005", date: "2025-03-30", customer: "Innovation Inc", items: 2, total: "$1,275.25", status: "On Hold", paymentStatus: "Pending" },
      { id: "SALE-006", date: "2025-03-25", customer: "Enterprise Co", items: 1, total: "$640.00", status: "Completed", paymentStatus: "Paid" },
      { id: "SALE-007", date: "2025-03-21", customer: "Digital Systems", items: 3, total: "$350.00", status: "Completed", paymentStatus: "Paid" },
      { id: "SALE-008", date: "2025-03-16", customer: "Quantum LLC", items: 2, total: "$860.00", status: "Completed", paymentStatus: "Paid" },
      { id: "SALE-009", date: "2025-03-12", customer: "Future Tech", items: 1, total: "$550.00", status: "Processing", paymentStatus: "Pending" },
      { id: "SALE-010", date: "2025-03-07", customer: "Innovation Inc", items: 4, total: "$1,280.00", status: "Completed", paymentStatus: "Paid" }
    ],
    taxReports: [
      { id: "TR001", name: "Q1 Federal Income Tax", period: "Jan-Mar 2025", dueDate: "2025-04-15", taxAmount: "$5,650.00", status: "Prepared", paymentStatus: "Pending" },
      { id: "TR002", name: "Q1 State Income Tax", period: "Jan-Mar 2025", dueDate: "2025-04-15", taxAmount: "$2,380.50", status: "Prepared", paymentStatus: "Pending" },
      { id: "TR003", name: "Annual Property Tax", period: "Jan-Dec 2024", dueDate: "2025-01-15", taxAmount: "$4,250.00", status: "Filed", paymentStatus: "Paid" },
      { id: "TR004", name: "Q4 Sales Tax", period: "Oct-Dec 2024", dueDate: "2025-01-31", taxAmount: "$3,100.00", status: "Filed", paymentStatus: "Paid" },
      { id: "TR005", name: "Q3 Sales Tax", period: "Jul-Sep 2024", dueDate: "2024-10-31", taxAmount: "$2,775.25", status: "Filed", paymentStatus: "Paid" }
    ],
    taxRates: [
      { id: "TX001", name: "Federal Income Tax", jurisdiction: "Federal", rate: "21%", type: "Income" },
      { id: "TX002", name: "State Income Tax", jurisdiction: "New York", rate: "6.5%", type: "Income" },
      { id: "TX003", name: "Sales Tax", jurisdiction: "New York City", rate: "8.875%", type: "Sales" },
      { id: "TX004", name: "Property Tax", jurisdiction: "Manhattan", rate: "1.05%", type: "Property" }
    ]
  },
  {
    ...demoCompany,
    id: "3",
    name: "GreenLeaf Organics",
    taxId: "45-6789012",
    industry: "Agriculture",
    sales: [
      { id: "SALE-001", date: "2025-04-11", customer: "Health Foods Inc", items: 10, total: "$3,250.00", status: "Completed", paymentStatus: "Paid" },
      { id: "SALE-002", date: "2025-04-09", customer: "Natural Grocers", items: 15, total: "$4,780.50", status: "Completed", paymentStatus: "Paid" },
      { id: "SALE-003", date: "2025-04-06", customer: "Organic Market", items: 8, total: "$2,150.00", status: "Processing", paymentStatus: "Pending" },
      { id: "SALE-004", date: "2025-04-03", customer: "Farm Fresh", items: 12, total: "$3,200.00", status: "Completed", paymentStatus: "Paid" },
      { id: "SALE-005", date: "2025-03-29", customer: "Whole Foods", items: 20, total: "$5,875.25", status: "On Hold", paymentStatus: "Pending" },
      { id: "SALE-006", date: "2025-03-26", customer: "Health Foods Inc", items: 5, total: "$1,340.00", status: "Completed", paymentStatus: "Paid" },
      { id: "SALE-007", date: "2025-03-22", customer: "Natural Grocers", items: 7, total: "$1,850.00", status: "Completed", paymentStatus: "Paid" },
      { id: "SALE-008", date: "2025-03-18", customer: "Organic Market", items: 9, total: "$2,360.00", status: "Completed", paymentStatus: "Paid" },
      { id: "SALE-009", date: "2025-03-13", customer: "Farm Fresh", items: 6, total: "$1,650.00", status: "Processing", paymentStatus: "Pending" },
      { id: "SALE-010", date: "2025-03-08", customer: "Whole Foods", items: 18, total: "$4,480.00", status: "Completed", paymentStatus: "Paid" }
    ],
    taxReports: [
      { id: "TR001", name: "Q1 Federal Income Tax", period: "Jan-Mar 2025", dueDate: "2025-04-15", taxAmount: "$3,850.00", status: "Prepared", paymentStatus: "Pending" },
      { id: "TR002", name: "Q1 State Income Tax", period: "Jan-Mar 2025", dueDate: "2025-04-15", taxAmount: "$1,280.50", status: "Prepared", paymentStatus: "Pending" },
      { id: "TR003", name: "Annual Property Tax", period: "Jan-Dec 2024", dueDate: "2025-01-15", taxAmount: "$2,950.00", status: "Filed", paymentStatus: "Paid" },
      { id: "TR004", name: "Q4 Sales Tax", period: "Oct-Dec 2024", dueDate: "2025-01-31", taxAmount: "$1,900.00", status: "Filed", paymentStatus: "Paid" },
      { id: "TR005", name: "Q3 Sales Tax", period: "Jul-Sep 2024", dueDate: "2024-10-31", taxAmount: "$1,575.25", status: "Filed", paymentStatus: "Paid" }
    ],
    taxRates: [
      { id: "TX001", name: "Federal Income Tax", jurisdiction: "Federal", rate: "21%", type: "Income" },
      { id: "TX002", name: "State Income Tax", jurisdiction: "Oregon", rate: "6.6%", type: "Income" },
      { id: "TX003", name: "Sales Tax", jurisdiction: "Oregon", rate: "0%", type: "Sales" },
      { id: "TX004", name: "Property Tax", jurisdiction: "Portland", rate: "1.12%", type: "Property" }
    ]
  },
  {
    ...demoCompany,
    id: "4",
    name: "Atlantic Shipping",
    taxId: "78-9012345",
    industry: "Logistics",
    sales: [
      { id: "SALE-001", date: "2025-04-13", customer: "Global Imports", items: 1, total: "$5,250.00", status: "Completed", paymentStatus: "Paid" },
      { id: "SALE-002", date: "2025-04-10", customer: "International Cargo", items: 1, total: "$6,780.50", status: "Completed", paymentStatus: "Paid" },
      { id: "SALE-003", date: "2025-04-07", customer: "Freight Masters", items: 1, total: "$4,350.00", status: "Processing", paymentStatus: "Pending" },
      { id: "SALE-004", date: "2025-04-04", customer: "Express Logistics", items: 1, total: "$7,200.00", status: "Completed", paymentStatus: "Paid" },
      { id: "SALE-005", date: "2025-03-31", customer: "Sea Transport", items: 1, total: "$8,875.25", status: "On Hold", paymentStatus: "Pending" },
      { id: "SALE-006", date: "2025-03-27", customer: "Global Imports", items: 1, total: "$4,940.00", status: "Completed", paymentStatus: "Paid" },
      { id: "SALE-007", date: "2025-03-23", customer: "International Cargo", items: 1, total: "$5,650.00", status: "Completed", paymentStatus: "Paid" },
      { id: "SALE-008", date: "2025-03-19", customer: "Freight Masters", items: 1, total: "$6,860.00", status: "Completed", paymentStatus: "Paid" },
      { id: "SALE-009", date: "2025-03-14", customer: "Express Logistics", items: 1, total: "$4,950.00", status: "Processing", paymentStatus: "Pending" },
      { id: "SALE-010", date: "2025-03-09", customer: "Sea Transport", items: 1, total: "$7,880.00", status: "Completed", paymentStatus: "Paid" }
    ],
    taxReports: [
      { id: "TR001", name: "Q1 Federal Income Tax", period: "Jan-Mar 2025", dueDate: "2025-04-15", taxAmount: "$9,250.00", status: "Prepared", paymentStatus: "Pending" },
      { id: "TR002", name: "Q1 State Income Tax", period: "Jan-Mar 2025", dueDate: "2025-04-15", taxAmount: "$3,780.50", status: "Prepared", paymentStatus: "Pending" },
      { id: "TR003", name: "Annual Property Tax", period: "Jan-Dec 2024", dueDate: "2025-01-15", taxAmount: "$5,450.00", status: "Filed", paymentStatus: "Paid" },
      { id: "TR004", name: "Q4 Sales Tax", period: "Oct-Dec 2024", dueDate: "2025-01-31", taxAmount: "$4,200.00", status: "Filed", paymentStatus: "Paid" },
      { id: "TR005", name: "Q3 Sales Tax", period: "Jul-Sep 2024", dueDate: "2024-10-31", taxAmount: "$3,875.25", status: "Filed", paymentStatus: "Paid" }
    ],
    taxRates: [
      { id: "TX001", name: "Federal Income Tax", jurisdiction: "Federal", rate: "21%", type: "Income" },
      { id: "TX002", name: "State Income Tax", jurisdiction: "Florida", rate: "5.5%", type: "Income" },
      { id: "TX003", name: "Sales Tax", jurisdiction: "Miami", rate: "7%", type: "Sales" },
      { id: "TX004", name: "Property Tax", jurisdiction: "Miami-Dade County", rate: "1.02%", type: "Property" }
    ]
  }
];

export const CompanyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<Company[]>(demoCompanies);
  const [currentCompanyId, setCurrentCompanyId] = useState<string>(demoCompanies[0].id);

  const currentCompany = companies.find(company => company.id === currentCompanyId) || companies[0];

  const switchCompany = (companyId: string) => {
    setCurrentCompanyId(companyId);
  };

  const addCompany = (companyData: Omit<Company, "id">) => {
    const newCompany: Company = {
      ...companyData,
      id: `${companies.length + 1}`,
    };
    
    setCompanies(prev => [...prev, newCompany]);
    setCurrentCompanyId(newCompany.id);
  };

  return (
    <CompanyContext.Provider value={{ companies, currentCompany, switchCompany, addCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
};
