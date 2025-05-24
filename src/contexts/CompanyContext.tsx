import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '@/services/localStorageService';
import { Company, TaxRate, Account, Transaction, Invoice, Expense, Estimate, Budget, BankAccount, TimeEntry, Project, ProjectDocument, Customer, Employee, Sale } from '@/types/company';
import { CompanyContextType } from '@/types/context';

// Create the context with default values
const CompanyContext = createContext<CompanyContextType>({
  currentCompany: {
    id: '',
    name: '',
    transactions: [],
    accounts: [],
    taxRates: [],
    bankAccounts: []
  },
  companies: [],
  updateCompany: () => {},
  switchCompany: () => {},
  addCompany: () => {},
  updateTaxRate: () => {},
  addTaxRate: () => {},
  deleteTaxRate: () => {},
  updateAccount: () => {},
  addAccount: () => {},
  deleteAccount: () => {},
  addExpense: () => {},
  updateExpense: () => {},
  deleteExpense: () => {},
  addInvoice: () => {},
  updateInvoice: () => {},
  deleteInvoice: () => {},
  addEstimate: () => {},
  updateEstimate: () => {},
  deleteEstimate: () => {},
  updateBudget: () => {},
  addBudget: () => {},
  deleteBudget: () => {},
  processPayroll: () => {},
  updateTransaction: () => {},
  addTransaction: () => {},
  deleteTransaction: () => {},
  addBankAccount: () => {},
  updateBankAccount: () => {},
  deleteBankAccount: () => {},
  addTimeEntry: () => {},
  updateTimeEntry: () => {},
  deleteTimeEntry: () => {},
  addSale: () => {},
  updateSale: () => {},
  deleteSale: () => {},
});

interface CompanyProviderProps {
  children: ReactNode;
}

