
import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";

// Define types for company data
export type Status = "Active" | "Inactive";
export type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "Outstanding";
export type ExpenseStatus = "Approved" | "Pending" | "Rejected" | "Paid";
export type TransactionStatus = "completed" | "pending" | "failed";
export type TransactionType = "income" | "expense";
export type InventoryStatus = "In Stock" | "Low Stock" | "Out of Stock" | "Service Item";

export interface Customer {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  openInvoices: number;
  balance: string;
  status: Status;
}

export interface Invoice {
  id: string;
  customer: string;
  date: string;
  dueDate: string;
  amount: string;
  status: InvoiceStatus;
}

export interface Expense {
  id: string;
  category: string;
  vendor: string;
  date: string;
  amount: string;
  status: ExpenseStatus;
}

export interface Account {
  id: string;
  name: string;
  institution: string;
  balance: string;
  lastSync: string;
}

export interface Transaction {
  id: string;
  account: string;
  date: string;
  description: string;
  amount: string;
  category: string;
  reconciled: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  reorderPoint: number;
  costPrice: string;
  sellPrice: string;
  category: string;
  status: InventoryStatus;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  status: string;
  progress: number;
  budget: string;
  spent: string;
  startDate: string;
  endDate: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  taxId: string;
  logo: string;
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
  customers: Customer[];
  invoices: Invoice[];
  expenses: Expense[];
  accounts: Account[];
  transactions: Transaction[];
  inventory: InventoryItem[];
  projects: Project[];
  fiscalYearStart: string;
}

