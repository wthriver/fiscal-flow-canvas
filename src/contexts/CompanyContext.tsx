import React, { createContext, useContext, useState, useEffect } from 'react';
import { Company, Transaction, Expense, TaxRate, Account, Invoice, Budget, Estimate, BankAccount, TimeEntry, Sale } from '../types/company';
import { CompanyContextType } from '../types/context';
import { localStorageService } from '../services/localStorageService';
import { toast } from 'sonner';

// Create the context with default values
const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Enhanced demo data with comprehensive information
const createComprehensiveDemoData = (): Company => {
  const currentDate = new Date().toISOString().split('T')[0];
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0];
  const nextMonth = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0];

  return {
    id: "company-1",
    name: "Acme Corp",
    address: "123 Business Street, Suite 100, Business City, BC 12345",
    phone: "+1 (555) 123-4567",
    email: "info@acmecorp.com",
    website: "https://www.acmecorp.com",
    taxId: "12-3456789",
    industry: "Technology Services",
    fiscalYearStart: "January",
    fiscalYear: "2025",
    
    transactions: [
      {
        id: "txn-001",
        date: currentDate,
        description: "Software License Revenue",
        amount: "+$5,250.00",
        category: "Revenue",
        account: "Software Sales",
        reconciled: true,
        type: "Deposit",
        bankAccount: "bank-1",
        reference: "INV-2025-001",
        memo: "Annual software license renewal",
        tags: ["software", "recurring"],
        merchant: "Acme Corp"
      },
      {
        id: "txn-002",
        date: lastMonth,
        description: "Office Rent Payment",
        amount: "-$2,500.00",
        category: "Office Expenses",
        account: "Operating Expenses",
        reconciled: true,
        type: "Withdrawal",
        bankAccount: "bank-1",
        reference: "RENT-JAN-2025",
        memo: "Monthly office rent",
        tags: ["rent", "office"]
      },
      {
        id: "txn-003",
        date: currentDate,
        description: "Consulting Services",
        amount: "+$8,750.00",
        category: "Consulting Revenue",
        account: "Service Revenue",
        reconciled: false,
        type: "Deposit",
        bankAccount: "bank-1",
        reference: "INV-2025-002",
        memo: "Q1 consulting project completion",
        tags: ["consulting", "project"]
      }
    ],

    bankAccounts: [
      {
        id: "bank-1",
        name: "Business Checking",
        balance: 45250.75,
        type: "Checking",
        accountNumber: "****1234",
        routingNumber: "021000021",
        bankName: "First Business Bank",
        isActive: true,
        openingDate: "2023-01-15",
        interestRate: 0.25,
        transactions: [
          {
            id: "transaction-1",
            date: currentDate,
            description: "Client Payment - TechCorp",
            amount: "+$12,500.00",
            category: "Revenue",
            account: "Business Checking",
            reconciled: true,
            type: "Deposit",
            reference: "WIRE-2025-001",
            memo: "Project milestone payment"
          }
        ]
      },
      {
        id: "bank-2",
        name: "Business Savings",
        balance: 125000.00,
        type: "Savings",
        accountNumber: "****5678",
        routingNumber: "021000021",
        bankName: "First Business Bank",
        isActive: true,
        openingDate: "2023-01-15",
        interestRate: 2.1,
        transactions: []
      }
    ],

    accounts: [
      {
        id: "acc-1000",
        number: "1000",
        name: "Cash and Cash Equivalents",
        type: "Asset",
        balance: 170250.75,
        description: "Primary business checking and savings accounts",
        isActive: true,
        taxType: "None"
      },
      {
        id: "acc-1200",
        number: "1200",
        name: "Accounts Receivable",
        type: "Asset",
        balance: 45680.00,
        description: "Money owed by customers for services rendered",
        isActive: true,
        taxType: "None"
      },
      {
        id: "acc-4000",
        number: "4000",
        name: "Service Revenue",
        type: "Income",
        balance: 287500.00,
        description: "Revenue from consulting and software services",
        isActive: true,
        taxType: "Taxable Income"
      },
      {
        id: "acc-5000",
        number: "5000",
        name: "Operating Expenses",
        type: "Expense",
        balance: 145250.00,
        description: "General business operating expenses",
        isActive: true,
        taxType: "Deductible Expense"
      }
    ],

    taxRates: [
      {
        id: "tax-1",
        name: "Standard Sales Tax",
        rate: 8.25,
        isDefault: true,
        description: "Standard state sales tax rate",
        category: "Sales Tax",
        jurisdiction: "California",
        effectiveDate: "2025-01-01"
      },
      {
        id: "tax-2",
        name: "Professional Services Tax",
        rate: 6.0,
        isDefault: false,
        description: "Tax rate for professional services",
        category: "Service Tax",
        jurisdiction: "California",
        effectiveDate: "2025-01-01"
      }
    ],

    customers: [
      {
        id: "cust-001",
        name: "TechCorp Solutions",
        email: "billing@techcorp.com",
        phone: "+1 (555) 987-6543",
        company: "TechCorp Solutions Inc.",
        contactName: "Sarah Johnson",
        type: "Business",
        status: "Active",
        address: "456 Tech Avenue",
        city: "San Francisco",
        state: "CA",
        postalCode: "94105",
        country: "USA",
        website: "https://techcorp.com",
        taxId: "98-7654321",
        paymentTerms: "Net 30",
        creditLimit: 50000,
        totalSales: 125000,
        lastOrderDate: currentDate,
        customerSince: "2023-03-15",
        notes: "Premium client with enterprise contract",
        billingAddress: {
          street: "456 Tech Avenue",
          city: "San Francisco",
          state: "CA",
          postalCode: "94105",
          country: "USA"
        },
        contacts: [
          {
            id: "contact-1",
            name: "Sarah Johnson",
            email: "sarah.johnson@techcorp.com",
            phone: "+1 (555) 987-6543",
            role: "Procurement Manager",
            isPrimary: true
          }
        ]
      },
      {
        id: "cust-002",
        name: "Global Dynamics",
        email: "accounts@globaldynamics.com",
        phone: "+1 (555) 456-7890",
        company: "Global Dynamics LLC",
        contactName: "Michael Chen",
        type: "Business",
        status: "Active",
        address: "789 Business Boulevard",
        city: "Los Angeles",
        state: "CA",
        postalCode: "90210",
        country: "USA",
        paymentTerms: "Net 15",
        creditLimit: 75000,
        totalSales: 89500,
        lastOrderDate: lastMonth,
        customerSince: "2023-06-20",
        notes: "Fast-growing client with monthly recurring services"
      }
    ],

    invoices: [
      {
        id: "inv-001",
        invoiceNumber: "INV-2025-001",
        customer: "TechCorp Solutions",
        customerId: "cust-001",
        date: currentDate,
        dueDate: nextMonth,
        status: "Paid",
        total: 12500,
        amount: "$12,500.00",
        subtotal: 11574.07,
        taxAmount: 925.93,
        notes: "Software development services - Phase 1",
        terms: "Payment due within 30 days",
        poNumber: "PO-TC-2025-001",
        paymentStatus: "Paid",
        paymentDate: currentDate,
        paymentMethod: "Bank Transfer",
        items: [
          {
            id: "item-1",
            description: "Custom Software Development",
            quantity: 80,
            price: 125,
            total: 10000,
            sku: "DEV-001",
            unit: "hours",
            taxRate: 8.25
          },
          {
            id: "item-2",
            description: "Project Management",
            quantity: 20,
            price: 95,
            total: 1900,
            sku: "PM-001",
            unit: "hours",
            taxRate: 8.25
          }
        ]
      },
      {
        id: "inv-002",
        invoiceNumber: "INV-2025-002",
        customer: "Global Dynamics",
        customerId: "cust-002",
        date: lastMonth,
        dueDate: currentDate,
        status: "Overdue",
        total: 8750,
        amount: "$8,750.00",
        subtotal: 8101.85,
        taxAmount: 648.15,
        notes: "Monthly consulting retainer",
        terms: "Payment due within 15 days",
        items: [
          {
            id: "item-3",
            description: "Business Consulting",
            quantity: 70,
            price: 115,
            total: 8050,
            sku: "CONS-001",
            unit: "hours",
            taxRate: 8.25
          }
        ]
      }
    ],

    expenses: [
      {
        id: "exp-001",
        date: currentDate,
        vendor: "Office Supplies Inc.",
        category: "Office Supplies",
        amount: 485.75,
        description: "Monthly office supplies and equipment",
        status: "Paid",
        paymentMethod: "Credit Card",
        billNumber: "OSI-2025-001",
        accountId: "acc-5000",
        taxAmount: 38.86,
        tags: ["office", "supplies", "monthly"]
      },
      {
        id: "exp-002",
        date: lastMonth,
        vendor: "CloudHost Services",
        category: "Software & Subscriptions",
        amount: 299.99,
        description: "Cloud hosting and backup services",
        status: "Paid",
        paymentMethod: "Auto-Pay",
        billNumber: "CHS-2025-001",
        accountId: "acc-5000",
        isBillable: false,
        tags: ["cloud", "hosting", "recurring"]
      },
      {
        id: "exp-003",
        date: currentDate,
        vendor: "Business Travel Corp",
        category: "Travel",
        amount: 1250.00,
        description: "Client meeting travel expenses",
        status: "Pending",
        paymentMethod: "Credit Card",
        isBillable: true,
        projectId: "proj-001",
        tags: ["travel", "client", "billable"]
      }
    ],

    projects: [
      {
        id: "proj-001",
        name: "TechCorp Digital Transformation",
        client: "TechCorp Solutions",
        clientId: "cust-001",
        status: "In Progress",
        startDate: "2025-01-01",
        endDate: "2025-06-30",
        budget: 75000,
        progress: 65,
        description: "Complete digital transformation including new CRM and automation systems",
        priority: "High",
        billingRate: 125,
        currency: "USD",
        projectManager: "emp-001",
        tracked: 234.5,
        billed: 28750,
        spent: 15420,
        team: ["emp-001", "emp-002", "emp-003"],
        documents: [
          {
            id: "doc-001",
            name: "Project Charter.pdf",
            type: "document",
            size: "2.4 MB",
            uploadedBy: "emp-001",
            uploadDate: "2025-01-05",
            category: "Planning"
          }
        ],
        milestones: [
          {
            id: "mile-001",
            name: "Requirements Analysis",
            dueDate: "2025-02-15",
            status: "Completed",
            description: "Complete business requirements gathering and analysis",
            budget: 15000
          },
          {
            id: "mile-002",
            name: "System Design",
            dueDate: "2025-03-30",
            status: "In Progress",
            description: "Technical architecture and system design",
            budget: 20000
          }
        ],
        tasks: [
          {
            id: "task-001",
            name: "Database Design",
            assigneeId: "emp-002",
            status: "In Progress",
            priority: "High",
            dueDate: "2025-03-15",
            estimatedHours: 40,
            actualHours: 28,
            milestoneId: "mile-002"
          }
        ]
      },
      {
        id: "proj-002",
        name: "Global Dynamics Process Automation",
        client: "Global Dynamics",
        clientId: "cust-002",
        status: "Planning",
        startDate: "2025-03-01",
        endDate: "2025-08-31",
        budget: 45000,
        progress: 15,
        description: "Automate key business processes to improve efficiency",
        priority: "Medium",
        billingRate: 115,
        currency: "USD",
        projectManager: "emp-001",
        tracked: 45.5,
        billed: 5225,
        spent: 2100,
        team: ["emp-001", "emp-003"],
        documents: [],
        milestones: [],
        tasks: []
      }
    ],

    timeEntries: [
      {
        id: "time-001",
        employeeId: "emp-001",
        projectId: "proj-001",
        date: currentDate,
        hours: 8,
        description: "Client requirements meeting and documentation",
        billable: true,
        startTime: "09:00",
        endTime: "17:00",
        status: "Approved",
        billingRate: 125,
        location: "Client Site",
        approvedBy: "emp-001"
      },
      {
        id: "time-002",
        employeeId: "emp-002",
        projectId: "proj-001",
        date: lastMonth,
        hours: 6.5,
        description: "Database schema design and optimization",
        billable: true,
        startTime: "10:00",
        endTime: "16:30",
        status: "Approved",
        billingRate: 110,
        taskId: "task-001"
      }
    ],

    employees: [
      {
        id: "emp-001",
        name: "John Smith",
        position: "Senior Project Manager",
        email: "john.smith@acmecorp.com",
        phone: "+1 (555) 123-4567",
        salary: 95000,
        hireDate: "2023-01-15",
        status: "Active",
        payRate: 125,
        payType: "Hourly",
        department: "Project Management",
        skills: ["Project Management", "Agile", "Scrum", "Client Relations"],
        benefits: ["Health Insurance", "401k", "PTO"],
        performanceRating: 4.8
      },
      {
        id: "emp-002",
        name: "Sarah Davis",
        position: "Senior Developer",
        email: "sarah.davis@acmecorp.com",
        phone: "+1 (555) 234-5678",
        salary: 85000,
        hireDate: "2023-03-20",
        status: "Active",
        payRate: 110,
        payType: "Hourly",
        department: "Development",
        manager: "emp-001",
        skills: ["React", "Node.js", "Python", "Database Design"],
        benefits: ["Health Insurance", "401k", "PTO"],
        performanceRating: 4.6
      },
      {
        id: "emp-003",
        name: "Mike Johnson",
        position: "Business Analyst",
        email: "mike.johnson@acmecorp.com",
        phone: "+1 (555) 345-6789",
        salary: 75000,
        hireDate: "2023-06-10",
        status: "Active",
        payRate: 95,
        payType: "Hourly",
        department: "Analysis",
        manager: "emp-001",
        skills: ["Business Analysis", "Requirements Gathering", "Process Design"],
        benefits: ["Health Insurance", "401k", "PTO"],
        performanceRating: 4.2
      }
    ],

    budgets: [
      {
        id: "budget-001",
        name: "Q1 2025 Operating Budget",
        period: "Quarterly",
        startDate: "2025-01-01",
        endDate: "2025-03-31",
        status: "Active",
        owner: "emp-001",
        department: "Operations",
        categories: [
          {
            id: "cat-001",
            name: "Software Revenue",
            type: "income",
            budgeted: 150000,
            actual: 125000,
            isActive: true
          },
          {
            id: "cat-002",
            name: "Consulting Revenue",
            type: "income",
            budgeted: 100000,
            actual: 89500,
            isActive: true
          },
          {
            id: "cat-003",
            name: "Salaries & Benefits",
            type: "expense",
            budgeted: 65000,
            actual: 58500,
            isActive: true
          },
          {
            id: "cat-004",
            name: "Office & Administrative",
            type: "expense",
            budgeted: 15000,
            actual: 12750,
            isActive: true
          }
        ],
        totalBudgeted: "$185,000.00",
        totalActual: "$156,750.00",
        variance: "$28,250.00"
      }
    ],

    estimates: [
      {
        id: "est-001",
        estimateNumber: "EST-2025-001",
        customer: "Startup Inc.",
        date: currentDate,
        expiryDate: nextMonth,
        status: "Pending",
        total: 25000,
        amount: "$25,000.00",
        validUntil: nextMonth,
        probability: 75,
        followUpDate: "2025-02-15",
        notes: "Custom mobile app development project",
        items: [
          {
            id: "est-item-1",
            description: "Mobile App Development",
            quantity: 200,
            price: 115,
            total: 23000,
            sku: "MOBILE-001",
            unit: "hours"
          },
          {
            id: "est-item-2",
            description: "Testing & QA",
            quantity: 20,
            price: 95,
            total: 1900,
            sku: "QA-001",
            unit: "hours"
          }
        ]
      }
    ],

    sales: [
      {
        id: "sale-001",
        date: currentDate,
        customer: "TechCorp Solutions",
        customerId: "cust-001",
        amount: 12500,
        status: "Completed",
        paymentMethod: "Bank Transfer",
        salesRep: "emp-001",
        channel: "Direct",
        items: [
          {
            id: "sale-item-1",
            itemId: "srv-001",
            quantity: 1,
            unitPrice: 12500,
            total: 12500
          }
        ]
      }
    ],

    inventory: {
      items: [
        {
          id: "inv-001",
          name: "Enterprise Software License",
          sku: "ESL-001",
          quantity: 50,
          price: 2500,
          cost: 800,
          category: "Software",
          location: "Digital",
          supplier: "Software Vendor Inc.",
          reorderLevel: 10,
          maxStock: 100,
          unit: "license",
          description: "Annual enterprise software license"
        },
        {
          id: "inv-002",
          name: "Professional Services Package",
          sku: "PSP-001",
          quantity: 25,
          price: 5000,
          cost: 2000,
          category: "Services",
          location: "Virtual",
          unit: "package",
          description: "Comprehensive professional services package"
        }
      ],
      categories: ["Software", "Services", "Hardware", "Consulting"],
      locations: ["Digital", "Virtual", "Office", "Warehouse"],
      bundles: [],
      serialNumbers: [],
      lotTracking: [],
      suppliers: [
        {
          id: "sup-001",
          name: "Software Vendor Inc.",
          email: "sales@softwarevendor.com",
          phone: "+1 (555) 777-8888",
          address: "123 Software Street, Tech City, TC 12345",
          contactPerson: "Alex Thompson",
          paymentTerms: "Net 30",
          rating: 4.5
        }
      ]
    },

    payrollData: {
      payPeriods: [
        {
          id: "pay-001",
          startDate: "2025-01-01",
          endDate: "2025-01-15",
          status: "Completed",
          totalPaid: 18500,
          payDate: "2025-01-20",
          totalGross: 22500,
          totalNet: 18500,
          totalTaxes: 3200,
          totalDeductions: 800,
          employees: [
            {
              id: "pe-001",
              employeeId: "emp-001",
              hoursWorked: 80,
              grossPay: 9500,
              netPay: 7800,
              federalTax: 1200,
              stateTax: 400,
              socialSecurity: 589,
              medicare: 138
            }
          ]
        }
      ],
      taxSettings: {
        federalRate: 12.0,
        stateRate: 4.0,
        socialSecurityRate: 6.2,
        medicareRate: 1.45,
        unemploymentRate: 0.6
      }
    },

    revenue: {
      current: 287500,
      previous: 245000,
      percentChange: 17.3,
      monthlyData: [
        { month: "Jan", revenue: 95000, expenses: 45000, profit: 50000 },
        { month: "Feb", revenue: 87500, expenses: 42000, profit: 45500 },
        { month: "Mar", revenue: 105000, expenses: 48000, profit: 57000 }
      ]
    },

    profitMargin: {
      value: 32.5,
      trend: 5.2,
      percentChange: 8.1,
      grossMargin: 68.5,
      netMargin: 32.5,
      operatingMargin: 35.2
    },

    outstandingInvoices: {
      amount: 23450,
      percentChange: -12.5,
      count: 3,
      averageDaysOverdue: 8
    },

    activeCustomers: {
      count: 24,
      percentChange: 15.4,
      newCustomers: 4,
      retentionRate: 92.5,
      averageOrderValue: 12850
    },

    leads: [
      {
        id: "lead-001",
        name: "Jennifer Wilson",
        email: "jennifer@innovatetech.com",
        phone: "+1 (555) 999-0000",
        company: "InnovateTech Solutions",
        value: 35000,
        stage: "Qualified",
        source: "Website",
        assignedTo: "emp-001",
        lastContact: currentDate,
        nextFollowUp: "2025-02-10",
        score: 85,
        industry: "Healthcare Technology",
        employees: 150,
        pain_points: ["Manual processes", "Scalability issues"],
        interests: ["Cloud migration", "Process automation"]
      }
    ],

    opportunities: [
      {
        id: "opp-001",
        name: "Enterprise CRM Implementation",
        customer: "MegaCorp Industries",
        value: 125000,
        probability: 65,
        stage: "Proposal",
        closeDate: "2025-03-15",
        description: "Large-scale CRM implementation with custom integrations",
        salesRep: "emp-001",
        source: "Referral",
        nextAction: "Present final proposal"
      }
    ],

    auditTrail: [
      {
        id: "audit-001",
        timestamp: new Date().toISOString(),
        userId: "user-001",
        action: "Invoice Created",
        entity: "Invoice",
        entityId: "inv-001",
        changes: { status: "Draft" }
      }
    ],

    integrations: [
      {
        id: "int-001",
        name: "Stripe Payment Gateway",
        type: "Payment",
        status: "Connected",
        lastSync: currentDate,
        syncFrequency: "Real-time"
      },
      {
        id: "int-002",
        name: "QuickBooks Sync",
        type: "Accounting",
        status: "Disconnected",
        syncFrequency: "Daily"
      }
    ]
  };
};

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentCompany, setCurrentCompany] = useState<Company>(createComprehensiveDemoData());

  useEffect(() => {
    const savedData = localStorageService.loadData();
    if (savedData && Object.keys(savedData).length > 0) {
      console.log('Data loaded from local storage', savedData);
      setCurrentCompany(savedData);
    } else {
      console.log('Using comprehensive demo data');
      const demoData = createComprehensiveDemoData();
      setCurrentCompany(demoData);
      localStorageService.saveData(demoData);
    }
  }, []);

  useEffect(() => {
    localStorageService.saveData(currentCompany);
  }, [currentCompany]);

  // Update a company
  const updateCompany = (updatedCompany: Company) => {
    setCurrentCompany(updatedCompany);
    setCompanies(prev => prev.map(company => 
      company.id === updatedCompany.id ? updatedCompany : company
    ));
    toast.success("Company updated successfully");
  };

  // Switch active company
  const switchCompany = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      setCurrentCompany(company);
      toast.success(`Switched to ${company.name}`);
    }
  };

  // Add a new company
  const addCompany = (company: Company) => {
    setCompanies(prev => [...prev, company]);
    toast.success("Company added successfully");
  };

  // Bank account operations
  const addBankAccount = (bankAccount: BankAccount) => {
    setCurrentCompany(prev => ({
      ...prev,
      bankAccounts: [...prev.bankAccounts, bankAccount]
    }));
    toast.success("Bank account added");
  };

  const updateBankAccount = (bankAccount: BankAccount) => {
    setCurrentCompany(prev => ({
      ...prev,
      bankAccounts: prev.bankAccounts.map(acc => 
        acc.id === bankAccount.id ? bankAccount : acc
      )
    }));
    toast.success("Bank account updated");
  };

  const deleteBankAccount = (bankAccountId: string) => {
    setCurrentCompany(prev => ({
      ...prev,
      bankAccounts: prev.bankAccounts.filter(acc => acc.id !== bankAccountId)
    }));
    toast.success("Bank account deleted");
  };

  // Tax rate operations
  const addTaxRate = (taxRate: TaxRate) => {
    setCurrentCompany(prev => ({
      ...prev,
      taxRates: [...prev.taxRates, taxRate]
    }));
    toast.success("Tax rate added");
  };

  const updateTaxRate = (taxRate: TaxRate) => {
    setCurrentCompany(prev => ({
      ...prev,
      taxRates: prev.taxRates.map(rate => 
        rate.id === taxRate.id ? taxRate : rate
      )
    }));
    toast.success("Tax rate updated");
  };

  const deleteTaxRate = (taxRateId: string) => {
    setCurrentCompany(prev => ({
      ...prev,
      taxRates: prev.taxRates.filter(rate => rate.id !== taxRateId)
    }));
    toast.success("Tax rate deleted");
  };

  // Account operations
  const updateAccount = (account: Account) => {
    setCurrentCompany(prev => ({
      ...prev,
      accounts: prev.accounts.map(acc => 
        acc.id === account.id ? account : acc
      )
    }));
    toast.success("Account updated");
  };

  const addAccount = (account: Account) => {
    setCurrentCompany(prev => ({
      ...prev,
      accounts: [...prev.accounts, account]
    }));
    toast.success("Account added");
  };

  const deleteAccount = (accountId: string) => {
    setCurrentCompany(prev => ({
      ...prev,
      accounts: prev.accounts.filter(acc => acc.id !== accountId)
    }));
    toast.success("Account deleted");
  };

  // Expense operations
  const addExpense = (expense: Expense) => {
    setCurrentCompany(prev => ({
      ...prev,
      expenses: [...(prev.expenses || []), expense]
    }));
    toast.success("Expense added");
  };

  const updateExpense = (expense: Expense) => {
    setCurrentCompany(prev => ({
      ...prev,
      expenses: (prev.expenses || []).map(exp => 
        exp.id === expense.id ? expense : exp
      )
    }));
    toast.success("Expense updated");
  };

  const deleteExpense = (expenseId: string) => {
    setCurrentCompany(prev => ({
      ...prev,
      expenses: (prev.expenses || []).filter(exp => exp.id !== expenseId)
    }));
    toast.success("Expense deleted");
  };

  // Invoice operations
  const addInvoice = (invoice: Invoice) => {
    setCurrentCompany(prev => ({
      ...prev,
      invoices: [...(prev.invoices || []), invoice]
    }));
    toast.success("Invoice added");
  };

  const updateInvoice = (invoice: Invoice) => {
    setCurrentCompany(prev => ({
      ...prev,
      invoices: (prev.invoices || []).map(inv => 
        inv.id === invoice.id ? invoice : inv
      )
    }));
    toast.success("Invoice updated");
  };

  const deleteInvoice = (invoiceId: string) => {
    setCurrentCompany(prev => ({
      ...prev,
      invoices: (prev.invoices || []).filter(inv => inv.id !== invoiceId)
    }));
    toast.success("Invoice deleted");
  };

  // Estimate operations
  const addEstimate = (estimate: Estimate) => {
    setCurrentCompany(prev => ({
      ...prev,
      estimates: [...(prev.estimates || []), estimate]
    }));
    toast.success("Estimate added");
  };

  const updateEstimate = (estimate: Estimate) => {
    setCurrentCompany(prev => ({
      ...prev,
      estimates: (prev.estimates || []).map(est => 
        est.id === estimate.id ? estimate : est
      )
    }));
    toast.success("Estimate updated");
  };

  const deleteEstimate = (estimateId: string) => {
    setCurrentCompany(prev => ({
      ...prev,
      estimates: (prev.estimates || []).filter(est => est.id !== estimateId)
    }));
    toast.success("Estimate deleted");
  };

  // Budget operations
  const addBudget = (budget: Budget) => {
    setCurrentCompany(prev => ({
      ...prev,
      budgets: [...(prev.budgets || []), budget]
    }));
    toast.success("Budget added");
  };

  const updateBudget = (budget: Budget) => {
    setCurrentCompany(prev => ({
      ...prev,
      budgets: (prev.budgets || []).map(bud => 
        bud.id === budget.id ? budget : bud
      )
    }));
    toast.success("Budget updated");
  };

  const deleteBudget = (budgetId: string) => {
    setCurrentCompany(prev => ({
      ...prev,
      budgets: (prev.budgets || []).filter(bud => bud.id !== budgetId)
    }));
    toast.success("Budget deleted");
  };

  // Transaction operations
  const updateTransaction = (transactionId: string, updates: Partial<Transaction>) => {
    setCurrentCompany(prev => ({
      ...prev,
      transactions: prev.transactions.map(txn => 
        txn.id === transactionId ? { ...txn, ...updates } : txn
      )
    }));
    toast.success("Transaction updated");
  };

  const addTransaction = (transaction: Transaction) => {
    setCurrentCompany(prev => ({
      ...prev,
      transactions: [...prev.transactions, transaction]
    }));
    toast.success("Transaction added");
  };

  const deleteTransaction = (transactionId: string, bankAccountId: string) => {
    setCurrentCompany(prev => ({
      ...prev,
      transactions: prev.transactions.filter(txn => txn.id !== transactionId),
      bankAccounts: prev.bankAccounts.map(account => 
        account.id === bankAccountId 
          ? { ...account, transactions: account.transactions.filter(txn => txn.id !== transactionId) }
          : account
      )
    }));
    toast.success("Transaction deleted");
  };

  // Time Entry operations
  const addTimeEntry = (timeEntry: TimeEntry) => {
    setCurrentCompany(prev => ({
      ...prev,
      timeEntries: [...(prev.timeEntries || []), timeEntry]
    }));
    toast.success("Time entry added");
  };

  const updateTimeEntry = (timeEntryId: string, updates: Partial<TimeEntry>) => {
    setCurrentCompany(prev => ({
      ...prev,
      timeEntries: (prev.timeEntries || []).map(entry => 
        entry.id === timeEntryId ? { ...entry, ...updates } : entry
      )
    }));
    toast.success("Time entry updated");
  };

  const deleteTimeEntry = (timeEntryId: string) => {
    setCurrentCompany(prev => ({
      ...prev,
      timeEntries: (prev.timeEntries || []).filter(entry => entry.id !== timeEntryId)
    }));
    toast.success("Time entry deleted");
  };

  // Sale operations
  const addSale = (sale: Sale) => {
    setCurrentCompany(prev => ({
      ...prev,
      sales: [...(prev.sales || []), sale]
    }));
    toast.success("Sale added");
  };

  const updateSale = (sale: Sale) => {
    setCurrentCompany(prev => ({
      ...prev,
      sales: (prev.sales || []).map(s => 
        s.id === sale.id ? sale : s
      )
    }));
    toast.success("Sale updated");
  };

  const deleteSale = (saleId: string) => {
    setCurrentCompany(prev => ({
      ...prev,
      sales: (prev.sales || []).filter(s => s.id !== saleId)
    }));
    toast.success("Sale deleted");
  };

  // Payroll operations
  const processPayroll = (payrollData: any) => {
    setCurrentCompany(prev => ({
      ...prev,
      payrollData: payrollData
    }));
    toast.success("Payroll processed");
  };

  const value: CompanyContextType = {
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
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
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
    updateTransaction,
    addTransaction,
    deleteTransaction,
    addTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
    addSale,
    updateSale,
    deleteSale,
    processPayroll
  };

  return (
    <CompanyContext.Provider value={value}>
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