// Demo data generator - Enhanced with more comprehensive data
const generateDemoData = (): Company => {
  const currentDate = new Date();
  const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
  const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());

  return {
    id: `company-${Date.now()}`,
    name: 'Acme Corporation',
    address: '123 Business St, Suite 100, Business City, BC 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@acmecorp.com',
    website: 'www.acmecorp.com',
    taxId: '12-3456789',
    industry: 'Technology Services',
    fiscalYearStart: 'January 1',
    
    // Enhanced demo customers
    customers: [
      {
        id: 'cust-1',
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1 (555) 234-5678',
        address: '456 Customer Ave',
        company: 'Smith Enterprises',
        contactName: 'John Smith',
        type: 'Business',
        status: 'Active',
        city: 'Customer City',
        state: 'CC',
        postalCode: '54321',
        country: 'USA'
      },
      {
        id: 'cust-2',
        name: 'Sarah Johnson',
        email: 'sarah@techstart.com',
        phone: '+1 (555) 345-6789',
        address: '789 Tech Blvd',
        company: 'TechStart Inc',
        contactName: 'Sarah Johnson',
        type: 'Business',
        status: 'Active',
        city: 'Tech City',
        state: 'TC',
        postalCode: '67890',
        country: 'USA'
      },
      {
        id: 'cust-3',
        name: 'Mike Wilson',
        email: 'mike.wilson@retail.com',
        phone: '+1 (555) 456-7890',
        address: '321 Retail Road',
        company: 'Wilson Retail',
        contactName: 'Mike Wilson',
        type: 'Business',
        status: 'Active',
        city: 'Retail Town',
        state: 'RT',
        postalCode: '13579',
        country: 'USA'
      },
      {
        id: 'cust-4',
        name: 'Lisa Chen',
        email: 'lisa@globalcorp.com',
        phone: '+1 (555) 567-8901',
        address: '654 Corporate Dr',
        company: 'Global Corp',
        contactName: 'Lisa Chen',
        type: 'Business',
        status: 'Active',
        city: 'Metro City',
        state: 'MC',
        postalCode: '24680',
        country: 'USA'
      }
    ],

    // Enhanced demo invoices
    invoices: [
      {
        id: 'INV-001',
        customer: 'Smith Enterprises',
        date: '2025-05-15',
        dueDate: '2025-06-15',
        status: 'Paid',
        total: 2500.00,
        amount: '$2,500.00',
        items: [
          { id: 'item-1', description: 'Web Development Services', quantity: 40, price: 50, total: 2000 },
          { id: 'item-2', description: 'Domain Setup', quantity: 1, price: 500, total: 500 }
        ]
      },
      {
        id: 'INV-002',
        customer: 'TechStart Inc',
        date: '2025-05-20',
        dueDate: '2025-06-20',
        status: 'Pending',
        total: 1800.00,
        amount: '$1,800.00',
        items: [
          { id: 'item-3', description: 'Software Consulting', quantity: 20, price: 75, total: 1500 },
          { id: 'item-4', description: 'Technical Documentation', quantity: 6, price: 50, total: 300 }
        ]
      },
      {
        id: 'INV-003',
        customer: 'Wilson Retail',
        date: '2025-05-22',
        dueDate: '2025-06-22',
        status: 'Overdue',
        total: 3200.00,
        amount: '$3,200.00',
        items: [
          { id: 'item-5', description: 'E-commerce Platform', quantity: 1, price: 2500, total: 2500 },
          { id: 'item-6', description: 'Payment Integration', quantity: 1, price: 700, total: 700 }
        ]
      },
      {
        id: 'INV-004',
        customer: 'Global Corp',
        date: '2025-05-24',
        dueDate: '2025-06-24',
        status: 'Draft',
        total: 4500.00,
        amount: '$4,500.00',
        items: [
          { id: 'item-7', description: 'Enterprise Solution', quantity: 60, price: 75, total: 4500 }
        ]
      }
    ],

    // Enhanced demo expenses
    expenses: [
      {
        id: 'exp-1',
        date: '2025-05-10',
        vendor: 'Office Supplies Co',
        category: 'Office Supplies',
        amount: 250.00,
        description: 'Monthly office supplies purchase',
        status: 'Paid',
        paymentMethod: 'Credit Card'
      },
      {
        id: 'exp-2',
        date: '2025-05-12',
        vendor: 'CloudHost Services',
        category: 'Software & Subscriptions',
        amount: 150.00,
        description: 'Monthly hosting fees',
        status: 'Paid',
        paymentMethod: 'ACH'
      },
      {
        id: 'exp-3',
        date: '2025-05-18',
        vendor: 'Business Travel Inc',
        category: 'Travel',
        amount: 800.00,
        description: 'Client meeting travel expenses',
        status: 'Pending',
        paymentMethod: 'Company Card'
      },
      {
        id: 'exp-4',
        date: '2025-05-20',
        vendor: 'Marketing Agency',
        category: 'Marketing',
        amount: 2000.00,
        description: 'Q2 marketing campaign',
        status: 'Approved',
        paymentMethod: 'Wire Transfer'
      },
      {
        id: 'exp-5',
        date: '2025-05-22',
        vendor: 'Legal Services LLC',
        category: 'Professional Services',
        amount: 1500.00,
        description: 'Contract review and legal consultation',
        status: 'Paid',
        paymentMethod: 'Check'
      }
    ],

    // Enhanced demo employees
    employees: [
      {
        id: 'emp-1',
        name: 'Alice Johnson',
        position: 'Senior Developer',
        salary: 85000,
        hireDate: '2023-01-15',
        status: 'Active',
        payRate: 40.87,
        payType: 'Hourly'
      },
      {
        id: 'emp-2',
        name: 'Bob Chen',
        position: 'Project Manager',
        salary: 75000,
        hireDate: '2023-03-01',
        status: 'Active',
        payRate: 36.06,
        payType: 'Hourly'
      },
      {
        id: 'emp-3',
        name: 'Carol Davis',
        position: 'UX Designer',
        salary: 65000,
        hireDate: '2023-06-15',
        status: 'Active',
        payRate: 31.25,
        payType: 'Hourly'
      },
      {
        id: 'emp-4',
        name: 'David Brown',
        position: 'Marketing Specialist',
        salary: 55000,
        hireDate: '2023-09-01',
        status: 'Active',
        payRate: 26.44,
        payType: 'Hourly'
      },
      {
        id: 'emp-5',
        name: 'Emma Wilson',
        position: 'Accountant',
        salary: 60000,
        hireDate: '2024-01-15',
        status: 'Active',
        payRate: 28.85,
        payType: 'Hourly'
      }
    ],

    // Enhanced demo projects
    projects: [
      {
        id: 'proj-1',
        name: 'E-commerce Website',
        client: 'Smith Enterprises',
        status: 'In Progress',
        startDate: '2025-04-01',
        endDate: '2025-07-01',
        budget: 15000,
        tracked: '120 hours',
        billed: true,
        spent: 8500,
        progress: 65,
        team: ['Alice Johnson', 'Carol Davis'],
        documents: [
          {
            id: 'doc-1',
            name: 'Project Requirements.pdf',
            type: 'PDF',
            size: '2.4 MB',
            uploadDate: '2025-04-01',
            uploadedBy: 'Bob Chen'
          }
        ]
      },
      {
        id: 'proj-2',
        name: 'Mobile App Development',
        client: 'TechStart Inc',
        status: 'Planning',
        startDate: '2025-06-01',
        endDate: '2025-12-01',
        budget: 25000,
        tracked: '0 hours',
        billed: false,
        spent: 0,
        progress: 10,
        team: ['Alice Johnson', 'Bob Chen'],
        documents: []
      }
    ],

    // Enhanced demo time entries
    timeEntries: [
      {
        id: 'time-1',
        employeeId: 'emp-1',
        projectId: 'proj-1',
        date: '2025-05-20',
        hours: 8,
        description: 'Frontend development work',
        billable: true,
        startTime: '09:00',
        endTime: '17:00',
        status: 'Approved'
      },
      {
        id: 'time-2',
        employeeId: 'emp-2',
        projectId: 'proj-1',
        date: '2025-05-20',
        hours: 6,
        description: 'Project planning and client meetings',
        billable: true,
        startTime: '10:00',
        endTime: '16:00',
        status: 'Approved'
      },
      {
        id: 'time-3',
        employeeId: 'emp-3',
        projectId: 'proj-1',
        date: '2025-05-21',
        hours: 7,
        description: 'UI/UX design and prototyping',
        billable: true,
        startTime: '09:30',
        endTime: '16:30',
        status: 'Pending'
      }
    ],

    // Enhanced demo sales
    sales: [
      {
        id: 'sale-1',
        date: '2025-05-15',
        customer: 'Smith Enterprises',
        amount: 2500.00,
        status: 'Completed',
        items: [
          { description: 'Web Development Package', quantity: 1, price: 2500, total: 2500 }
        ]
      },
      {
        id: 'sale-2',
        date: '2025-05-20',
        customer: 'TechStart Inc',
        amount: 1800.00,
        status: 'Pending',
        items: [
          { description: 'Consulting Services', quantity: 24, price: 75, total: 1800 }
        ]
      }
    ],

    // Enhanced demo accounts
    accounts: [
      {
        id: 'acc-1',
        number: '1000',
        name: 'Cash',
        type: 'Asset',
        balance: 25000,
        description: 'Primary cash account'
      },
      {
        id: 'acc-2',
        number: '1200',
        name: 'Accounts Receivable',
        type: 'Asset',
        balance: 8500,
        description: 'Money owed by customers'
      },
      {
        id: 'acc-3',
        number: '2000',
        name: 'Accounts Payable',
        type: 'Liability',
        balance: 3200,
        description: 'Money owed to vendors'
      },
      {
        id: 'acc-4',
        name: 'Revenue',
        number: '4000',
        type: 'Income',
        balance: 45000,
        description: 'Service revenue'
      }
    ],

    // Enhanced demo bank accounts with more transactions
    bankAccounts: [
      {
        id: 'bank-1',
        name: 'Business Checking',
        type: 'Checking',
        balance: 45750,
        lastTransaction: '2025-05-24',
        transactions: [
          {
            id: 'trans-1',
            date: '2025-05-24',
            description: 'Customer Payment - INV-001',
            amount: '+$2,500.00',
            category: 'Income',
            account: 'Business Checking',
            reconciled: true,
            type: 'Deposit'
          },
          {
            id: 'trans-2',
            date: '2025-05-23',
            description: 'Office Rent',
            amount: '-$1,200.00',
            category: 'Rent',
            account: 'Business Checking',
            reconciled: true,
            type: 'Withdrawal'
          },
          {
            id: 'trans-3',
            date: '2025-05-22',
            description: 'Software Subscription',
            amount: '-$150.00',
            category: 'Software',
            account: 'Business Checking',
            reconciled: false,
            type: 'Withdrawal'
          },
          {
            id: 'trans-4',
            date: '2025-05-21',
            description: 'Marketing Campaign Payment',
            amount: '-$2,000.00',
            category: 'Marketing',
            account: 'Business Checking',
            reconciled: true,
            type: 'Withdrawal'
          },
          {
            id: 'trans-5',
            date: '2025-05-20',
            description: 'Customer Payment - INV-002',
            amount: '+$1,800.00',
            category: 'Income',
            account: 'Business Checking',
            reconciled: true,
            type: 'Deposit'
          }
        ]
      },
      {
        id: 'bank-2',
        name: 'Business Savings',
        type: 'Savings',
        balance: 75000,
        lastTransaction: '2025-05-15',
        transactions: [
          {
            id: 'trans-6',
            date: '2025-05-15',
            description: 'Interest Payment',
            amount: '+$125.50',
            category: 'Interest',
            account: 'Business Savings',
            reconciled: true,
            type: 'Deposit'
          },
          {
            id: 'trans-7',
            date: '2025-05-01',
            description: 'Emergency Fund Transfer',
            amount: '+$10,000.00',
            category: 'Transfer',
            account: 'Business Savings',
            reconciled: true,
            type: 'Deposit'
          }
        ]
      },
      {
        id: 'bank-3',
        name: 'Payroll Account',
        type: 'Checking',
        balance: 25000,
        lastTransaction: '2025-05-15',
        transactions: [
          {
            id: 'trans-8',
            date: '2025-05-15',
            description: 'Payroll Processing',
            amount: '-$8,500.00',
            category: 'Payroll',
            account: 'Payroll Account',
            reconciled: true,
            type: 'Withdrawal'
          },
          {
            id: 'trans-9',
            date: '2025-05-01',
            description: 'Payroll Funding',
            amount: '+$15,000.00',
            category: 'Transfer',
            account: 'Payroll Account',
            reconciled: true,
            type: 'Deposit'
          }
        ]
      }
    ],

    // Enhanced demo tax rates
    taxRates: [
      {
        id: 'tax-1',
        name: 'Sales Tax',
        rate: 8.25,
        isDefault: true,
        description: 'Standard sales tax rate',
        category: 'Sales'
      },
      {
        id: 'tax-2',
        name: 'Service Tax',
        rate: 6.0,
        isDefault: false,
        description: 'Tax rate for services',
        category: 'Service'
      }
    ],

    // Enhanced demo budgets
    budgets: [
      {
        id: 'budget-1',
        name: 'Q2 2025 Budget',
        period: 'Quarterly',
        startDate: '2025-04-01',
        endDate: '2025-06-30',
        status: 'Active',
        categories: [
          {
            id: 'cat-1',
            name: 'Revenue',
            type: 'income',
            budgeted: 50000,
            actual: 35000
          },
          {
            id: 'cat-2',
            name: 'Operating Expenses',
            type: 'expense',
            budgeted: 15000,
            actual: 12500
          },
          {
            id: 'cat-3',
            name: 'Marketing',
            type: 'expense',
            budgeted: 5000,
            actual: 3200
          }
        ]
      }
    ],

    // Enhanced demo estimates
    estimates: [
      {
        id: 'EST-001',
        customer: 'Wilson Retail',
        date: '2025-05-10',
        expiryDate: '2025-06-10',
        status: 'Pending',
        total: 15000,
        estimateNumber: 'EST-001',
        notes: 'Comprehensive e-commerce solution',
        items: [
          { id: 'est-item-1', description: 'E-commerce Platform Setup', quantity: 1, price: 8000, total: 8000 },
          { id: 'est-item-2', description: 'Custom Features Development', quantity: 80, price: 75, total: 6000 },
          { id: 'est-item-3', description: 'Testing & Deployment', quantity: 1, price: 1000, total: 1000 }
        ]
      }
    ],

    // Enhanced demo inventory
    inventory: {
      items: [
        {
          id: 'inv-1',
          name: 'Software License - Pro',
          sku: 'SW-PRO-001',
          quantity: 50,
          price: 199.99,
          cost: 120.00,
          category: 'Software',
          location: 'Digital'
        },
        {
          id: 'inv-2',
          name: 'Consulting Hours',
          sku: 'CONS-HR-001',
          quantity: 1000,
          price: 75.00,
          cost: 45.00,
          category: 'Services',
          location: 'Virtual'
        }
      ],
      categories: ['Software', 'Services', 'Hardware'],
      locations: ['Digital', 'Virtual', 'Office'],
      bundles: [],
      serialNumbers: [],
      lotTracking: []
    },

    // Enhanced demo payroll data
    payrollData: {
      payPeriods: [
        {
          id: 'pp-1',
          startDate: '2025-05-01',
          endDate: '2025-05-15',
          status: 'Processed',
          totalPaid: 8500,
          payDate: '2025-05-20',
          totalGross: 10000,
          totalNet: 8500,
          totalTaxes: 1200,
          totalDeductions: 300
        }
      ]
    },

    // Enhanced demo transactions (general ledger)
    transactions: [
      {
        id: 'gl-trans-1',
        date: '2025-05-22',
        description: 'Customer Payment Received',
        amount: '+$2,500.00',
        category: 'Revenue',
        account: 'Accounts Receivable',
        reconciled: true,
        type: 'Credit'
      },
      {
        id: 'gl-trans-2',
        date: '2025-05-21',
        description: 'Office Rent Payment',
        amount: '-$1,200.00',
        category: 'Rent Expense',
        account: 'Cash',
        reconciled: true,
        type: 'Debit'
      }
    ],

    // Enhanced demo performance metrics
    revenue: { current: 85000, previous: 72000, percentChange: 18.1 },
    profitMargin: { value: 28.5, trend: 3.2, percentChange: 12.7 },
    outstandingInvoices: { amount: 8500, percentChange: -15.2 },
    activeCustomers: { count: 24, percentChange: 33.3 },

    // New advanced features with demo data
    leads: [
      {
        id: 'lead-1',
        name: 'Jennifer Martinez',
        email: 'jennifer@newstartup.com',
        phone: '+1 (555) 123-9876',
        company: 'New Startup LLC',
        value: 15000,
        stage: 'Qualified',
        source: 'Website',
        assignedTo: 'Bob Chen',
        lastContact: '2025-05-23'
      },
      {
        id: 'lead-2',
        name: 'Robert Taylor',
        email: 'robert@enterprises.com',
        phone: '+1 (555) 234-8765',
        company: 'Taylor Enterprises',
        value: 25000,
        stage: 'Proposal',
        source: 'Referral',
        assignedTo: 'Alice Johnson',
        lastContact: '2025-05-22'
      }
    ],

    opportunities: [
      {
        id: 'opp-1',
        name: 'Enterprise Software Implementation',
        customer: 'Global Corp',
        value: 50000,
        probability: 75,
        stage: 'Negotiation',
        closeDate: '2025-06-30',
        description: 'Large-scale software implementation project'
      }
    ],

    bankConnections: [
      {
        id: 'conn-1',
        bankName: 'First National Bank',
        accountType: 'Business Checking',
        accountNumber: '****1234',
        status: 'Connected',
        lastSync: '2025-05-24 10:30:00',
        autoSync: true
      }
    ],

    users: [
      {
        id: 'user-1',
        name: 'John Admin',
        email: 'admin@acmecorp.com',
        role: 'Owner',
        permissions: ['all'],
        status: 'Active',
        lastLogin: '2025-05-24 09:00:00',
        department: 'Administration'
      },
      {
        id: 'user-2',
        name: 'Sarah Manager',
        email: 'sarah@acmecorp.com',
        role: 'Manager',
        permissions: ['accounting', 'invoicing', 'reports'],
        status: 'Active',
        lastLogin: '2025-05-24 08:30:00',
        department: 'Finance'
      }
    ],

    roles: [
      {
        id: 'role-1',
        name: 'Accountant',
        permissions: ['accounting', 'invoicing', 'expenses', 'reports'],
        description: 'Full access to accounting features'
      }
    ],

    paymentTemplates: [
      {
        id: 'template-1',
        name: 'Monthly Service Fee',
        description: 'Recurring monthly service charges',
        amount: 500,
        frequency: 'Monthly',
        isActive: true
      }
    ],

    recurringInvoices: [
      {
        id: 'recurring-1',
        template: 'Monthly Service',
        customer: 'Smith Enterprises',
        frequency: 'Monthly',
        nextDate: '2025-06-01',
        amount: 500,
        status: 'Active'
      }
    ],

    mileageEntries: [
      {
        id: 'mileage-1',
        date: '2025-05-20',
        startLocation: 'Office',
        endLocation: 'Client Site',
        purpose: 'Project meeting',
        miles: 25,
        rate: 0.67,
        amount: 16.75,
        status: 'Approved'
      }
    ],

    vendorBills: [
      {
        id: 'bill-1',
        billNumber: 'BILL-2025-001',
        vendor: 'Office Supplies Co',
        date: '2025-05-20',
        dueDate: '2025-06-20',
        amount: 250,
        status: 'Pending Approval',
        category: 'Office Supplies',
        description: 'Monthly office supplies order'
      }
    ],

    scannedReceipts: [
      {
        id: 'receipt-1',
        fileName: 'receipt_20250520.jpg',
        uploadDate: '2025-05-20',
        status: 'Completed',
        extractedData: {
          vendor: 'Office Depot',
          amount: 89.99,
          date: '2025-05-20',
          category: 'Office Supplies'
        }
      }
    ],

    auditTrail: [],
    integrations: [],
  };
};

