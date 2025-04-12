
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

// Sample company data
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
        amount: "$2,700.00",
        status: "Outstanding"
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
      count: 3,
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
      }
    ],
    invoices: [
      {
        id: "INV-101",
        customer: "Sunrise Manufacturing",
        date: "2025-03-15",
        dueDate: "2025-03-30",
        amount: "$3,570.00",
        status: "Outstanding"
      },
      {
        id: "INV-102",
        customer: "Sunrise Manufacturing",
        date: "2025-03-28",
        dueDate: "2025-04-12",
        amount: "$2,180.00",
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
      count: 4,
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
        amount: "$8,900.00",
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
      }
    ],
    balance: "$67,450.00",
    revenue: {
      current: 52350,
      lastMonth: 47800,
      percentChange: 9.5
    },
    outstandingInvoices: {
      amount: 21400,
      count: 3,
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