// Create a context for company data
export interface CompanyContextType {
  companies: Company[];
  currentCompany: Company;
  switchCompany: (id: string) => void;
  addCompany: (company: Partial<Company>) => void;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Sample data
const generateCompanyData = (): Company[] => {
  // Common data generator functions
  const generateRandomAmount = (min: number, max: number) => {
    return (Math.random() * (max - min) + min).toFixed(2);
  };

  const generateRandomDate = (start: Date, end: Date) => {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
  };

  const generateCustomerId = (prefix: string, index: number) => {
    return `${prefix}CUST-${(index + 1).toString().padStart(3, '0')}`;
  };

  const generateInvoiceId = (prefix: string, index: number) => {
    return `${prefix}INV-${(index + 1).toString().padStart(3, '0')}`;
  };

  const generateExpenseId = (prefix: string, index: number) => {
    return `${prefix}EXP-${(index + 1).toString().padStart(3, '0')}`;
  };

  const generateProjectId = (prefix: string, index: number) => {
    return `${prefix}PRJ-${(index + 1).toString().padStart(3, '0')}`;
  };

  // Generate ABC Corporation data
  const abcCustomers: Customer[] = [
    {
      id: "CUST-001",
      name: "Acme Industries",
      contactName: "John Smith",
      email: "john@acme.com",
      phone: "(555) 123-4567",
      openInvoices: 2,
      balance: "$3,500.00",
      status: "Active",
    },
    {
      id: "CUST-002",
      name: "Tech Solutions Inc",
      contactName: "Mary Johnson",
      email: "mary@techsolutions.com",
      phone: "(555) 987-6543",
      openInvoices: 1,
      balance: "$1,250.00",
      status: "Active",
    },
    {
      id: "CUST-003",
      name: "Global Enterprises",
      contactName: "Robert Brown",
      email: "robert@globalent.com",
      phone: "(555) 456-7890",
      openInvoices: 0,
      balance: "$0.00",
      status: "Inactive",
    },
    // Additional customers
    {
      id: "CUST-004",
      name: "Digital Dynamics",
      contactName: "Emma Wilson",
      email: "emma@digitaldynamics.com",
      phone: "(555) 111-2222",
      openInvoices: 3,
      balance: "$5,725.00",
      status: "Active",
    },
    {
      id: "CUST-005",
      name: "Quantum Computing",
      contactName: "Alex Chen",
      email: "alex@quantum.com",
      phone: "(555) 333-4444",
      openInvoices: 1,
      balance: "$2,150.00",
      status: "Active",
    },
    {
      id: "CUST-006",
      name: "Sunrise Media Group",
      contactName: "Sarah Jackson",
      email: "sarah@sunrisemedia.com",
      phone: "(555) 555-6666",
      openInvoices: 0,
      balance: "$0.00",
      status: "Inactive",
    },
    {
      id: "CUST-007",
      name: "Everest Consulting",
      contactName: "Michael Rodriguez",
      email: "michael@everestconsult.com",
      phone: "(555) 777-8888",
      openInvoices: 2,
      balance: "$4,300.00",
      status: "Active",
    },
  ];

  const abcInvoices: Invoice[] = [
    {
      id: "INV-001",
      customer: "Acme Industries",
      date: "2025-03-15",
      dueDate: "2025-04-15",
      amount: "$2,500.00",
      status: "Outstanding",
    },
    {
      id: "INV-002",
      customer: "Acme Industries",
      date: "2025-02-20",
      dueDate: "2025-03-20",
      amount: "$1,000.00",
      status: "Overdue",
    },
    {
      id: "INV-003",
      customer: "Tech Solutions Inc",
      date: "2025-03-25",
      dueDate: "2025-04-25",
      amount: "$1,250.00",
      status: "Pending",
    },
    {
      id: "INV-004",
      customer: "Global Enterprises",
      date: "2025-02-10",
      dueDate: "2025-03-10",
      amount: "$3,200.00",
      status: "Paid",
    },
    // Additional invoices
    {
      id: "INV-005",
      customer: "Digital Dynamics",
      date: "2025-03-28",
      dueDate: "2025-04-28",
      amount: "$2,100.00",
      status: "Outstanding",
    },
    {
      id: "INV-006",
      customer: "Digital Dynamics",
      date: "2025-03-15",
      dueDate: "2025-04-15",
      amount: "$1,850.00",
      status: "Pending",
    },
    {
      id: "INV-007",
      customer: "Digital Dynamics",
      date: "2025-02-25",
      dueDate: "2025-03-25",
      amount: "$1,775.00",
      status: "Overdue",
    },
    {
      id: "INV-008",
      customer: "Quantum Computing",
      date: "2025-03-20",
      dueDate: "2025-04-20",
      amount: "$2,150.00",
      status: "Pending",
    },
    {
      id: "INV-009",
      customer: "Everest Consulting",
      date: "2025-03-10",
      dueDate: "2025-04-10",
      amount: "$2,300.00",
      status: "Outstanding",
    },
    {
      id: "INV-010",
      customer: "Everest Consulting",
      date: "2025-02-15",
      dueDate: "2025-03-15",
      amount: "$2,000.00",
      status: "Overdue",
    },
  ];

  const abcExpenses: Expense[] = [
    {
      id: "EXP-001",
      category: "Office Supplies",
      vendor: "Office Depot",
      date: "2025-03-10",
      amount: "$156.78",
      status: "Paid",
    },
    {
      id: "EXP-002",
      category: "Utilities",
      vendor: "Electric Company",
      date: "2025-03-15",
      amount: "$235.67",
      status: "Approved",
    },
    {
      id: "EXP-003",
      category: "Software",
      vendor: "Adobe",
      date: "2025-03-20",
      amount: "$49.99",
      status: "Pending",
    },
    // Additional expenses
    {
      id: "EXP-004",
      category: "Rent",
      vendor: "Parkview Properties",
      date: "2025-04-01",
      amount: "$3,500.00",
      status: "Paid",
    },
    {
      id: "EXP-005",
      category: "Internet",
      vendor: "Spectrum Business",
      date: "2025-03-25",
      amount: "$189.99",
      status: "Approved",
    },
    {
      id: "EXP-006",
      category: "Marketing",
      vendor: "Digital Ads Inc",
      date: "2025-03-18",
      amount: "$750.00",
      status: "Paid",
    },
    {
      id: "EXP-007",
      category: "Travel",
      vendor: "Delta Airlines",
      date: "2025-04-05",
      amount: "$875.45",
      status: "Pending",
    },
    {
      id: "EXP-008",
      category: "Meals",
      vendor: "Client Dinner",
      date: "2025-03-30",
      amount: "$245.87",
      status: "Approved",
    },
  ];

  const abcAccounts = [
    {
      id: "acc-1",
      name: "Business Checking",
      institution: "First National Bank",
      balance: "$24,587.65",
      lastSync: "Today at 9:30 AM",
    },
    {
      id: "acc-2",
      name: "Business Savings",
      institution: "First National Bank",
      balance: "$58,900.00",
      lastSync: "Today at 9:30 AM",
    },
    {
      id: "acc-3",
      name: "Credit Card",
      institution: "Capital Finance",
      balance: "-$4,325.18",
      lastSync: "Yesterday at 11:45 PM",
    },
    // Additional accounts
    {
      id: "acc-4",
      name: "Payroll Account",
      institution: "First National Bank",
      balance: "$18,750.00",
      lastSync: "Today at 9:30 AM",
    },
    {
      id: "acc-5",
      name: "Tax Savings",
      institution: "Citizens Trust",
      balance: "$12,500.00",
      lastSync: "2 days ago",
    },
  ];

  const abcInventory: InventoryItem[] = [
    {
      id: "INV-001",
      name: "Widget Pro",
      sku: "WDG-PRO-001",
      quantity: 250,
      reorderPoint: 50,
      costPrice: "$15.00",
      sellPrice: "$29.99",
      category: "Hardware",
      status: "In Stock",
    },
    {
      id: "INV-002",
      name: "Premium Gadget",
      sku: "PRM-GDG-002",
      quantity: 125,
      reorderPoint: 30,
      costPrice: "$25.00",
      sellPrice: "$49.99",
      category: "Electronics",
      status: "In Stock",
    },
    {
      id: "INV-003",
      name: "Basic Tool Kit",
      sku: "BSC-TLK-003",
      quantity: 15,
      reorderPoint: 20,
      costPrice: "$35.00",
      sellPrice: "$75.00",
      category: "Tools",
      status: "Low Stock",
    },
    {
      id: "INV-004",
      name: "Deluxe Component",
      sku: "DLX-CMP-004",
      quantity: 78,
      reorderPoint: 25,
      costPrice: "$12.50",
      sellPrice: "$24.99",
      category: "Hardware",
      status: "In Stock",
    },
    {
      id: "INV-005",
      name: "Premium Service Plan",
      sku: "PRM-SVC-005",
      quantity: 0,
      reorderPoint: 0,
      costPrice: "$0.00",
      sellPrice: "$199.99",
      category: "Services",
      status: "Service Item",
    },
    // Additional inventory items
    {
      id: "INV-006",
      name: "Advanced Sensor",
      sku: "ADV-SNS-006",
      quantity: 45,
      reorderPoint: 15,
      costPrice: "$35.00",
      sellPrice: "$79.99",
      category: "Electronics",
      status: "In Stock",
    },
    {
      id: "INV-007",
      name: "Connector Cable",
      sku: "CON-CBL-007",
      quantity: 350,
      reorderPoint: 100,
      costPrice: "$3.75",
      sellPrice: "$12.99",
      category: "Accessories",
      status: "In Stock",
    },
    {
      id: "INV-008",
      name: "Professional Kit",
      sku: "PRO-KIT-008",
      quantity: 0,
      reorderPoint: 10,
      costPrice: "$150.00",
      sellPrice: "$299.99",
      category: "Tools",
      status: "Out of Stock",
    },
  ];

  const abcProjects = [
    {
      id: "PRJ-001",
      name: "Website Redesign",
      client: "Acme Industries",
      status: "In Progress",
      progress: 65,
      budget: "$12,000.00",
      spent: "$7,800.00",
      startDate: "2025-02-15",
      endDate: "2025-05-15",
    },
    {
      id: "PRJ-002",
      name: "App Development",
      client: "Tech Solutions Inc",
      status: "Planning",
      progress: 15,
      budget: "$45,000.00",
      spent: "$6,750.00",
      startDate: "2025-04-01",
      endDate: "2025-09-30",
    },
    {
      id: "PRJ-003",
      name: "Brand Refresh",
      client: "Global Enterprises",
      status: "Completed",
      progress: 100,
      budget: "$8,500.00",
      spent: "$8,200.00",
      startDate: "2025-01-10",
      endDate: "2025-03-10",
    },
    // Additional projects
    {
      id: "PRJ-004",
      name: "Mobile App Redesign",
      client: "Digital Dynamics",
      status: "In Progress",
      progress: 40,
      budget: "$22,500.00",
      spent: "$9,000.00",
      startDate: "2025-03-01",
      endDate: "2025-06-30",
    },
    {
      id: "PRJ-005",
      name: "E-commerce Platform",
      client: "Sunrise Media Group",
      status: "On Hold",
      progress: 25,
      budget: "$35,000.00",
      spent: "$8,750.00",
      startDate: "2025-02-01",
      endDate: "2025-08-15",
    },
  ];

  // Generate XYZ Limited data
  const xyzCustomers: Customer[] = [
    {
      id: "CUST-101",
      name: "Metro Corp",
      contactName: "Alice Chen",
      email: "alice@metrocorp.com",
      phone: "(555) 234-5678",
      openInvoices: 3,
      balance: "$7,850.00",
      status: "Active",
    },
    {
      id: "CUST-102",
      name: "Brightstar Media",
      contactName: "David Wilson",
      email: "david@brightstar.com",
      phone: "(555) 876-5432",
      openInvoices: 1,
      balance: "$2,300.00",
      status: "Active",
    },
    {
      id: "CUST-103",
      name: "NorthStar Consulting",
      contactName: "Sarah Miller",
      email: "sarah@northstar.com",
      phone: "(555) 765-4321",
      openInvoices: 0,
      balance: "$0.00",
      status: "Active",
    },
    // Additional customers
    {
      id: "CUST-104",
      name: "Apex Solutions",
      contactName: "Thomas Wright",
      email: "thomas@apex.com",
      phone: "(555) 444-3333",
      openInvoices: 2,
      balance: "$5,250.00",
      status: "Active",
    },
    {
      id: "CUST-105",
      name: "Future Technologies",
      contactName: "Jessica Lee",
      email: "jessica@futuretech.com",
      phone: "(555) 222-1111",
      openInvoices: 3,
      balance: "$8,750.00",
      status: "Active",
    },
    {
      id: "CUST-106",
      name: "Horizon Analytics",
      contactName: "Daniel Patel",
      email: "daniel@horizonanalytics.com",
      phone: "(555) 888-9999",
      openInvoices: 1,
      balance: "$3,200.00",
      status: "Active",
    },
    {
      id: "CUST-107",
      name: "Innovate Design Studio",
      contactName: "Olivia Rodriguez",
      email: "olivia@innovatedesign.com",
      phone: "(555) 777-6666",
      openInvoices: 0,
      balance: "$0.00",
      status: "Inactive",
    },
  ];

  const xyzInvoices: Invoice[] = [
    {
      id: "INV-101",
      customer: "Metro Corp",
      date: "2025-03-20",
      dueDate: "2025-04-20",
      amount: "$3,250.00",
      status: "Outstanding",
    },
    {
      id: "INV-102",
      customer: "Metro Corp",
      date: "2025-03-05",
      dueDate: "2025-04-05",
      amount: "$2,100.00",
      status: "Overdue",
    },
    {
      id: "INV-103",
      customer: "Metro Corp",
      date: "2025-04-01",
      dueDate: "2025-05-01",
      amount: "$2,500.00",
      status: "Pending",
    },
    {
      id: "INV-104",
      customer: "Brightstar Media",
      date: "2025-03-25",
      dueDate: "2025-04-25",
      amount: "$2,300.00",
      status: "Pending",
    },
    {
      id: "INV-105",
      customer: "NorthStar Consulting",
      date: "2025-02-15",
      dueDate: "2025-03-15",
      amount: "$4,700.00",
      status: "Paid",
    },
    // Additional invoices
    {
      id: "INV-106",
      customer: "Apex Solutions",
      date: "2025-03-28",
      dueDate: "2025-04-28",
      amount: "$3,150.00",
      status: "Outstanding",
    },
    {
      id: "INV-107",
      customer: "Apex Solutions",
      date: "2025-03-10",
      dueDate: "2025-04-10",
      amount: "$2,100.00",
      status: "Overdue",
    },
    {
      id: "INV-108",
      customer: "Future Technologies",
      date: "2025-04-05",
      dueDate: "2025-05-05",
      amount: "$3,200.00",
      status: "Pending",
    },
    {
      id: "INV-109",
      customer: "Future Technologies",
      date: "2025-03-20",
      dueDate: "2025-04-20",
      amount: "$2,800.00",
      status: "Outstanding",
    },
    {
      id: "INV-110",
      customer: "Future Technologies",
      date: "2025-03-01",
      dueDate: "2025-04-01",
      amount: "$2,750.00",
      status: "Overdue",
    },
    {
      id: "INV-111",
      customer: "Horizon Analytics",
      date: "2025-03-15",
      dueDate: "2025-04-15",
      amount: "$3,200.00",
      status: "Pending",
    },
  ];

  const xyzExpenses: Expense[] = [
    {
      id: "EXP-101",
      category: "Rent",
      vendor: "Downtown Properties",
      date: "2025-04-01",
      amount: "$3,500.00",
      status: "Paid",
    },
    {
      id: "EXP-102",
      category: "Marketing",
      vendor: "Social Media Pros",
      date: "2025-03-25",
      amount: "$1,250.00",
      status: "Approved",
    },
    {
      id: "EXP-103",
      category: "Equipment",
      vendor: "Tech Warehouse",
      date: "2025-03-15",
      amount: "$3,789.50",
      status: "Paid",
    },
    {
      id: "EXP-104",
      category: "Subscriptions",
      vendor: "Cloud Services Inc",
      date: "2025-04-05",
      amount: "$299.99",
      status: "Pending",
    },
    // Additional expenses
    {
      id: "EXP-105",
      category: "Utilities",
      vendor: "City Power & Water",
      date: "2025-04-02",
      amount: "$475.25",
      status: "Approved",
    },
    {
      id: "EXP-106",
      category: "Insurance",
      vendor: "Business Insurance Co",
      date: "2025-04-10",
      amount: "$850.00",
      status: "Pending",
    },
    {
      id: "EXP-107",
      category: "Office Supplies",
      vendor: "Office Essentials",
      date: "2025-03-28",
      amount: "$235.67",
      status: "Paid",
    },
    {
      id: "EXP-108",
      category: "Consulting",
      vendor: "Business Advisors LLC",
      date: "2025-03-20",
      amount: "$2,500.00",
      status: "Paid",
    },
    {
      id: "EXP-109",
      category: "Training",
      vendor: "Professional Development Inc",
      date: "2025-04-15",
      amount: "$1,200.00",
      status: "Pending",
    },
  ];

  const xyzAccounts = [
    {
      id: "acc-101",
      name: "Operations Account",
      institution: "Capital Bank",
      balance: "$37,256.80",
      lastSync: "Today at 10:15 AM",
    },
    {
      id: "acc-102",
      name: "Payroll Account",
      institution: "Capital Bank",
      balance: "$24,750.00",
      lastSync: "Today at 10:15 AM",
    },
    {
      id: "acc-103",
      name: "Business Credit Card",
      institution: "Apex Financial",
      balance: "-$7,853.42",
      lastSync: "Yesterday at 8:30 PM",
    },
    {
      id: "acc-104",
      name: "Investment Account",
      institution: "Investment Partners",
      balance: "$125,000.00",
      lastSync: "3 days ago",
    },
    // Additional accounts
    {
      id: "acc-105",
      name: "Tax Reserve",
      institution: "Capital Bank",
      balance: "$32,500.00",
      lastSync: "Today at 10:15 AM",
    },
    {
      id: "acc-106",
      name: "R&D Fund",
      institution: "Investment Partners",
      balance: "$75,000.00",
      lastSync: "3 days ago",
    },
  ];

  const xyzInventory: InventoryItem[] = [
    {
      id: "INV-101",
      name: "Smart Device X1",
      sku: "SDX1-001",
      quantity: 75,
      reorderPoint: 20,
      costPrice: "$85.00",
      sellPrice: "$149.99",
      category: "Electronics",
      status: "In Stock",
    },
    {
      id: "INV-102",
      name: "Pro Monitor 4K",
      sku: "PM4K-002",
      quantity: 23,
      reorderPoint: 15,
      costPrice: "$175.00",
      sellPrice: "$349.99",
      category: "Electronics",
      status: "In Stock",
    },
    {
      id: "INV-103",
      name: "Desktop Computer",
      sku: "DC-003",
      quantity: 8,
      reorderPoint: 10,
      costPrice: "$650.00",
      sellPrice: "$1,199.99",
      category: "Computers",
      status: "Low Stock",
    },
    {
      id: "INV-104",
      name: "Laptop Pro",
      sku: "LP-004",
      quantity: 0,
      reorderPoint: 5,
      costPrice: "$950.00",
      sellPrice: "$1,699.99",
      category: "Computers",
      status: "Out of Stock",
    },
    {
      id: "INV-105",
      name: "IT Support Package",
      sku: "ITSP-005",
      quantity: 0,
      reorderPoint: 0,
      costPrice: "$0.00",
      sellPrice: "$399.99",
      category: "Services",
      status: "Service Item",
    },
    // Additional inventory items
    {
      id: "INV-106",
      name: "Network Router Pro",
      sku: "NRP-006",
      quantity: 15,
      reorderPoint: 5,
      costPrice: "$120.00",
      sellPrice: "$249.99",
      category: "Networking",
      status: "In Stock",
    },
    {
      id: "INV-107",
      name: "Wireless Headphones",
      sku: "WH-007",
      quantity: 42,
      reorderPoint: 10,
      costPrice: "$65.00",
      sellPrice: "$129.99",
      category: "Accessories",
      status: "In Stock",
    },
    {
      id: "INV-108",
      name: "External SSD 1TB",
      sku: "SSD-008",
      quantity: 3,
      reorderPoint: 5,
      costPrice: "$95.00",
      sellPrice: "$179.99",
      category: "Storage",
      status: "Low Stock",
    },
  ];

  const xyzProjects = [
    {
      id: "PRJ-101",
      name: "Digital Transformation",
      client: "Metro Corp",
      status: "In Progress",
      progress: 45,
      budget: "$78,000.00",
      spent: "$35,100.00",
      startDate: "2025-02-01",
      endDate: "2025-07-31",
    },
    {
      id: "PRJ-102",
      name: "IT Infrastructure Upgrade",
      client: "Brightstar Media",
      status: "Planning",
      progress: 10,
      budget: "$32,500.00",
      spent: "$3,250.00",
      startDate: "2025-04-15",
      endDate: "2025-06-30",
    },
    {
      id: "PRJ-103",
      name: "Cloud Migration",
      client: "NorthStar Consulting",
      status: "Completed",
      progress: 100,
      budget: "$45,000.00",
      spent: "$43,750.00",
      startDate: "2024-11-15",
      endDate: "2025-03-15",
    },
    {
      id: "PRJ-104",
      name: "Security Assessment",
      client: "Metro Corp",
      status: "In Progress",
      progress: 75,
      budget: "$12,500.00",
      spent: "$9,375.00",
      startDate: "2025-03-10",
      endDate: "2025-04-30",
    },
    // Additional projects
    {
      id: "PRJ-105",
      name: "Mobile App Development",
      client: "Apex Solutions",
      status: "In Progress",
      progress: 35,
      budget: "$65,000.00",
      spent: "$22,750.00",
      startDate: "2025-03-01",
      endDate: "2025-08-31",
    },
    {
      id: "PRJ-106",
      name: "Data Analytics Platform",
      client: "Future Technologies",
      status: "Planning",
      progress: 15,
      budget: "$95,000.00",
      spent: "$14,250.00",
      startDate: "2025-04-20",
      endDate: "2025-10-15",
    },
    {
      id: "PRJ-107",
      name: "Website Optimization",
      client: "Horizon Analytics",
      status: "In Progress",
      progress: 60,
      budget: "$18,500.00",
      spent: "$11,100.00",
      startDate: "2025-03-15",
      endDate: "2025-05-15",
    },
  ];

  // 123 Industries
  const industryCustomers: Customer[] = [
    {
      id: "CUST-201",
      name: "Horizon Manufacturing",
      contactName: "Michael Rodriguez",
      email: "michael@horizonmfg.com",
      phone: "(555) 345-6789",
      openInvoices: 2,
      balance: "$24,750.00",
      status: "Active",
    },
    {
      id: "CUST-202",
      name: "Summit Construction",
      contactName: "Jennifer Lee",
      email: "jennifer@summitconst.com",
      phone: "(555) 567-8901",
      openInvoices: 3,
      balance: "$18,950.00",
      status: "Active",
    },
    {
      id: "CUST-203",
      name: "Evergreen Agriculture",
      contactName: "Thomas Wilson",
      email: "thomas@evergreen.com",
      phone: "(555) 678-9012",
      openInvoices: 1,
      balance: "$9,875.00",
      status: "Active",
    },
    {
      id: "CUST-204",
      name: "Blue Ocean Shipping",
      contactName: "Amanda Clark",
      email: "amanda@blueocean.com",
      phone: "(555) 789-0123",
      openInvoices: 0,
      balance: "$0.00",
      status: "Inactive",
    },
    // Additional customers
    {
      id: "CUST-205",
      name: "Precision Tools Inc",
      contactName: "Robert Garcia",
      email: "robert@precisiontools.com",
      phone: "(555) 234-5678",
      openInvoices: 2,
      balance: "$15,250.00",
      status: "Active",
    },
    {
      id: "CUST-206",
      name: "Mountain Valley Mining",
      contactName: "Elizabeth Thompson",
      email: "elizabeth@mvmining.com",
      phone: "(555) 345-6789",
      openInvoices: 1,
      balance: "$42,500.00",
      status: "Active",
    },
    {
      id: "CUST-207",
      name: "Coastal Fisheries",
      contactName: "James Wilson",
      email: "james@coastalfisheries.com",
      phone: "(555) 456-7890",
      openInvoices: 3,
      balance: "$28,750.00",
      status: "Active",
    },
    {
      id: "CUST-208",
      name: "Urban Development Corp",
      contactName: "Sophia Martinez",
      email: "sophia@urbandevelopment.com",
      phone: "(555) 567-8901",
      openInvoices: 0,
      balance: "$0.00",
      status: "Inactive",
    },
  ];

  const industryInvoices: Invoice[] = [
    {
      id: "INV-201",
      customer: "Horizon Manufacturing",
      date: "2025-04-01",
      dueDate: "2025-05-01",
      amount: "$15,750.00",
      status: "Outstanding",
    },
    {
      id: "INV-202",
      customer: "Horizon Manufacturing",
      date: "2025-03-25",
      dueDate: "2025-04-25",
      amount: "$9,000.00",
      status: "Pending",
    },
    {
      id: "INV-203",
      customer: "Summit Construction",
      date: "2025-03-15",
      dueDate: "2025-04-15",
      amount: "$7,500.00",
      status: "Overdue",
    },
    {
      id: "INV-204",
      customer: "Summit Construction",
      date: "2025-03-10",
      dueDate: "2025-04-10",
      amount: "$6,250.00",
      status: "Overdue",
    },
    {
      id: "INV-205",
      customer: "Summit Construction",
      date: "2025-04-05",
      dueDate: "2025-05-05",
      amount: "$5,200.00",
      status: "Pending",
    },
    {
      id: "INV-206",
      customer: "Evergreen Agriculture",
      date: "2025-04-02",
      dueDate: "2025-05-02",
      amount: "$9,875.00",
      status: "Outstanding",
    },
    {
      id: "INV-207",
      customer: "Blue Ocean Shipping",
      date: "2025-02-20",
      dueDate: "2025-03-20",
      amount: "$12,350.00",
      status: "Paid",
    },
    // Additional invoices
    {
      id: "INV-208",
      customer: "Precision Tools Inc",
      date: "2025-04-10",
      dueDate: "2025-05-10",
      amount: "$8,250.00",
      status: "Outstanding",
    },
    {
      id: "INV-209",
      customer: "Precision Tools Inc",
      date: "2025-03-20",
      dueDate: "2025-04-20",
      amount: "$7,000.00",
      status: "Overdue",
    },
    {
      id: "INV-210",
      customer: "Mountain Valley Mining",
      date: "2025-04-05",
      dueDate: "2025-05-05",
      amount: "$42,500.00",
      status: "Outstanding",
    },
    {
      id: "INV-211",
      customer: "Coastal Fisheries",
      date: "2025-04-08",
      dueDate: "2025-05-08",
      amount: "$10,500.00",
      status: "Outstanding",
    },
    {
      id: "INV-212",
      customer: "Coastal Fisheries",
      date: "2025-03-25",
      dueDate: "2025-04-25",
      amount: "$9,750.00",
      status: "Overdue",
    },
    {
      id: "INV-213",
      customer: "Coastal Fisheries",
      date: "2025-03-10",
      dueDate: "2025-04-10",
      amount: "$8,500.00",
      status: "Overdue",
    },
  ];

  const industryExpenses: Expense[] = [
    {
      id: "EXP-201",
      category: "Raw Materials",
      vendor: "Steel Supply Co",
      date: "2025-04-05",
      amount: "$28,750.00",
      status: "Approved",
    },
    {
      id: "EXP-202",
      category: "Manufacturing Equipment",
      vendor: "Industrial Machines Inc",
      date: "2025-03-28",
      amount: "$45,875.00",
      status: "Paid",
    },
    {
      id: "EXP-203",
      category: "Shipping",
      vendor: "FastFreight Logistics",
      date: "2025-04-10",
      amount: "$3,850.00",
      status: "Pending",
    },
    {
      id: "EXP-204",
      category: "Utilities",
      vendor: "Power & Water Corp",
      date: "2025-04-02",
      amount: "$7,250.00",
      status: "Paid",
    },
    {
      id: "EXP-205",
      category: "Factory Lease",
      vendor: "Industrial Properties LLC",
      date: "2025-04-01",
      amount: "$12,500.00",
      status: "Paid",
    },
    {
      id: "EXP-206",
      category: "Maintenance",
      vendor: "Factory Maintenance Services",
      date: "2025-04-08",
      amount: "$1,875.00",
      status: "Approved",
    },
    // Additional expenses
    {
      id: "EXP-207",
      category: "Safety Equipment",
      vendor: "Industrial Safety Supplies",
      date: "2025-04-12",
      amount: "$3,250.00",
      status: "Pending",
    },
    {
      id: "EXP-208",
      category: "Insurance",
      vendor: "Manufacturing Insurance Co",
      date: "2025-04-15",
      amount: "$4,750.00",
      status: "Approved",
    },
    {
      id: "EXP-209",
      category: "Employee Training",
      vendor: "Industrial Skills Institute",
      date: "2025-03-30",
      amount: "$5,875.00",
      status: "Paid",
    },
    {
      id: "EXP-210",
      category: "Fuel",
      vendor: "Industrial Fuels Inc",
      date: "2025-04-05",
      amount: "$4,250.00",
      status: "Paid",
    },
    {
      id: "EXP-211",
      category: "Quality Testing",
      vendor: "Quality Assurance Labs",
      date: "2025-04-18",
      amount: "$2,850.00",
      status: "Pending",
    },
  ];

  const industryAccounts = [
    {
      id: "acc-201",
      name: "Main Operating Account",
      institution: "Industrial Bank",
      balance: "$145,750.28",
      lastSync: "Today at 8:45 AM",
    },
    {
      id: "acc-202",
      name: "Payroll Account",
      institution: "Industrial Bank",
      balance: "$87,250.00",
      lastSync: "Today at 8:45 AM",
    },
    {
      id: "acc-203",
      name: "Materials Procurement",
      institution: "Industrial Bank",
      balance: "$125,875.45",
      lastSync: "Today at 8:45 AM",
    },
    {
      id: "acc-204",
      name: "Corporate Credit Card",
      institution: "Business Financial",
      balance: "-$23,456.78",
      lastSync: "Yesterday at 7:15 PM",
    },
    {
      id: "acc-205",
      name: "Equipment Fund",
      institution: "Capital Growth Bank",
      balance: "$275,000.00",
      lastSync: "2 days ago",
    },
    // Additional accounts
    {
      id: "acc-206",
      name: "Factory Expansion Fund",
      institution: "Capital Growth Bank",
      balance: "$450,000.00",
      lastSync: "2 days ago",
    },
    {
      id: "acc-207",
      name: "International Operations",
      institution: "Global Finance Bank",
      balance: "$185,250.45",
      lastSync: "Yesterday at 4:30 PM",
    },
  ];

  const industryInventory: InventoryItem[] = [
    {
      id: "INV-201",
      name: "Industrial Generator",
      sku: "IND-GEN-201",
      quantity: 8,
      reorderPoint: 3,
      costPrice: "$4,250.00",
      sellPrice: "$6,799.99",
      category: "Equipment",
      status: "In Stock",
    },
    {
      id: "INV-202",
      name: "Steel Beams (20ft)",
      sku: "ST-BM-202",
      quantity: 150,
      reorderPoint: 30,
      costPrice: "$175.00",
      sellPrice: "$289.99",
      category: "Materials",
      status: "In Stock",
    },
    {
      id: "INV-203",
      name: "Aluminum Sheets (4x8)",
      sku: "AL-SH-203",
      quantity: 85,
      reorderPoint: 40,
      costPrice: "$95.00",
      sellPrice: "$149.99",
      category: "Materials",
      status: "In Stock",
    },
    {
      id: "INV-204",
      name: "Heavy-Duty Forklift",
      sku: "HDF-204",
      quantity: 2,
      reorderPoint: 1,
      costPrice: "$28,750.00",
      sellPrice: "$37,500.00",
      category: "Equipment",
      status: "In Stock",
    },
    {
      id: "INV-205",
      name: "Safety Helmets",
      sku: "SFT-HLM-205",
      quantity: 26,
      reorderPoint: 50,
      costPrice: "$45.00",
      sellPrice: "$75.00",
      category: "Safety",
      status: "Low Stock",
    },
    {
      id: "INV-206",
      name: "Industrial Conveyor Belt",
      sku: "ICB-206",
      quantity: 0,
      reorderPoint: 2,
      costPrice: "$5,250.00",
      sellPrice: "$7,895.00",
      category: "Equipment",
      status: "Out of Stock",
    },
    {
      id: "INV-207",
      name: "Equipment Installation",
      sku: "SVC-EI-207",
      quantity: 0,
      reorderPoint: 0,
      costPrice: "$0.00",
      sellPrice: "$1,250.00",
      category: "Services",
      status: "Service Item",
    },
    // Additional inventory items
    {
      id: "INV-208",
      name: "Industrial Shelving",
      sku: "IND-SLV-208",
      quantity: 45,
      reorderPoint: 15,
      costPrice: "$175.00",
      sellPrice: "$289.99",
      category: "Equipment",
      status: "In Stock",
    },
    {
      id: "INV-209",
      name: "Welding Machine",
      sku: "WLD-MCH-209",
      quantity: 12,
      reorderPoint: 5,
      costPrice: "$1,250.00",
      sellPrice: "$2,499.99",
      category: "Equipment",
      status: "In Stock",
    },
    {
      id: "INV-210",
      name: "Hydraulic Press",
      sku: "HYD-PRS-210",
      quantity: 3,
      reorderPoint: 2,
      costPrice: "$8,500.00",
      sellPrice: "$12,750.00",
      category: "Equipment",
      status: "In Stock",
    },
    {
      id: "INV-211",
      name: "Safety Gloves (Pair)",
      sku: "SFT-GLV-211",
      quantity: 120,
      reorderPoint: 50,
      costPrice: "$12.50",
      sellPrice: "$24.99",
      category: "Safety",
      status: "In Stock",
    },
  ];

  const industryProjects = [
    {
      id: "PRJ-201",
      name: "Factory Expansion",
      client: "Internal",
      status: "In Progress",
      progress: 35,
      budget: "$1,250,000.00",
      spent: "$437,500.00",
      startDate: "2025-02-15",
      endDate: "2025-12-31",
    },
    {
      id: "PRJ-202",
      name: "New Production Line",
      client: "Horizon Manufacturing",
      status: "In Progress",
      progress: 60,
      budget: "$875,000.00",
      spent: "$525,000.00",
      startDate: "2025-01-10",
      endDate: "2025-06-30",
    },
    {
      id: "PRJ-203",
      name: "Construction Materials Supply",
      client: "Summit Construction",
      status: "In Progress",
      progress: 40,
      budget: "$350,000.00",
      spent: "$140,000.00",
      startDate: "2025-03-01",
      endDate: "2025-10-31",
    },
    {
      id: "PRJ-204",
      name: "Agricultural Equipment Installation",
      client: "Evergreen Agriculture",
      status: "Planning",
      progress: 15,
      budget: "$180,000.00",
      spent: "$27,000.00",
      startDate: "2025-05-01",
      endDate: "2025-07-31",
    },
    {
      id: "PRJ-205",
      name: "Logistics Optimization",
      client: "Blue Ocean Shipping",
      status: "Completed",
      progress: 100,
      budget: "$125,000.00",
      spent: "$118,750.00",
      startDate: "2024-10-15",
      endDate: "2025-02-28",
    },
    // Additional projects
    {
      id: "PRJ-206",
      name: "Equipment Modernization",
      client: "Precision Tools Inc",
      status: "In Progress",
      progress: 45,
      budget: "$450,000.00",
      spent: "$202,500.00",
      startDate: "2025-03-15",
      endDate: "2025-09-30",
    },
    {
      id: "PRJ-207",
      name: "Safety Compliance Upgrade",
      client: "Internal",
      status: "Planning",
      progress: 20,
      budget: "$175,000.00",
      spent: "$35,000.00",
      startDate: "2025-05-01",
      endDate: "2025-08-31",
    },
    {
      id: "PRJ-208",
      name: "Mining Equipment Supply",
      client: "Mountain Valley Mining",
      status: "In Progress",
      progress: 30,
      budget: "$650,000.00",
      spent: "$195,000.00",
      startDate: "2025-03-01",
      endDate: "2025-07-31",
    },
  ];

  // Create a fourth company: Global Digital Services
  const gdsCustomers: Customer[] = [
    {
      id: "CUST-301",
      name: "Infinite Solutions",
      contactName: "Ryan Taylor",
      email: "ryan@infinitesolutions.com",
      phone: "(555) 123-7890",
      openInvoices: 2,
      balance: "$12,500.00",
      status: "Active",
    },
    {
      id: "CUST-302",
      name: "Velocity Partners",
      contactName: "Christina Nguyen",
      email: "christina@velocitypartners.com",
      phone: "(555) 234-5678",
      openInvoices: 3,
      balance: "$18,750.00",
      status: "Active",
    },
    {
      id: "CUST-303",
      name: "Zenith Enterprises",
      contactName: "Jonathan Black",
      email: "jonathan@zenithent.com",
      phone: "(555) 345-6789",
      openInvoices: 1,
      balance: "$7,250.00",
      status: "Active",
    },
    {
      id: "CUST-304",
      name: "Pinnacle Group",
      contactName: "Melissa Wong",
      email: "melissa@pinnaclegroup.com",
      phone: "(555) 456-7890",
      openInvoices: 0,
      balance: "$0.00",
      status: "Inactive",
    },
    {
      id: "CUST-305",
      name: "Nexus Technologies",
      contactName: "Andrew Davis",
      email: "andrew@nexustech.com",
      phone: "(555) 567-8901",
      openInvoices: 2,
      balance: "$9,850.00",
      status: "Active",
    },
    {
      id: "CUST-306",
      name: "Spectrum Innovations",
      contactName: "Laura Chen",
      email: "laura@spectruminnovations.com",
      phone: "(555) 678-9012",
      openInvoices: 1,
      balance: "$5,200.00",
      status: "Active",
    },
  ];

  const gdsInvoices: Invoice[] = [
    {
      id: "INV-301",
      customer: "Infinite Solutions",
      date: "2025-04-05",
      dueDate: "2025-05-05",
      amount: "$7,500.00",
      status: "Outstanding",
    },
    {
      id: "INV-302",
      customer: "Infinite Solutions",
      date: "2025-03-20",
      dueDate: "2025-04-20",
      amount: "$5,000.00",
      status: "Overdue",
    },
    {
      id: "INV-303",
      customer: "Velocity Partners",
      date: "2025-04-10",
      dueDate: "2025-05-10",
      amount: "$8,250.00",
      status: "Outstanding",
    },
    {
      id: "INV-304",
      customer: "Velocity Partners",
      date: "2025-03-25",
      dueDate: "2025-04-25",
      amount: "$5,500.00",
      status: "Overdue",
    },
    {
      id: "INV-305",
      customer: "Velocity Partners",
      date: "2025-03-15",
      dueDate: "2025-04-15",
      amount: "$5,000.00",
      status: "Overdue",
    },
    {
      id: "INV-306",
      customer: "Zenith Enterprises",
      date: "2025-04-01",
      dueDate: "2025-05-01",
      amount: "$7,250.00",
      status: "Outstanding",
    },
    {
      id: "INV-307",
      customer: "Nexus Technologies",
      date: "2025-04-08",
      dueDate: "2025-05-08",
      amount: "$5,850.00",
      status: "Outstanding",
    },
    {
      id: "INV-308",
      customer: "Nexus Technologies",
      date: "2025-03-20",
      dueDate: "2025-04-20",
      amount: "$4,000.00",
      status: "Overdue",
    },
    {
      id: "INV-309",
      customer: "Spectrum Innovations",
      date: "2025-04-05",
      dueDate: "2025-05-05",
      amount: "$5,200.00",
      status: "Outstanding",
    },
  ];

  const gdsExpenses: Expense[] = [
    {
      id: "EXP-301",
      category: "Software Licenses",
      vendor: "Adobe Systems",
      date: "2025-04-01",
      amount: "$2,400.00",
      status: "Paid",
    },
    {
      id: "EXP-302",
      category: "Cloud Services",
      vendor: "AWS",
      date: "2025-04-05",
      amount: "$5,850.00",
      status: "Paid",
    },
    {
      id: "EXP-303",
      category: "Office Rent",
      vendor: "Tech Plaza Properties",
      date: "2025-04-01",
      amount: "$8,500.00",
      status: "Paid",
    },
    {
      id: "EXP-304",
      category: "Equipment",
      vendor: "Dell Computers",
      date: "2025-03-25",
      amount: "$12,750.00",
      status: "Approved",
    },
    {
      id: "EXP-305",
      category: "Marketing",
      vendor: "Digital Marketing Pro",
      date: "2025-04-10",
      amount: "$4,500.00",
      status: "Pending",
    },
    {
      id: "EXP-306",
      category: "Utilities",
      vendor: "City Power & Internet",
      date: "2025-04-02",
      amount: "$1,850.00",
      status: "Paid",
    },
    {
      id: "EXP-307",
      category: "Professional Development",
      vendor: "Tech Conference Inc",
      date: "2025-04-15",
      amount: "$3,500.00",
      status: "Pending",
    },
    {
      id: "EXP-308",
      category: "Travel",
      vendor: "Business Travel Agency",
      date: "2025-03-28",
      amount: "$4,250.00",
      status: "Approved",
    },
  ];

  const gdsAccounts = [
    {
      id: "acc-301",
      name: "Operations Account",
      institution: "First Digital Bank",
      balance: "$125,750.45",
      lastSync: "Today at 9:15 AM",
    },
    {
      id: "acc-302",
      name: "Payroll Account",
      institution: "First Digital Bank",
      balance: "$75,250.00",
      lastSync: "Today at 9:15 AM",
    },
    {
      id: "acc-303",
      name: "Project Funding",
      institution: "First Digital Bank",
      balance: "$250,000.00",
      lastSync: "Today at 9:15 AM",
    },
    {
      id: "acc-304",
      name: "Corporate Credit Card",
      institution: "Tech Financial",
      balance: "-$15,782.45",
      lastSync: "Yesterday at 10:30 PM",
    },
    {
      id: "acc-305",
      name: "R&D Investment",
      institution: "Innovation Capital",
      balance: "$175,000.00",
      lastSync: "2 days ago",
    },
  ];

  const gdsInventory: InventoryItem[] = [
    {
      id: "INV-301",
      name: "Developer Workstation",
      sku: "DEV-WS-301",
      quantity: 25,
      reorderPoint: 5,
      costPrice: "$1,250.00",
      sellPrice: "$0.00",
      category: "Equipment",
      status: "In Stock",
    },
    {
      id: "INV-302",
      name: "Servers",
      sku: "SVR-302",
      quantity: 10,
      reorderPoint: 2,
      costPrice: "$3,500.00",
      sellPrice: "$0.00",
      category: "Hardware",
      status: "In Stock",
    },
    {
      id: "INV-303",
      name: "Software Development Kit",
      sku: "SDK-303",
      quantity: 0,
      reorderPoint: 0,
      costPrice: "$0.00",
      sellPrice: "$599.99",
      category: "Services",
      status: "Service Item",
    },
    {
      id: "INV-304",
      name: "Cloud Hosting Package",
      sku: "CHP-304",
      quantity: 0,
      reorderPoint: 0,
      costPrice: "$0.00",
      sellPrice: "$250.00",
      category: "Services",
      status: "Service Item",
    },
    {
      id: "INV-305",
      name: "Network Equipment",
      sku: "NET-305",
      quantity: 15,
      reorderPoint: 5,
      costPrice: "$850.00",
      sellPrice: "$0.00",
      category: "Hardware",
      status: "In Stock",
    },
    {
      id: "INV-306",
      name: "Custom Software Solution",
      sku: "CSS-306",
      quantity: 0,
      reorderPoint: 0,
      costPrice: "$0.00",
      sellPrice: "$10,000.00",
      category: "Services",
      status: "Service Item",
    },
  ];

  const gdsProjects = [
    {
      id: "PRJ-301",
      name: "E-commerce Platform Development",
      client: "Infinite Solutions",
      status: "In Progress",
      progress: 65,
      budget: "$150,000.00",
      spent: "$97,500.00",
      startDate: "2025-02-01",
      endDate: "2025-06-30",
    },
    {
      id: "PRJ-302",
      name: "Mobile App Development",
      client: "Velocity Partners",
      status: "In Progress",
      progress: 40,
      budget: "$125,000.00",
      spent: "$50,000.00",
      startDate: "2025-03-15",
      endDate: "2025-08-15",
    },
    {
      id: "PRJ-303",
      name: "AI Integration",
      client: "Zenith Enterprises",
      status: "Planning",
      progress: 10,
      budget: "$200,000.00",
      spent: "$20,000.00",
      startDate: "2025-04-15",
      endDate: "2025-10-31",
    },
    {
      id: "PRJ-304",
      name: "Data Analytics Dashboard",
      client: "Nexus Technologies",
      status: "In Progress",
      progress: 25,
      budget: "$85,000.00",
      spent: "$21,250.00",
      startDate: "2025-03-20",
      endDate: "2025-07-15",
    },
    {
      id: "PRJ-305",
      name: "Website Redesign",
      client: "Spectrum Innovations",
      status: "Completed",
      progress: 100,
      budget: "$45,000.00",
      spent: "$42,500.00",
      startDate: "2025-01-15",
      endDate: "2025-03-31",
    },
  ];

  // Return array of companies
  return [
    {
      id: "abc-corp",
      name: "ABC Corporation",
      industry: "Software & Technology",
      address: "123 Tech Lane, San Francisco, CA 94107",
      email: "info@abccorp.com",
      phone: "(555) 123-4567",
      website: "www.abccorp.com",
      taxId: "12-3456789",
      logo: "https://via.placeholder.com/150?text=ABC",
      revenue: {
        current: 125000,
        lastMonth: 115000,
        percentChange: 8.5,
      },
      outstandingInvoices: {
        amount: 4750,
        count: 5,
        percentChange: -2.3,
      },
      profitMargin: {
        value: 24.8,
        percentChange: 1.5,
      },
      activeCustomers: {
        count: 5,
        percentChange: 25.0,
      },
      customers: abcCustomers,
      invoices: abcInvoices,
      expenses: abcExpenses,
      accounts: abcAccounts,
      transactions: [],
      inventory: abcInventory,
      projects: abcProjects,
      fiscalYearStart: "January 1",
    },
    {
      id: "xyz-limited",
      name: "XYZ Limited",
      industry: "IT Services",
      address: "456 Innovation Blvd, Austin, TX 78701",
      email: "hello@xyzlimited.com",
      phone: "(555) 987-6543",
      website: "www.xyzlimited.com",
      taxId: "98-7654321",
      logo: "https://via.placeholder.com/150?text=XYZ",
      revenue: {
        current: 278500,
        lastMonth: 247000,
        percentChange: 12.7,
      },
      outstandingInvoices: {
        amount: 10150,
        count: 8,
        percentChange: 5.2,
      },
      profitMargin: {
        value: 31.5,
        percentChange: 2.8,
      },
      activeCustomers: {
        count: 6,
        percentChange: 20.0,
      },
      customers: xyzCustomers,
      invoices: xyzInvoices,
      expenses: xyzExpenses,
      accounts: xyzAccounts,
      transactions: [],
      inventory: xyzInventory,
      projects: xyzProjects,
      fiscalYearStart: "January 1",
    },
    {
      id: "123-industries",
      name: "123 Industries",
      industry: "Manufacturing",
      address: "789 Factory Way, Detroit, MI 48201",
      email: "contact@123industries.com",
      phone: "(555) 456-7890",
      website: "www.123industries.com",
      taxId: "45-6789012",
      logo: "https://via.placeholder.com/150?text=123",
      revenue: {
        current: 875250,
        lastMonth: 827000,
        percentChange: 5.8,
      },
      outstandingInvoices: {
        amount: 53575,
        count: 10,
        percentChange: -8.3,
      },
      profitMargin: {
        value: 18.2,
        percentChange: -1.7,
      },
      activeCustomers: {
        count: 6,
        percentChange: 20.0,
      },
      customers: industryCustomers,
      invoices: industryInvoices,
      expenses: industryExpenses,
      accounts: industryAccounts,
      transactions: [],
      inventory: industryInventory,
      projects: industryProjects,
      fiscalYearStart: "January 1",
    },
    {
      id: "gds-group",
      name: "Global Digital Services",
      industry: "Digital Services",
      address: "567 Tech Park, Seattle, WA 98101",
      email: "info@globaldigital.com",
      phone: "(555) 789-0123",
      website: "www.globaldigitalservices.com",
      taxId: "78-9012345",
      logo: "https://via.placeholder.com/150?text=GDS",
      revenue: {
        current: 425000,
        lastMonth: 398000,
        percentChange: 6.8,
      },
      outstandingInvoices: {
        amount: 43550,
        count: 9,
        percentChange: 4.2,
      },
      profitMargin: {
        value: 34.5,
        percentChange: 1.2,
      },
      activeCustomers: {
        count: 5,
        percentChange: 25.0,
      },
      customers: gdsCustomers,
      invoices: gdsInvoices,
      expenses: gdsExpenses,
      accounts: gdsAccounts,
      transactions: [],
      inventory: gdsInventory,
      projects: gdsProjects,
      fiscalYearStart: "January 1",
    },
  ];
};

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<Company[]>(generateCompanyData());
  const [currentCompany, setCurrentCompany] = useState<Company>(companies[0]);

