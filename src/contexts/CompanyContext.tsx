
import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";

// Define types for company data
type Status = "Active" | "Inactive";
type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "Outstanding";
type ExpenseStatus = "Approved" | "Pending" | "Rejected" | "Paid";
type TransactionStatus = "completed" | "pending" | "failed";
type TransactionType = "income" | "expense";
type InventoryStatus = "In Stock" | "Low Stock" | "Out of Stock" | "Service Item";

interface Customer {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  openInvoices: number;
  balance: string;
  status: Status;
}

interface Invoice {
  id: string;
  customer: string;
  date: string;
  dueDate: string;
  amount: string;
  status: InvoiceStatus;
}

interface Expense {
  id: string;
  category: string;
  vendor: string;
  date: string;
  amount: string;
  status: ExpenseStatus;
}

interface Account {
  id: string;
  name: string;
  institution: string;
  balance: string;
  lastSync: string;
}

interface Transaction {
  id: string;
  account: string;
  date: string;
  description: string;
  amount: string;
  category: string;
  reconciled: boolean;
}

interface InventoryItem {
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

interface Project {
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

interface Company {
  id: string;
  name: string;
  industry: string;
  address: string;
  email: string;
  phone: string;
  logo: string;
  revenue: {
    current: number;
    percentChange: number;
  };
  outstandingInvoices: {
    amount: number;
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
}

// Create a context for company data
interface CompanyContextType {
  companies: Company[];
  currentCompany: Company;
  setCurrentCompany: (company: Company) => void;
  addCompany: (company: Partial<Company>) => void;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Sample data
const generateCompanyData = (): Company[] => {
  // ABC Corporation
  const abcCustomers = [
    {
      id: "CUST-001",
      name: "Acme Industries",
      contactName: "John Smith",
      email: "john@acme.com",
      phone: "(555) 123-4567",
      openInvoices: 2,
      balance: "$3,500.00",
      status: "Active" as Status,
    },
    {
      id: "CUST-002",
      name: "Tech Solutions Inc",
      contactName: "Mary Johnson",
      email: "mary@techsolutions.com",
      phone: "(555) 987-6543",
      openInvoices: 1,
      balance: "$1,250.00",
      status: "Active" as Status,
    },
    {
      id: "CUST-003",
      name: "Global Enterprises",
      contactName: "Robert Brown",
      email: "robert@globalent.com",
      phone: "(555) 456-7890",
      openInvoices: 0,
      balance: "$0.00",
      status: "Inactive" as Status,
    },
  ];

  const abcInvoices = [
    {
      id: "INV-001",
      customer: "Acme Industries",
      date: "2025-03-15",
      dueDate: "2025-04-15",
      amount: "$2,500.00",
      status: "Outstanding" as InvoiceStatus,
    },
    {
      id: "INV-002",
      customer: "Acme Industries",
      date: "2025-02-20",
      dueDate: "2025-03-20",
      amount: "$1,000.00",
      status: "Overdue" as InvoiceStatus,
    },
    {
      id: "INV-003",
      customer: "Tech Solutions Inc",
      date: "2025-03-25",
      dueDate: "2025-04-25",
      amount: "$1,250.00",
      status: "Pending" as InvoiceStatus,
    },
    {
      id: "INV-004",
      customer: "Global Enterprises",
      date: "2025-02-10",
      dueDate: "2025-03-10",
      amount: "$3,200.00",
      status: "Paid" as InvoiceStatus,
    },
  ];

  const abcExpenses = [
    {
      id: "EXP-001",
      category: "Office Supplies",
      vendor: "Office Depot",
      date: "2025-03-10",
      amount: "$156.78",
      status: "Paid" as ExpenseStatus,
    },
    {
      id: "EXP-002",
      category: "Utilities",
      vendor: "Electric Company",
      date: "2025-03-15",
      amount: "$235.67",
      status: "Approved" as ExpenseStatus,
    },
    {
      id: "EXP-003",
      category: "Software",
      vendor: "Adobe",
      date: "2025-03-20",
      amount: "$49.99",
      status: "Pending" as ExpenseStatus,
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
    }
  ];

  const abcTransactions = [
    {
      id: "TRN-001",
      account: "Business Checking",
      date: "2025-04-11",
      description: "Client Payment - XYZ Corp",
      amount: "+$5,000.00",
      category: "Income",
      reconciled: true,
    },
    {
      id: "TRN-002",
      account: "Business Checking",
      date: "2025-04-10",
      description: "Office Supplies",
      amount: "-$156.78",
      category: "Office Expenses",
      reconciled: true,
    },
    {
      id: "TRN-003",
      account: "Credit Card",
      date: "2025-04-10",
      description: "Software Subscription",
      amount: "-$49.99",
      category: "Software",
      reconciled: false,
    },
    {
      id: "TRN-004",
      account: "Business Checking",
      date: "2025-04-09",
      description: "Utilities - Electricity",
      amount: "-$235.67",
      category: "Utilities",
      reconciled: true,
    },
    {
      id: "TRN-005",
      account: "Business Savings",
      date: "2025-04-08",
      description: "Transfer from Checking",
      amount: "+$2,000.00",
      category: "Transfer",
      reconciled: true,
    },
  ];

  const abcInventory = [
    {
      id: "INV-001",
      name: "Widget Pro",
      sku: "WDG-PRO-001",
      quantity: 250,
      reorderPoint: 50,
      costPrice: "$15.00",
      sellPrice: "$29.99",
      category: "Hardware",
      status: "In Stock" as InventoryStatus,
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
      status: "In Stock" as InventoryStatus,
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
      status: "Low Stock" as InventoryStatus,
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
      status: "In Stock" as InventoryStatus,
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
      status: "Service Item" as InventoryStatus,
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
    }
  ];

  // XYZ Limited
  const xyzCustomers = [
    {
      id: "CUST-101",
      name: "Metro Corp",
      contactName: "Alice Chen",
      email: "alice@metrocorp.com",
      phone: "(555) 234-5678",
      openInvoices: 3,
      balance: "$7,850.00",
      status: "Active" as Status,
    },
    {
      id: "CUST-102",
      name: "Brightstar Media",
      contactName: "David Wilson",
      email: "david@brightstar.com",
      phone: "(555) 876-5432",
      openInvoices: 1,
      balance: "$2,300.00",
      status: "Active" as Status,
    },
    {
      id: "CUST-103",
      name: "NorthStar Consulting",
      contactName: "Sarah Miller",
      email: "sarah@northstar.com",
      phone: "(555) 765-4321",
      openInvoices: 0,
      balance: "$0.00",
      status: "Active" as Status,
    },
  ];

  const xyzInvoices = [
    {
      id: "INV-101",
      customer: "Metro Corp",
      date: "2025-03-20",
      dueDate: "2025-04-20",
      amount: "$3,250.00",
      status: "Outstanding" as InvoiceStatus,
    },
    {
      id: "INV-102",
      customer: "Metro Corp",
      date: "2025-03-05",
      dueDate: "2025-04-05",
      amount: "$2,100.00",
      status: "Overdue" as InvoiceStatus,
    },
    {
      id: "INV-103",
      customer: "Metro Corp",
      date: "2025-04-01",
      dueDate: "2025-05-01",
      amount: "$2,500.00",
      status: "Pending" as InvoiceStatus,
    },
    {
      id: "INV-104",
      customer: "Brightstar Media",
      date: "2025-03-25",
      dueDate: "2025-04-25",
      amount: "$2,300.00",
      status: "Pending" as InvoiceStatus,
    },
    {
      id: "INV-105",
      customer: "NorthStar Consulting",
      date: "2025-02-15",
      dueDate: "2025-03-15",
      amount: "$4,700.00",
      status: "Paid" as InvoiceStatus,
    },
  ];

  const xyzExpenses = [
    {
      id: "EXP-101",
      category: "Rent",
      vendor: "Downtown Properties",
      date: "2025-04-01",
      amount: "$3,500.00",
      status: "Paid" as ExpenseStatus,
    },
    {
      id: "EXP-102",
      category: "Marketing",
      vendor: "Social Media Pros",
      date: "2025-03-25",
      amount: "$1,250.00",
      status: "Approved" as ExpenseStatus,
    },
    {
      id: "EXP-103",
      category: "Equipment",
      vendor: "Tech Warehouse",
      date: "2025-03-15",
      amount: "$3,789.50",
      status: "Paid" as ExpenseStatus,
    },
    {
      id: "EXP-104",
      category: "Subscriptions",
      vendor: "Cloud Services Inc",
      date: "2025-04-05",
      amount: "$299.99",
      status: "Pending" as ExpenseStatus,
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
  ];

  const xyzTransactions = [
    {
      id: "TRN-101",
      account: "Operations Account",
      date: "2025-04-12",
      description: "Client Payment - Brightstar Media",
      amount: "+$2,300.00",
      category: "Income",
      reconciled: false,
    },
    {
      id: "TRN-102",
      account: "Operations Account",
      date: "2025-04-10",
      description: "Office Rent Payment",
      amount: "-$3,500.00",
      category: "Rent",
      reconciled: true,
    },
    {
      id: "TRN-103",
      account: "Business Credit Card",
      date: "2025-04-09",
      description: "Client Dinner",
      amount: "-$187.65",
      category: "Meals & Entertainment",
      reconciled: false,
    },
    {
      id: "TRN-104",
      account: "Payroll Account",
      date: "2025-04-05",
      description: "Payroll Transfer",
      amount: "-$18,450.00",
      category: "Payroll",
      reconciled: true,
    },
    {
      id: "TRN-105",
      account: "Operations Account",
      date: "2025-04-03",
      description: "Client Payment - NorthStar Consulting",
      amount: "+$4,700.00",
      category: "Income",
      reconciled: true,
    },
  ];

  const xyzInventory = [
    {
      id: "INV-101",
      name: "Smart Device X1",
      sku: "SDX1-001",
      quantity: 75,
      reorderPoint: 20,
      costPrice: "$85.00",
      sellPrice: "$149.99",
      category: "Electronics",
      status: "In Stock" as InventoryStatus,
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
      status: "In Stock" as InventoryStatus,
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
      status: "Low Stock" as InventoryStatus,
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
      status: "Out of Stock" as InventoryStatus,
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
      status: "Service Item" as InventoryStatus,
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
  ];

  // 123 Industries
  const industryCustomers = [
    {
      id: "CUST-201",
      name: "Horizon Manufacturing",
      contactName: "Michael Rodriguez",
      email: "michael@horizonmfg.com",
      phone: "(555) 345-6789",
      openInvoices: 2,
      balance: "$24,750.00",
      status: "Active" as Status,
    },
    {
      id: "CUST-202",
      name: "Summit Construction",
      contactName: "Jennifer Lee",
      email: "jennifer@summitconst.com",
      phone: "(555) 567-8901",
      openInvoices: 3,
      balance: "$18,950.00",
      status: "Active" as Status,
    },
    {
      id: "CUST-203",
      name: "Evergreen Agriculture",
      contactName: "Thomas Wilson",
      email: "thomas@evergreen.com",
      phone: "(555) 678-9012",
      openInvoices: 1,
      balance: "$9,875.00",
      status: "Active" as Status,
    },
    {
      id: "CUST-204",
      name: "Blue Ocean Shipping",
      contactName: "Amanda Clark",
      email: "amanda@blueocean.com",
      phone: "(555) 789-0123",
      openInvoices: 0,
      balance: "$0.00",
      status: "Inactive" as Status,
    },
  ];

  const industryInvoices = [
    {
      id: "INV-201",
      customer: "Horizon Manufacturing",
      date: "2025-04-01",
      dueDate: "2025-05-01",
      amount: "$15,750.00",
      status: "Outstanding" as InvoiceStatus,
    },
    {
      id: "INV-202",
      customer: "Horizon Manufacturing",
      date: "2025-03-25",
      dueDate: "2025-04-25",
      amount: "$9,000.00",
      status: "Pending" as InvoiceStatus,
    },
    {
      id: "INV-203",
      customer: "Summit Construction",
      date: "2025-03-15",
      dueDate: "2025-04-15",
      amount: "$7,500.00",
      status: "Overdue" as InvoiceStatus,
    },
    {
      id: "INV-204",
      customer: "Summit Construction",
      date: "2025-03-10",
      dueDate: "2025-04-10",
      amount: "$6,250.00",
      status: "Overdue" as InvoiceStatus,
    },
    {
      id: "INV-205",
      customer: "Summit Construction",
      date: "2025-04-05",
      dueDate: "2025-05-05",
      amount: "$5,200.00",
      status: "Pending" as InvoiceStatus,
    },
    {
      id: "INV-206",
      customer: "Evergreen Agriculture",
      date: "2025-04-02",
      dueDate: "2025-05-02",
      amount: "$9,875.00",
      status: "Outstanding" as InvoiceStatus,
    },
    {
      id: "INV-207",
      customer: "Blue Ocean Shipping",
      date: "2025-02-20",
      dueDate: "2025-03-20",
      amount: "$12,350.00",
      status: "Paid" as InvoiceStatus,
    },
  ];

  const industryExpenses = [
    {
      id: "EXP-201",
      category: "Raw Materials",
      vendor: "Steel Supply Co",
      date: "2025-04-05",
      amount: "$28,750.00",
      status: "Approved" as ExpenseStatus,
    },
    {
      id: "EXP-202",
      category: "Manufacturing Equipment",
      vendor: "Industrial Machines Inc",
      date: "2025-03-28",
      amount: "$45,875.00",
      status: "Paid" as ExpenseStatus,
    },
    {
      id: "EXP-203",
      category: "Shipping",
      vendor: "FastFreight Logistics",
      date: "2025-04-10",
      amount: "$3,850.00",
      status: "Pending" as ExpenseStatus,
    },
    {
      id: "EXP-204",
      category: "Utilities",
      vendor: "Power & Water Corp",
      date: "2025-04-02",
      amount: "$7,250.00",
      status: "Paid" as ExpenseStatus,
    },
    {
      id: "EXP-205",
      category: "Factory Lease",
      vendor: "Industrial Properties LLC",
      date: "2025-04-01",
      amount: "$12,500.00",
      status: "Paid" as ExpenseStatus,
    },
    {
      id: "EXP-206",
      category: "Maintenance",
      vendor: "Factory Maintenance Services",
      date: "2025-04-08",
      amount: "$1,875.00",
      status: "Approved" as ExpenseStatus,
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
  ];

  const industryTransactions = [
    {
      id: "TRN-201",
      account: "Main Operating Account",
      date: "2025-04-12",
      description: "Payment from Blue Ocean Shipping",
      amount: "+$12,350.00",
      category: "Income",
      reconciled: true,
    },
    {
      id: "TRN-202",
      account: "Materials Procurement",
      date: "2025-04-10",
      description: "Steel Supply Co",
      amount: "-$28,750.00",
      category: "Raw Materials",
      reconciled: false,
    },
    {
      id: "TRN-203",
      account: "Main Operating Account",
      date: "2025-04-08",
      description: "Factory Maintenance",
      amount: "-$1,875.00",
      category: "Maintenance",
      reconciled: false,
    },
    {
      id: "TRN-204",
      account: "Payroll Account",
      date: "2025-04-05",
      description: "Bi-weekly Payroll",
      amount: "-$45,875.00",
      category: "Payroll",
      reconciled: true,
    },
    {
      id: "TRN-205",
      account: "Main Operating Account",
      date: "2025-04-02",
      description: "Power & Water Corp",
      amount: "-$7,250.00",
      category: "Utilities",
      reconciled: true,
    },
    {
      id: "TRN-206",
      account: "Main Operating Account",
      date: "2025-04-01",
      description: "Industrial Properties LLC",
      amount: "-$12,500.00",
      category: "Factory Lease",
      reconciled: true,
    },
  ];

  const industryInventory = [
    {
      id: "INV-201",
      name: "Industrial Generator",
      sku: "IND-GEN-201",
      quantity: 8,
      reorderPoint: 3,
      costPrice: "$4,250.00",
      sellPrice: "$6,799.99",
      category: "Equipment",
      status: "In Stock" as InventoryStatus,
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
      status: "In Stock" as InventoryStatus,
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
      status: "In Stock" as InventoryStatus,
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
      status: "In Stock" as InventoryStatus,
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
      status: "Low Stock" as InventoryStatus,
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
      status: "Out of Stock" as InventoryStatus,
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
      status: "Service Item" as InventoryStatus,
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
      logo: "https://via.placeholder.com/150?text=ABC",
      revenue: {
        current: 125000,
        percentChange: 8.5,
      },
      outstandingInvoices: {
        amount: 4750,
        percentChange: -2.3,
      },
      profitMargin: {
        value: 24.8,
        percentChange: 1.5,
      },
      activeCustomers: {
        count: 2,
        percentChange: 0,
      },
      customers: abcCustomers,
      invoices: abcInvoices,
      expenses: abcExpenses,
      accounts: abcAccounts,
      transactions: abcTransactions,
      inventory: abcInventory,
      projects: abcProjects,
    },
    {
      id: "xyz-limited",
      name: "XYZ Limited",
      industry: "IT Services",
      address: "456 Innovation Blvd, Austin, TX 78701",
      email: "hello@xyzlimited.com",
      phone: "(555) 987-6543",
      logo: "https://via.placeholder.com/150?text=XYZ",
      revenue: {
        current: 278500,
        percentChange: 12.7,
      },
      outstandingInvoices: {
        amount: 10150,
        percentChange: 5.2,
      },
      profitMargin: {
        value: 31.5,
        percentChange: 2.8,
      },
      activeCustomers: {
        count: 3,
        percentChange: 50.0,
      },
      customers: xyzCustomers,
      invoices: xyzInvoices,
      expenses: xyzExpenses,
      accounts: xyzAccounts,
      transactions: xyzTransactions,
      inventory: xyzInventory,
      projects: xyzProjects,
    },
    {
      id: "123-industries",
      name: "123 Industries",
      industry: "Manufacturing",
      address: "789 Factory Way, Detroit, MI 48201",
      email: "contact@123industries.com",
      phone: "(555) 456-7890",
      logo: "https://via.placeholder.com/150?text=123",
      revenue: {
        current: 875250,
        percentChange: 5.8,
      },
      outstandingInvoices: {
        amount: 53575,
        percentChange: -8.3,
      },
      profitMargin: {
        value: 18.2,
        percentChange: -1.7,
      },
      activeCustomers: {
        count: 3,
        percentChange: 0,
      },
      customers: industryCustomers,
      invoices: industryInvoices,
      expenses: industryExpenses,
      accounts: industryAccounts,
      transactions: industryTransactions,
      inventory: industryInventory,
      projects: industryProjects,
    },
  ];
};

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<Company[]>(generateCompanyData());
  const [currentCompany, setCurrentCompany] = useState<Company>(companies[0]);

  const addCompany = (companyData: Partial<Company>) => {
    const newCompany: Company = {
      id: `company-${Date.now()}`,
      name: companyData.name || "New Company",
      industry: companyData.industry || "Other",
      address: companyData.address || "",
      email: companyData.email || "",
      phone: companyData.phone || "",
      logo: companyData.logo || "https://via.placeholder.com/150?text=NEW",
      revenue: companyData.revenue || {
        current: 0,
        percentChange: 0,
      },
      outstandingInvoices: companyData.outstandingInvoices || {
        amount: 0,
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
        setCurrentCompany,
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
