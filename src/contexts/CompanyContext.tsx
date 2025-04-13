
import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

// Define company data structure
export interface CompanyData {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
  logo?: string;
  fiscalYearStart: string;
  industry: string;
  customers: CustomerData[];
  invoices: InvoiceData[];
  expenses: ExpenseData[];
  balance: string;
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

// Define customer data structure
export interface CustomerData {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  openInvoices: number;
  balance: string;
  status: string;
}

// Define invoice data structure
export interface InvoiceData {
  id: string;
  customer: string;
  date: string;
  dueDate: string;
  amount: string;
  status: string;
}

// Define expense data structure
export interface ExpenseData {
  id: string;
  vendor: string;
  date: string;
  category: string;
  amount: string;
  status: string;
}

// Sample company data with more varied information
const companiesData: CompanyData[] = [
  {
    id: "comp-001",
    name: "ABC Corporation",
    address: "123 Main St, New York, NY 10001",
    phone: "(555) 987-6543",
    email: "info@abccorp.com",
    website: "https://abccorp.com",
    taxId: "12-3456789",
    fiscalYearStart: "January 1",
    industry: "Technology",
    customers: [
      { 
        id: "CUST-001", 
        name: "Global Tech", 
        contactName: "John Smith",
        email: "john@globaltech.com", 
        phone: "(555) 123-4567", 
        openInvoices: 2,
        balance: "$3,450.00",
        status: "Active" 
      },
      { 
        id: "CUST-002", 
        name: "Acme Inc", 
        contactName: "Jane Doe",
        email: "jane@acmeinc.com", 
        phone: "(555) 987-6543", 
        openInvoices: 1,
        balance: "$1,200.00",
        status: "Active" 
      },
      { 
        id: "CUST-003", 
        name: "Metro Services", 
        contactName: "Robert Johnson",
        email: "robert@metro.com", 
        phone: "(555) 456-7890", 
        openInvoices: 0,
        balance: "$0.00",
        status: "Active" 
      },
      { 
        id: "CUST-004", 
        name: "Innovative Solutions", 
        contactName: "Sarah Williams",
        email: "sarah@innovative.com", 
        phone: "(555) 222-3333", 
        openInvoices: 3,
        balance: "$5,820.00",
        status: "Active" 
      },
      { 
        id: "CUST-005", 
        name: "Digital Dynamics", 
        contactName: "Michael Brown",
        email: "michael@digitaldynamics.com", 
        phone: "(555) 444-5555", 
        openInvoices: 1,
        balance: "$1,750.00",
        status: "Active" 
      }
    ],
    invoices: [
      {
        id: "INV-001",
        customer: "Global Tech",
        date: "2025-04-01",
        dueDate: "2025-04-15",
        amount: "$1,250.00",
        status: "Paid"
      },
      {
        id: "INV-002",
        customer: "Acme Inc",
        date: "2025-04-05",
        dueDate: "2025-04-20",
        amount: "$1,200.00",
        status: "Outstanding"
      },
      {
        id: "INV-003",
        customer: "Global Tech",
        date: "2025-04-10",
        dueDate: "2025-04-25",
        amount: "$2,200.00",
        status: "Outstanding"
      },
      {
        id: "INV-004",
        customer: "Innovative Solutions",
        date: "2025-04-08",
        dueDate: "2025-04-22",
        amount: "$1,850.00",
        status: "Pending"
      },
      {
        id: "INV-005",
        customer: "Innovative Solutions",
        date: "2025-03-25",
        dueDate: "2025-04-09",
        amount: "$2,170.00",
        status: "Overdue"
      },
      {
        id: "INV-006",
        customer: "Innovative Solutions",
        date: "2025-03-15",
        dueDate: "2025-03-30",
        amount: "$1,800.00",
        status: "Paid"
      },
      {
        id: "INV-007",
        customer: "Digital Dynamics",
        date: "2025-04-12",
        dueDate: "2025-04-27",
        amount: "$1,750.00",
        status: "Pending"
      }
    ],
    expenses: [
      {
        id: "EXP-001",
        vendor: "Office Supplies Co",
        date: "2025-03-28",
        category: "Office Supplies",
        amount: "$345.00",
        status: "Paid"
      },
      {
        id: "EXP-002",
        vendor: "Cloud Services Ltd",
        date: "2025-04-01",
        category: "Software",
        amount: "$599.00",
        status: "Paid"
      },
      {
        id: "EXP-003",
        vendor: "City Electric",
        date: "2025-04-05",
        category: "Utilities",
        amount: "$425.00",
        status: "Paid"
      },
      {
        id: "EXP-004",
        vendor: "Developer Conference",
        date: "2025-04-10",
        category: "Professional Development",
        amount: "$850.00",
        status: "Pending"
      },
      {
        id: "EXP-005",
        vendor: "Marketing Agency",
        date: "2025-04-12",
        category: "Marketing",
        amount: "$1,200.00",
        status: "Pending"
      }
    ],
    balance: "$42,890.00",
    revenue: {
      current: 24328,
      lastMonth: 21623,
      percentChange: 12.5
    },
    outstandingInvoices: {
      amount: 8294,
      count: 5,
      percentChange: -2.3
    },
    profitMargin: {
      value: 32,
      percentChange: 4.1
    },
    activeCustomers: {
      count: 48,
      percentChange: 8.7
    }
  },
  {
    id: "comp-002",
    name: "XYZ Limited",
    address: "456 Broadway, San Francisco, CA 94107",
    phone: "(555) 234-5678",
    email: "info@xyzlimited.com",
    website: "https://xyzlimited.com",
    taxId: "98-7654321",
    fiscalYearStart: "July 1",
    industry: "Manufacturing",
    customers: [
      { 
        id: "CUST-101", 
        name: "Sunrise Manufacturing", 
        contactName: "Michael Chen",
        email: "michael@sunrise.com", 
        phone: "(555) 222-3333", 
        openInvoices: 3,
        balance: "$5,750.00",
        status: "Active" 
      },
      { 
        id: "CUST-102", 
        name: "Summit Industries", 
        contactName: "Lisa Wong",
        email: "lisa@summit.com", 
        phone: "(555) 444-5555", 
        openInvoices: 0,
        balance: "$0.00",
        status: "Active" 
      },
      { 
        id: "CUST-103", 
        name: "Coastal Distributors", 
        contactName: "David Kim",
        email: "david@coastal.com", 
        phone: "(555) 666-7777", 
        openInvoices: 1,
        balance: "$2,100.00",
        status: "Inactive" 
      },
      { 
        id: "CUST-104", 
        name: "Industrial Solutions", 
        contactName: "Jennifer Lee",
        email: "jennifer@industrial.com", 
        phone: "(555) 888-9999", 
        openInvoices: 2,
        balance: "$3,450.00",
        status: "Active" 
      },
      { 
        id: "CUST-105", 
        name: "Precision Engineering", 
        contactName: "Thomas Wang",
        email: "thomas@precision.com", 
        phone: "(555) 111-2222", 
        openInvoices: 1,
        balance: "$1,890.00",
        status: "Active" 
      },
      { 
        id: "CUST-106", 
        name: "Factory Outlet Corp", 
        contactName: "Angela Martinez",
        email: "angela@factoryoutlet.com", 
        phone: "(555) 333-4444", 
        openInvoices: 0,
        balance: "$0.00",
        status: "Inactive" 
      }
    ],
    invoices: [
      {
        id: "INV-101",
        customer: "Sunrise Manufacturing",
        date: "2025-03-15",
        dueDate: "2025-03-30",
        amount: "$2,250.00",
        status: "Paid"
      },
      {
        id: "INV-102",
        customer: "Sunrise Manufacturing",
        date: "2025-03-28",
        dueDate: "2025-04-12",
        amount: "$1,850.00",
        status: "Outstanding"
      },
      {
        id: "INV-103",
        customer: "Sunrise Manufacturing",
        date: "2025-04-10",
        dueDate: "2025-04-25",
        amount: "$1,650.00",
        status: "Pending"
      },
      {
        id: "INV-104",
        customer: "Coastal Distributors",
        date: "2025-04-05",
        dueDate: "2025-04-20",
        amount: "$2,100.00",
        status: "Outstanding"
      },
      {
        id: "INV-105",
        customer: "Industrial Solutions",
        date: "2025-03-25",
        dueDate: "2025-04-09",
        amount: "$1,750.00",
        status: "Paid"
      },
      {
        id: "INV-106",
        customer: "Industrial Solutions",
        date: "2025-04-12",
        dueDate: "2025-04-27",
        amount: "$1,700.00",
        status: "Pending"
      },
      {
        id: "INV-107",
        customer: "Precision Engineering",
        date: "2025-04-08",
        dueDate: "2025-04-23",
        amount: "$1,890.00",
        status: "Outstanding"
      }
    ],
    expenses: [
      {
        id: "EXP-101",
        vendor: "Material Suppliers Inc",
        date: "2025-03-10",
        category: "Raw Materials",
        amount: "$3,250.00",
        status: "Paid"
      },
      {
        id: "EXP-102",
        vendor: "Shipping Partners",
        date: "2025-03-25",
        category: "Logistics",
        amount: "$875.00",
        status: "Paid"
      },
      {
        id: "EXP-103",
        vendor: "Equipment Maintenance",
        date: "2025-04-02",
        category: "Maintenance",
        amount: "$1,250.00",
        status: "Paid"
      },
      {
        id: "EXP-104",
        vendor: "Factory Lease",
        date: "2025-04-01",
        category: "Rent",
        amount: "$4,500.00",
        status: "Paid"
      },
      {
        id: "EXP-105",
        vendor: "Staff Training",
        date: "2025-04-15",
        category: "Training",
        amount: "$780.00",
        status: "Pending"
      },
      {
        id: "EXP-106",
        vendor: "Quality Control Systems",
        date: "2025-04-10",
        category: "Equipment",
        amount: "$2,350.00",
        status: "Pending"
      }
    ],
    balance: "$35,620.00",
    revenue: {
      current: 18750,
      lastMonth: 16890,
      percentChange: 11.0
    },
    outstandingInvoices: {
      amount: 7850,
      count: 5,
      percentChange: 3.2
    },
    profitMargin: {
      value: 28,
      percentChange: -1.5
    },
    activeCustomers: {
      count: 32,
      percentChange: 6.2
    }
  },
  {
    id: "comp-003",
    name: "123 Industries",
    address: "789 Oak St, Chicago, IL 60601",
    phone: "(555) 876-5432",
    email: "info@123industries.com",
    website: "https://123industries.com",
    taxId: "45-6789012",
    fiscalYearStart: "April 1",
    industry: "Construction",
    customers: [
      { 
        id: "CUST-201", 
        name: "Urban Development Corp", 
        contactName: "Sarah Johnson",
        email: "sarah@urbandevelopment.com", 
        phone: "(555) 888-9999", 
        openInvoices: 1,
        balance: "$12,500.00",
        status: "Active" 
      },
      { 
        id: "CUST-202", 
        name: "Skyline Properties", 
        contactName: "James Wilson",
        email: "james@skyline.com", 
        phone: "(555) 111-2222", 
        openInvoices: 0,
        balance: "$0.00",
        status: "Active" 
      },
      { 
        id: "CUST-203", 
        name: "Landmark Construction", 
        contactName: "Emma Thompson",
        email: "emma@landmark.com", 
        phone: "(555) 333-4444", 
        openInvoices: 2,
        balance: "$8,900.00",
        status: "Active" 
      },
      { 
        id: "CUST-204", 
        name: "Metropolitan Builders", 
        contactName: "Daniel Garcia",
        email: "daniel@metropolitan.com", 
        phone: "(555) 555-6666", 
        openInvoices: 1,
        balance: "$5,600.00",
        status: "Active" 
      },
      { 
        id: "CUST-205", 
        name: "City Planning Commission", 
        contactName: "Rachel Cohen",
        email: "rachel@cityplanning.com", 
        phone: "(555) 777-8888", 
        openInvoices: 3,
        balance: "$15,750.00",
        status: "Active" 
      },
      { 
        id: "CUST-206", 
        name: "Riverside Developments", 
        contactName: "Christopher Robinson",
        email: "chris@riverside.com", 
        phone: "(555) 999-0000", 
        openInvoices: 0,
        balance: "$0.00",
        status: "Inactive" 
      },
      { 
        id: "CUST-207", 
        name: "Heritage Restoration", 
        contactName: "Amanda Taylor",
        email: "amanda@heritage.com", 
        phone: "(555) 222-3333", 
        openInvoices: 2,
        balance: "$7,350.00",
        status: "Active" 
      }
    ],
    invoices: [
      {
        id: "INV-201",
        customer: "Urban Development Corp",
        date: "2025-03-20",
        dueDate: "2025-04-20",
        amount: "$12,500.00",
        status: "Outstanding"
      },
      {
        id: "INV-202",
        customer: "Landmark Construction",
        date: "2025-04-02",
        dueDate: "2025-05-02",
        amount: "$5,750.00",
        status: "Pending"
      },
      {
        id: "INV-203",
        customer: "Landmark Construction",
        date: "2025-03-15",
        dueDate: "2025-04-15",
        amount: "$3,150.00",
        status: "Paid"
      },
      {
        id: "INV-204",
        customer: "Metropolitan Builders",
        date: "2025-04-05",
        dueDate: "2025-05-05",
        amount: "$5,600.00",
        status: "Outstanding"
      },
      {
        id: "INV-205",
        customer: "City Planning Commission",
        date: "2025-03-25",
        dueDate: "2025-04-25",
        amount: "$8,250.00",
        status: "Paid"
      },
      {
        id: "INV-206",
        customer: "City Planning Commission",
        date: "2025-04-10",
        dueDate: "2025-05-10",
        amount: "$4,300.00",
        status: "Pending"
      },
      {
        id: "INV-207",
        customer: "City Planning Commission",
        date: "2025-04-15",
        dueDate: "2025-05-15",
        amount: "$3,200.00",
        status: "Pending"
      },
      {
        id: "INV-208",
        customer: "Heritage Restoration",
        date: "2025-03-28",
        dueDate: "2025-04-28",
        amount: "$4,150.00",
        status: "Overdue"
      },
      {
        id: "INV-209",
        customer: "Heritage Restoration",
        date: "2025-04-12",
        dueDate: "2025-05-12",
        amount: "$3,200.00",
        status: "Outstanding"
      }
    ],
    expenses: [
      {
        id: "EXP-201",
        vendor: "Building Materials Co",
        date: "2025-03-15",
        category: "Materials",
        amount: "$7,850.00",
        status: "Paid"
      },
      {
        id: "EXP-202",
        vendor: "Heavy Equipment Rentals",
        date: "2025-03-22",
        category: "Equipment",
        amount: "$3,200.00",
        status: "Paid"
      },
      {
        id: "EXP-203",
        vendor: "Construction Permits",
        date: "2025-03-28",
        category: "Permits",
        amount: "$1,500.00",
        status: "Paid"
      },
      {
        id: "EXP-204",
        vendor: "Site Security",
        date: "2025-04-01",
        category: "Security",
        amount: "$2,800.00",
        status: "Paid"
      },
      {
        id: "EXP-205",
        vendor: "Subcontractor - Electrical",
        date: "2025-04-05",
        category: "Subcontractors",
        amount: "$4,750.00",
        status: "Paid"
      },
      {
        id: "EXP-206",
        vendor: "Subcontractor - Plumbing",
        date: "2025-04-10",
        category: "Subcontractors",
        amount: "$3,850.00",
        status: "Pending"
      },
      {
        id: "EXP-207",
        vendor: "Worker's Compensation Insurance",
        date: "2025-04-15",
        category: "Insurance",
        amount: "$2,150.00",
        status: "Pending"
      }
    ],
    balance: "$67,450.00",
    revenue: {
      current: 52350,
      lastMonth: 47800,
      percentChange: 9.5
    },
    outstandingInvoices: {
      amount: 28950,
      count: 6,
      percentChange: 15.8
    },
    profitMargin: {
      value: 24,
      percentChange: 2.0
    },
    activeCustomers: {
      count: 25,
      percentChange: 4.0
    }
  },
  {
    id: "comp-004",
    name: "Horizon Healthcare",
    address: "567 Sunset Blvd, Los Angeles, CA 90028",
    phone: "(555) 789-0123",
    email: "contact@horizonhealth.com",
    website: "https://horizonhealthcare.com",
    taxId: "56-7890123",
    fiscalYearStart: "October 1",
    industry: "Healthcare",
    customers: [
      { 
        id: "CUST-301", 
        name: "General Hospital", 
        contactName: "Elizabeth Moore",
        email: "elizabeth@generalhospital.com", 
        phone: "(555) 444-3333", 
        openInvoices: 3,
        balance: "$18,450.00",
        status: "Active" 
      },
      { 
        id: "CUST-302", 
        name: "Westside Medical Center", 
        contactName: "Richard Taylor",
        email: "richard@westside.com", 
        phone: "(555) 222-1111", 
        openInvoices: 2,
        balance: "$9,750.00",
        status: "Active" 
      },
      { 
        id: "CUST-303", 
        name: "Community Health Network", 
        contactName: "Sophia Rodriguez",
        email: "sophia@communityhealth.com", 
        phone: "(555) 888-7777", 
        openInvoices: 1,
        balance: "$5,200.00",
        status: "Active" 
      },
      { 
        id: "CUST-304", 
        name: "Silver Springs Rehabilitation", 
        contactName: "William Chen",
        email: "william@silversprings.com", 
        phone: "(555) 666-5555", 
        openInvoices: 0,
        balance: "$0.00",
        status: "Inactive" 
      },
      { 
        id: "CUST-305", 
        name: "Children's Care Clinic", 
        contactName: "Olivia Johnson",
        email: "olivia@childrenscare.com", 
        phone: "(555) 999-8888", 
        openInvoices: 2,
        balance: "$7,250.00",
        status: "Active" 
      }
    ],
    invoices: [
      {
        id: "INV-301",
        customer: "General Hospital",
        date: "2025-03-18",
        dueDate: "2025-04-17",
        amount: "$7,850.00",
        status: "Paid"
      },
      {
        id: "INV-302",
        customer: "General Hospital",
        date: "2025-04-01",
        dueDate: "2025-05-01",
        amount: "$6,200.00",
        status: "Outstanding"
      },
      {
        id: "INV-303",
        customer: "General Hospital",
        date: "2025-04-15",
        dueDate: "2025-05-15",
        amount: "$4,400.00",
        status: "Pending"
      },
      {
        id: "INV-304",
        customer: "Westside Medical Center",
        date: "2025-03-25",
        dueDate: "2025-04-24",
        amount: "$5,750.00",
        status: "Paid"
      },
      {
        id: "INV-305",
        customer: "Westside Medical Center",
        date: "2025-04-10",
        dueDate: "2025-05-10",
        amount: "$4,000.00",
        status: "Outstanding"
      },
      {
        id: "INV-306",
        customer: "Community Health Network",
        date: "2025-04-05",
        dueDate: "2025-05-05",
        amount: "$5,200.00",
        status: "Outstanding"
      },
      {
        id: "INV-307",
        customer: "Children's Care Clinic",
        date: "2025-03-28",
        dueDate: "2025-04-27",
        amount: "$3,500.00",
        status: "Overdue"
      },
      {
        id: "INV-308",
        customer: "Children's Care Clinic",
        date: "2025-04-12",
        dueDate: "2025-05-12",
        amount: "$3,750.00",
        status: "Pending"
      }
    ],
    expenses: [
      {
        id: "EXP-301",
        vendor: "Medical Supplies Inc",
        date: "2025-03-10",
        category: "Medical Supplies",
        amount: "$5,450.00",
        status: "Paid"
      },
      {
        id: "EXP-302",
        vendor: "Laboratory Equipment Co",
        date: "2025-03-22",
        category: "Equipment",
        amount: "$8,750.00",
        status: "Paid"
      },
      {
        id: "EXP-303",
        vendor: "Healthcare Software Solutions",
        date: "2025-04-01",
        category: "Software",
        amount: "$3,200.00",
        status: "Paid"
      },
      {
        id: "EXP-304",
        vendor: "Professional Liability Insurance",
        date: "2025-04-05",
        category: "Insurance",
        amount: "$4,500.00",
        status: "Paid"
      },
      {
        id: "EXP-305",
        vendor: "Medical Conference",
        date: "2025-04-15",
        category: "Professional Development",
        amount: "$2,750.00",
        status: "Pending"
      },
      {
        id: "EXP-306",
        vendor: "Pharmaceutical Supplies",
        date: "2025-04-10",
        category: "Pharmaceuticals",
        amount: "$6,850.00",
        status: "Pending"
      }
    ],
    balance: "$75,250.00",
    revenue: {
      current: 42850,
      lastMonth: 37500,
      percentChange: 14.3
    },
    outstandingInvoices: {
      amount: 23350,
      count: 6,
      percentChange: 8.7
    },
    profitMargin: {
      value: 35,
      percentChange: 3.5
    },
    activeCustomers: {
      count: 18,
      percentChange: 5.9
    }
  },
  {
    id: "comp-005",
    name: "Green Earth Organics",
    address: "890 Garden Lane, Portland, OR 97205",
    phone: "(555) 345-6789",
    email: "hello@greenearthorganics.com",
    website: "https://greenearthorganics.com",
    taxId: "78-9012345",
    fiscalYearStart: "March 1",
    industry: "Agriculture",
    customers: [
      { 
        id: "CUST-401", 
        name: "Fresh Market Stores", 
        contactName: "Benjamin Wilson",
        email: "benjamin@freshmarket.com", 
        phone: "(555) 111-9999", 
        openInvoices: 2,
        balance: "$8,750.00",
        status: "Active" 
      },
      { 
        id: "CUST-402", 
        name: "Organic Restaurants Group", 
        contactName: "Isabella Martinez",
        email: "isabella@organicrestaurants.com", 
        phone: "(555) 777-2222", 
        openInvoices: 3,
        balance: "$6,450.00",
        status: "Active" 
      },
      { 
        id: "CUST-403", 
        name: "Healthy Living Co-op", 
        contactName: "Nathan Brown",
        email: "nathan@healthyliving.com", 
        phone: "(555) 333-4444", 
        openInvoices: 1,
        balance: "$3,200.00",
        status: "Active" 
      },
      { 
        id: "CUST-404", 
        name: "Farm-to-Table Delivery", 
        contactName: "Grace Thompson",
        email: "grace@farmtotable.com", 
        phone: "(555) 555-8888", 
        openInvoices: 0,
        balance: "$0.00",
        status: "Active" 
      },
      { 
        id: "CUST-405", 
        name: "Green Schools Initiative", 
        contactName: "Lucas Davis",
        email: "lucas@greenschools.com", 
        phone: "(555) 444-7777", 
        openInvoices: 1,
        balance: "$2,850.00",
        status: "Active" 
      }
    ],
    invoices: [
      {
        id: "INV-401",
        customer: "Fresh Market Stores",
        date: "2025-03-15",
        dueDate: "2025-04-14",
        amount: "$4,250.00",
        status: "Paid"
      },
      {
        id: "INV-402",
        customer: "Fresh Market Stores",
        date: "2025-04-01",
        dueDate: "2025-05-01",
        amount: "$5,500.00",
        status: "Outstanding"
      },
      {
        id: "INV-403",
        customer: "Fresh Market Stores",
        date: "2025-04-15",
        dueDate: "2025-05-15",
        amount: "$3,250.00",
        status: "Pending"
      },
      {
        id: "INV-404",
        customer: "Organic Restaurants Group",
        date: "2025-03-20",
        dueDate: "2025-04-19",
        amount: "$2,200.00",
        status: "Paid"
      },
      {
        id: "INV-405",
        customer: "Organic Restaurants Group",
        date: "2025-04-05",
        dueDate: "2025-05-05",
        amount: "$2,850.00",
        status: "Outstanding"
      },
      {
        id: "INV-406",
        customer: "Organic Restaurants Group",
        date: "2025-04-12",
        dueDate: "2025-05-12",
        amount: "$1,400.00",
        status: "Outstanding"
      },
      {
        id: "INV-407",
        customer: "Healthy Living Co-op",
        date: "2025-04-08",
        dueDate: "2025-05-08",
        amount: "$3,200.00",
        status: "Outstanding"
      },
      {
        id: "INV-408",
        customer: "Green Schools Initiative",
        date: "2025-04-10",
        dueDate: "2025-05-10",
        amount: "$2,850.00",
        status: "Pending"
      }
    ],
    expenses: [
      {
        id: "EXP-401",
        vendor: "Organic Seeds Supplier",
        date: "2025-03-05",
        category: "Seeds & Plants",
        amount: "$3,750.00",
        status: "Paid"
      },
      {
        id: "EXP-402",
        vendor: "Eco-Friendly Packaging",
        date: "2025-03-15",
        category: "Packaging",
        amount: "$2,200.00",
        status: "Paid"
      },
      {
        id: "EXP-403",
        vendor: "Farm Equipment Rental",
        date: "2025-03-25",
        category: "Equipment",
        amount: "$1,850.00",
        status: "Paid"
      },
      {
        id: "EXP-404",
        vendor: "Organic Certification Agency",
        date: "2025-04-01",
        category: "Certification",
        amount: "$3,500.00",
        status: "Paid"
      },
      {
        id: "EXP-405",
        vendor: "Irrigation Systems",
        date: "2025-04-08",
        category: "Infrastructure",
        amount: "$4,250.00",
        status: "Pending"
      },
      {
        id: "EXP-406",
        vendor: "Natural Pest Control",
        date: "2025-04-15",
        category: "Crop Management",
        amount: "$1,750.00",
        status: "Pending"
      }
    ],
    balance: "$32,750.00",
    revenue: {
      current: 28350,
      lastMonth: 25800,
      percentChange: 9.9
    },
    outstandingInvoices: {
      amount: 19050,
      count: 7,
      percentChange: 12.4
    },
    profitMargin: {
      value: 29,
      percentChange: 1.2
    },
    activeCustomers: {
      count: 22,
      percentChange: 10.0
    }
  }
];

// Create context type
interface CompanyContextType {
  companies: CompanyData[];
  currentCompany: CompanyData;
  switchCompany: (companyId: string) => void;
  addCompany: (company: Omit<CompanyData, "id">) => void;
  updateCompany: (companyId: string, data: Partial<CompanyData>) => void;
}

// Create the context
const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Create provider component
export const CompanyProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [companies, setCompanies] = useState<CompanyData[]>(companiesData);
  const [currentCompanyId, setCurrentCompanyId] = useState<string>(companies[0].id);

  // Get current company data
  const currentCompany = companies.find(company => company.id === currentCompanyId) || companies[0];

  // Switch to another company
  const switchCompany = (companyId: string) => {
    if (companies.some(company => company.id === companyId)) {
      setCurrentCompanyId(companyId);
      toast.success(`Switched to ${companies.find(company => company.id === companyId)?.name}`);
    } else {
      toast.error("Company not found");
    }
  };

  // Add a new company
  const addCompany = (company: Omit<CompanyData, "id">) => {
    const newCompany: CompanyData = {
      ...company,
      id: `comp-${Date.now()}` // Generate a unique ID
    };
    
    setCompanies(prev => [...prev, newCompany]);
    toast.success(`Added company: ${company.name}`);
  };

  // Update company data
  const updateCompany = (companyId: string, data: Partial<CompanyData>) => {
    setCompanies(prev => 
      prev.map(company => 
        company.id === companyId ? { ...company, ...data } : company
      )
    );
    
    if (companyId === currentCompanyId) {
      toast.success("Company information updated");
    }
  };

  return (
    <CompanyContext.Provider 
      value={{ 
        companies, 
        currentCompany, 
        switchCompany,
        addCompany,
        updateCompany
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

// Create hook for using the company context
export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
};