  const switchCompany = (id: string) => {
    const foundCompany = companies.find(company => company.id === id);
    if (foundCompany) {
      setCurrentCompany(foundCompany);
      toast.success(`Switched to ${foundCompany.name}`);
    }
  };

  const addCompany = (companyData: Partial<Company>) => {
    const newCompany: Company = {
      id: `company-${Date.now()}`,
      name: companyData.name || "New Company",
      industry: companyData.industry || "Other",
      address: companyData.address || "",
      email: companyData.email || "",
      phone: companyData.phone || "",
      website: companyData.website || "",
      taxId: companyData.taxId || "",
      logo: companyData.logo || "https://via.placeholder.com/150?text=NEW",
      revenue: companyData.revenue || {
        current: 0,
        lastMonth: 0,
        percentChange: 0,
      },
      outstandingInvoices: companyData.outstandingInvoices || {
        amount: 0,
        count: 0,
        percentChange: 0,
      },
      profitMargin: companyData.profitMargin || {
        value: 0,
        percentChange: 0,
      },
      activeCustomers: companyData.activeCustomers || {
        count: 0,
        percentChange: 0,
      },
      customers: companyData.customers || [],
      invoices: companyData.invoices || [],
      expenses: companyData.expenses || [],
      accounts: companyData.accounts || [],
      transactions: companyData.transactions || [],
      inventory: companyData.inventory || [],
      projects: companyData.projects || [],
      fiscalYearStart: companyData.fiscalYearStart || "January 1",
    };

    const updatedCompanies = [...companies, newCompany];
    setCompanies(updatedCompanies);
    toast.success(`Company "${newCompany.name}" created successfully!`);
    return newCompany;
  };

  const updateCompany = (id: string, updates: Partial<Company>) => {
    const updatedCompanies = companies.map((company) =>
      company.id === id ? { ...company, ...updates } : company
    );
    setCompanies(updatedCompanies);
    
    // If we're updating the current company, also update that reference
    if (currentCompany.id === id) {
      setCurrentCompany({ ...currentCompany, ...updates });
    }
    
    toast.success("Company information updated successfully!");
  };

  const deleteCompany = (id: string) => {
    // Prevent deleting the last company
    if (companies.length <= 1) {
      toast.error("Cannot delete the only company. Create a new company first.");
      return;
    }

    const updatedCompanies = companies.filter((company) => company.id !== id);
    setCompanies(updatedCompanies);

    // If the deleted company was the current one, switch to another company
    if (currentCompany.id === id) {
      setCurrentCompany(updatedCompanies[0]);
    }

    toast.success("Company deleted successfully!");
  };

  return (
    <CompanyContext.Provider
      value={{
        companies,
        currentCompany,
        switchCompany,
        addCompany,
        updateCompany,
        deleteCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
};