export const CompanyProvider: React.FC<CompanyProviderProps> = ({ children }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentCompanyId, setCurrentCompanyId] = useState<string>('');

  // Initialize with demo data if none exists
  useEffect(() => {
    const storedData = loadFromLocalStorage();
    
    if (storedData) {
      setCompanies([storedData]);
      setCurrentCompanyId(storedData.id);
    } else {
      // Create company with comprehensive demo data
      const demoCompany = generateDemoData();
      setCompanies([demoCompany]);
      setCurrentCompanyId(demoCompany.id);
      saveToLocalStorage(demoCompany);
    }
  }, []);

  // Get current company object
  const currentCompany = companies.find(c => c.id === currentCompanyId) || companies[0] || {
    id: '',
    name: '',
    transactions: [],
    accounts: [],
    taxRates: [],
    bankAccounts: []
  };

  // Update a company
  const updateCompany = (updatedCompany: Company) => {
    const updatedCompanies = companies.map(company => 
      company.id === updatedCompany.id ? updatedCompany : company
    );
    
    setCompanies(updatedCompanies);
    saveToLocalStorage(updatedCompany);
  };

  // Switch active company
  const switchCompany = (companyId: string) => {
    setCurrentCompanyId(companyId);
  };

  // Add a new company
  const addCompany = (company: Company) => {
    setCompanies([...companies, company]);
    setCurrentCompanyId(company.id);
    saveToLocalStorage(company);
  };

  // Bank account operations
  const addBankAccount = (bankAccount: BankAccount) => {
    const updatedCompany = {
      ...currentCompany,
      bankAccounts: [...currentCompany.bankAccounts, bankAccount]
    };
    
    updateCompany(updatedCompany);
  };

  const updateBankAccount = (bankAccount: BankAccount) => {
    const updatedBankAccounts = currentCompany.bankAccounts.map(acc => 
      acc.id === bankAccount.id ? bankAccount : acc
    );
    
    const updatedCompany = {
      ...currentCompany,
      bankAccounts: updatedBankAccounts
    };
    
    updateCompany(updatedCompany);
  };

  const deleteBankAccount = (bankAccountId: string) => {
    const updatedCompany = {
      ...currentCompany,
      bankAccounts: currentCompany.bankAccounts.filter(acc => acc.id !== bankAccountId)
    };
    
    updateCompany(updatedCompany);
  };

  // Tax rate operations
  const addTaxRate = (taxRate: TaxRate) => {
    const updatedCompany = {
      ...currentCompany,
      taxRates: [...currentCompany.taxRates, taxRate]
    };
    
    updateCompany(updatedCompany);
  };

  const updateTaxRate = (taxRate: TaxRate) => {
    const updatedTaxRates = currentCompany.taxRates.map(tr => 
      tr.id === taxRate.id ? taxRate : tr
    );
    
    const updatedCompany = {
      ...currentCompany,
      taxRates: updatedTaxRates
    };
    
    updateCompany(updatedCompany);
  };

  const deleteTaxRate = (taxRateId: string) => {
    const updatedCompany = {
      ...currentCompany,
      taxRates: currentCompany.taxRates.filter(tr => tr.id !== taxRateId)
    };
    
    updateCompany(updatedCompany);
  };

  // Account operations
  const updateAccount = (account: Account) => {
    const updatedAccounts = currentCompany.accounts.map(acc => 
      acc.id === account.id ? account : acc
    );
    
    const updatedCompany = {
      ...currentCompany,
      accounts: updatedAccounts
    };
    
    updateCompany(updatedCompany);
  };

  const addAccount = (account: Account) => {
    const updatedCompany = {
      ...currentCompany,
      accounts: [...currentCompany.accounts, account]
    };
    
    updateCompany(updatedCompany);
  };

  const deleteAccount = (accountId: string) => {
    const updatedCompany = {
      ...currentCompany,
      accounts: currentCompany.accounts.filter(acc => acc.id !== accountId)
    };
    
    updateCompany(updatedCompany);
  };

  // Expense operations
  const addExpense = (expense: Expense) => {
    const expenses = currentCompany.expenses || [];
    const updatedCompany = {
      ...currentCompany,
      expenses: [...expenses, expense]
    };
    
    updateCompany(updatedCompany);
  };
  
  const updateExpense = (expense: Expense) => {
    const expenses = currentCompany.expenses || [];
    const updatedExpenses = expenses.map(exp => 
      exp.id === expense.id ? expense : exp
    );
    
    const updatedCompany = {
      ...currentCompany,
      expenses: updatedExpenses
    };
    
    updateCompany(updatedCompany);
  };
  
  const deleteExpense = (expenseId: string) => {
    const expenses = currentCompany.expenses || [];
    const updatedCompany = {
      ...currentCompany,
      expenses: expenses.filter(exp => exp.id !== expenseId)
    };
    
    updateCompany(updatedCompany);
  };

  // Invoice operations
  const addInvoice = (invoice: Invoice) => {
    const invoices = currentCompany.invoices || [];
    const updatedCompany = {
      ...currentCompany,
      invoices: [...invoices, invoice]
    };
    
    updateCompany(updatedCompany);
  };
  
  const updateInvoice = (invoice: Invoice) => {
    const invoices = currentCompany.invoices || [];
    const updatedInvoices = invoices.map(inv => 
      inv.id === invoice.id ? invoice : inv
    );
    
    const updatedCompany = {
      ...currentCompany,
      invoices: updatedInvoices
    };
    
    updateCompany(updatedCompany);
  };
  
  const deleteInvoice = (invoiceId: string) => {
    const invoices = currentCompany.invoices || [];
    const updatedCompany = {
      ...currentCompany,
      invoices: invoices.filter(inv => inv.id !== invoiceId)
    };
    
    updateCompany(updatedCompany);
  };

  // Transaction operations
  const updateTransaction = (transactionId: string, updates: Partial<Transaction>) => {
    // Find the bank account this transaction belongs to
    const bankAccount = currentCompany.bankAccounts.find(
      account => account.transactions.some(t => t.id === transactionId)
    );

    if (bankAccount) {
      // Get the transaction
      const transaction = bankAccount.transactions.find(t => t.id === transactionId);
      
      if (transaction) {
        // Update the transaction with new values
        const updatedTransaction = { ...transaction, ...updates };
        
        // Update the transaction in the bank account
        const updatedTransactions = bankAccount.transactions.map(
          t => t.id === transactionId ? updatedTransaction : t
        );

        // Update the bank account with new transactions list and last transaction date
        const updatedBankAccounts = currentCompany.bankAccounts.map(account => 
          account.id === bankAccount.id 
            ? { 
                ...account, 
                transactions: updatedTransactions,
                lastTransaction: updatedTransaction.date || account.lastTransaction
              }
            : account
        );

        // Update company with new bank accounts list
        const updatedCompany = {
          ...currentCompany,
          bankAccounts: updatedBankAccounts
        };

        updateCompany(updatedCompany);
      }
    }
  };

  const addTransaction = (transaction: Transaction) => {
    // Default to the first bank account if none specified
    const bankAccountId = transaction.bankAccount || currentCompany.bankAccounts[0]?.id;
    
    if (bankAccountId) {
      // Find the bank account to add the transaction to
      const bankAccount = currentCompany.bankAccounts.find(account => account.id === bankAccountId);

      if (bankAccount) {
        // Add the transaction to the bank account
        const updatedTransactions = [...bankAccount.transactions, transaction];

        // Update the bank account with new transactions list and last transaction date
        const updatedBankAccounts = currentCompany.bankAccounts.map(account => 
          account.id === bankAccountId 
            ? { 
                ...account, 
                transactions: updatedTransactions,
                lastTransaction: transaction.date
              }
            : account
        );

        // Update company with new bank accounts list
        const updatedCompany = {
          ...currentCompany,
          bankAccounts: updatedBankAccounts
        };

        updateCompany(updatedCompany);
      }
    }
  };
  
  const deleteTransaction = (transactionId: string, bankAccountId: string) => {
    // Find the bank account
    const bankAccount = currentCompany.bankAccounts.find(account => account.id === bankAccountId);

    if (bankAccount) {
      // Remove the transaction from the bank account
      const updatedTransactions = bankAccount.transactions.filter(t => t.id !== transactionId);

      // Find the latest transaction date for lastTransaction
      const latestTransaction = [...updatedTransactions].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];

      // Update the bank account with new transactions list
      const updatedBankAccounts = currentCompany.bankAccounts.map(account => 
        account.id === bankAccountId 
          ? { 
              ...account, 
              transactions: updatedTransactions,
              lastTransaction: latestTransaction?.date || account.lastTransaction
            }
          : account
      );

      // Update company with new bank accounts list
      const updatedCompany = {
        ...currentCompany,
        bankAccounts: updatedBankAccounts
      };

      updateCompany(updatedCompany);
    }
  };

  // Time Entry operations
  const addTimeEntry = (timeEntry: TimeEntry) => {
    const timeEntries = currentCompany.timeEntries || [];
    const updatedCompany = {
      ...currentCompany,
      timeEntries: [...timeEntries, timeEntry]
    };
    
    updateCompany(updatedCompany);
  };
  
  const updateTimeEntry = (timeEntryId: string, updates: Partial<TimeEntry>) => {
    const timeEntries = currentCompany.timeEntries || [];
    
    const updatedTimeEntries = timeEntries.map(entry => 
      entry.id === timeEntryId ? { ...entry, ...updates } : entry
    );
    
    const updatedCompany = {
      ...currentCompany,
      timeEntries: updatedTimeEntries
    };
    
    updateCompany(updatedCompany);
  };
  
  const deleteTimeEntry = (timeEntryId: string) => {
    const timeEntries = currentCompany.timeEntries || [];
    
    const updatedCompany = {
      ...currentCompany,
      timeEntries: timeEntries.filter(entry => entry.id !== timeEntryId)
    };
    
    updateCompany(updatedCompany);
  };

  // Sale operations
  const addSale = (sale: Sale) => {
    const sales = currentCompany.sales || [];
    const updatedCompany = {
      ...currentCompany,
      sales: [...sales, sale]
    };
    
    updateCompany(updatedCompany);
  };
  
  const updateSale = (sale: Sale) => {
    const sales = currentCompany.sales || [];
    const updatedSales = sales.map(s => 
      s.id === sale.id ? sale : s
    );
    
    const updatedCompany = {
      ...currentCompany,
      sales: updatedSales
    };
    
    updateCompany(updatedCompany);
  };
  
  const deleteSale = (saleId: string) => {
    const sales = currentCompany.sales || [];
    const updatedCompany = {
      ...currentCompany,
      sales: sales.filter(s => s.id !== saleId)
    };
    
    updateCompany(updatedCompany);
  };

  // Estimate operations
  const addEstimate = (estimate: Estimate) => {
    const estimates = currentCompany.estimates || [];
    const updatedCompany = {
      ...currentCompany,
      estimates: [...estimates, estimate]
    };
    
    updateCompany(updatedCompany);
  };
  
  const updateEstimate = (estimate: Estimate) => {
    const estimates = currentCompany.estimates || [];
    const updatedEstimates = estimates.map(est => 
      est.id === estimate.id ? estimate : est
    );
    
    const updatedCompany = {
      ...currentCompany,
      estimates: updatedEstimates
    };
    
    updateCompany(updatedCompany);
  };
  
  const deleteEstimate = (estimateId: string) => {
    const estimates = currentCompany.estimates || [];
    const updatedCompany = {
      ...currentCompany,
      estimates: estimates.filter(est => est.id !== estimateId)
    };
    
    updateCompany(updatedCompany);
  };

  // Budget operations
  const addBudget = (budget: Budget) => {
    const budgets = currentCompany.budgets || [];
    const updatedCompany = {
      ...currentCompany,
      budgets: [...budgets, budget]
    };
    
    updateCompany(updatedCompany);
  };
  
  const updateBudget = (budget: Budget) => {
    const budgets = currentCompany.budgets || [];
    const updatedBudgets = budgets.map(b => 
      b.id === budget.id ? budget : b
    );
    
    const updatedCompany = {
      ...currentCompany,
      budgets: updatedBudgets
    };
    
    updateCompany(updatedCompany);
  };
  
  const deleteBudget = (budgetId: string) => {
    const budgets = currentCompany.budgets || [];
    const updatedCompany = {
      ...currentCompany,
      budgets: budgets.filter(b => b.id !== budgetId)
    };
    
    updateCompany(updatedCompany);
  };

  // Payroll operations
  const processPayroll = (payrollData: any) => {
    const currentPayrollData = currentCompany.payrollData || { payPeriods: [] };
    const updatedCompany = {
      ...currentCompany,
      payrollData: {
        ...currentPayrollData,
        payPeriods: [...currentPayrollData.payPeriods, payrollData]
      }
    };
    
    updateCompany(updatedCompany);
  };

  return (
    <CompanyContext.Provider 
      value={{ 
        currentCompany, 
        companies, 
        updateCompany, 
        switchCompany, 
        addCompany,
        updateTaxRate,
        addTaxRate,
        deleteTaxRate,
        updateAccount,
        addAccount,
        deleteAccount,
        addExpense,
        updateExpense,
        deleteExpense,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        addEstimate,
        updateEstimate,
        deleteEstimate,
        addBudget,
        updateBudget,
        deleteBudget,
        processPayroll,
        updateTransaction,
        addTransaction,
        deleteTransaction,
        addBankAccount,
        updateBankAccount,
        deleteBankAccount,
        addTimeEntry,
        updateTimeEntry,
        deleteTimeEntry,
        addSale,
        updateSale,
        deleteSale
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

// Re-export types
export type { Company, TaxRate, Account, Transaction, Invoice, Expense, Estimate, Budget, BankAccount, TimeEntry, Project, ProjectDocument, Customer } from '@/types/company';
