import React, { createContext, useContext, useState, useEffect } from 'react';
import { Company, Transaction, Expense, TaxRate, Account, Invoice, Budget, Estimate, BankAccount, TimeEntry, Sale } from '../types/company';
import { CompanyContextType } from '../types/context';
import { saveToLocalStorage, loadFromLocalStorage } from '../services/localStorageService';
import { toast } from 'sonner';

// Create the context with default values
const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Enhanced demo data with comprehensive information for all modules
const createComprehensiveDemoData = (): Company => {
  const currentDate = new Date().toISOString().split('T')[0];
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0];
  const nextMonth = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0];
  const lastWeek = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0];
  const nextWeek = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0];

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
        description: "Software License Revenue - TechCorp",
        amount: "+$12,500.00",
        category: "Software Revenue",
        account: "Business Checking",
        reconciled: true,
        type: "Deposit",
        bankAccount: "bank-1",
        reference: "INV-2025-001",
        memo: "Payment for software development project",
        tags: ["software", "recurring", "techcorp"],
        merchant: "TechCorp Solutions"
      },
      {
        id: "txn-002",
        date: lastMonth,
        description: "Office Rent Payment",
        amount: "-$2,500.00",
        category: "Office Expenses",
        account: "Business Checking",
        reconciled: true,
        type: "Withdrawal",
        bankAccount: "bank-1",
        reference: "RENT-JAN-2025",
        memo: "Monthly office rent - Business Plaza",
        tags: ["rent", "office", "monthly"]
      },
      {
        id: "txn-003",
        date: currentDate,
        description: "Consulting Services - Global Dynamics",
        amount: "+$8,750.00",
        category: "Consulting Revenue",
        account: "Business Checking",
        reconciled: false,
        type: "Deposit",
        bankAccount: "bank-1",
        reference: "INV-2025-002",
        memo: "Q1 consulting project milestone payment",
        tags: ["consulting", "project", "global-dynamics"]
      },
      {
        id: "txn-004",
        date: lastWeek,
        description: "Equipment Purchase - Dell Computers",
        amount: "-$3,200.00",
        category: "Equipment",
        account: "Business Checking",
        reconciled: true,
        type: "Withdrawal",
        bankAccount: "bank-1",
        reference: "PO-2025-001",
        memo: "New laptops for development team",
        tags: ["equipment", "computers", "team"]
      },
      {
        id: "txn-005",
        date: lastWeek,
        description: "Marketing Campaign - Google Ads",
        amount: "-$850.00",
        category: "Marketing",
        account: "Business Checking",
        reconciled: true,
        type: "Withdrawal",
        bankAccount: "bank-1",
        reference: "MKT-2025-001",
        memo: "Q1 digital marketing campaign",
        tags: ["marketing", "ads", "digital"]
      }
    ],

    bankAccounts: [
      {
        id: "bank-1",
        name: "Business Checking",
        balance: 145250.75,
        type: "Checking",
        accountNumber: "****1234",
        routingNumber: "021000021",
        bankName: "First Business Bank",
        isActive: true,
        openingDate: "2023-01-15",
        interestRate: 0.25,
        transactions: [
          {
            id: "bank-txn-1",
            date: currentDate,
            description: "Client Payment - TechCorp Solutions",
            amount: "+$12,500.00",
            category: "Revenue",
            account: "Business Checking",
            reconciled: true,
            type: "Deposit",
            reference: "WIRE-2025-001",
            memo: "Project milestone payment - Phase 1 completion"
          },
          {
            id: "bank-txn-2",
            date: lastWeek,
            description: "Payroll Processing",
            amount: "-$18,500.00",
            category: "Payroll",
            account: "Business Checking",
            reconciled: true,
            type: "Withdrawal",
            reference: "PAY-2025-003",
            memo: "Bi-weekly payroll for all employees"
          }
        ]
      },
      {
        id: "bank-2",
        name: "Business Savings",
        balance: 225000.00,
        type: "Savings",
        accountNumber: "****5678",
        routingNumber: "021000021",
        bankName: "First Business Bank",
        isActive: true,
        openingDate: "2023-01-15",
        interestRate: 2.1,
        transactions: []
      },
      {
        id: "bank-3",
        name: "Business Credit Line",
        balance: -5000.00,
        type: "Credit",
        accountNumber: "****9012",
        routingNumber: "021000021",
        bankName: "First Business Bank",
        isActive: true,
        openingDate: "2023-06-01",
        interestRate: 8.5,
        transactions: []
      }
    ],

    accounts: [
      {
        id: "acc-1000",
        number: "1000",
        name: "Cash and Cash Equivalents",
        type: "Asset",
        balance: 370250.75,
        description: "Primary business checking, savings, and petty cash",
        isActive: true,
        taxType: "None"
      },
      {
        id: "acc-1200",
        number: "1200",
        name: "Accounts Receivable",
        type: "Asset",
        balance: 58430.00,
        description: "Money owed by customers for services and products",
        isActive: true,
        taxType: "None"
      },
      {
        id: "acc-1300",
        number: "1300",
        name: "Inventory",
        type: "Asset",
        balance: 25800.00,
        description: "Products and materials held for sale",
        isActive: true,
        taxType: "None"
      },
      {
        id: "acc-1500",
        number: "1500",
        name: "Equipment",
        type: "Asset",
        balance: 45000.00,
        description: "Office equipment, computers, and furniture",
        isActive: true,
        taxType: "None"
      },
      {
        id: "acc-2000",
        number: "2000",
        name: "Accounts Payable",
        type: "Liability",
        balance: 12450.00,
        description: "Money owed to vendors and suppliers",
        isActive: true,
        taxType: "None"
      },
      {
        id: "acc-2100",
        number: "2100",
        name: "Credit Card Payable",
        type: "Liability",
        balance: 3200.00,
        description: "Outstanding credit card balances",
        isActive: true,
        taxType: "None"
      },
      {
        id: "acc-4000",
        number: "4000",
        name: "Service Revenue",
        type: "Income",
        balance: 425750.00,
        description: "Revenue from consulting and professional services",
        isActive: true,
        taxType: "Taxable Income"
      },
      {
        id: "acc-4100",
        number: "4100",
        name: "Product Sales",
        type: "Income",
        balance: 185250.00,
        description: "Revenue from product sales and licenses",
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
      },
      {
        id: "acc-5100",
        number: "5100",
        name: "Payroll Expenses",
        type: "Expense",
        balance: 225000.00,
        description: "Employee salaries, wages, and benefits",
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
        description: "Standard state sales tax rate for California",
        category: "Sales Tax",
        jurisdiction: "California",
        effectiveDate: "2025-01-01"
      },
      {
        id: "tax-2",
        name: "Professional Services Tax",
        rate: 6.0,
        isDefault: false,
        description: "Tax rate for professional consulting services",
        category: "Service Tax",
        jurisdiction: "California",
        effectiveDate: "2025-01-01"
      },
      {
        id: "tax-3",
        name: "Federal Income Tax",
        rate: 21.0,
        isDefault: false,
        description: "Federal corporate income tax rate",
        category: "Income Tax",
        jurisdiction: "Federal",
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
        creditLimit: 75000,
        totalSales: 185000,
        lastOrderDate: currentDate,
        customerSince: "2023-03-15",
        notes: "Premium enterprise client with custom development needs",
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
          },
          {
            id: "contact-2",
            name: "Mike Wilson",
            email: "mike.wilson@techcorp.com",
            phone: "+1 (555) 987-6544",
            role: "Technical Director",
            isPrimary: false
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
        creditLimit: 50000,
        totalSales: 125500,
        lastOrderDate: lastMonth,
        customerSince: "2023-06-20",
        notes: "Fast-growing startup with recurring consulting needs"
      },
      {
        id: "cust-003",
        name: "Innovation Labs",
        email: "finance@innovationlabs.com",
        phone: "+1 (555) 321-9876",
        company: "Innovation Labs Inc.",
        contactName: "Dr. Lisa Chang",
        type: "Business",
        status: "Active",
        address: "321 Research Drive",
        city: "Palo Alto",
        state: "CA",
        postalCode: "94301",
        country: "USA",
        paymentTerms: "Net 30",
        creditLimit: 100000,
        totalSales: 95000,
        lastOrderDate: nextWeek,
        customerSince: "2023-01-10",
        notes: "Research-focused client requiring specialized consulting"
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
        notes: "Custom software development services - Phase 1 completion",
        terms: "Payment due within 30 days. Thank you for your business!",
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
            description: "Project Management & Coordination",
            quantity: 20,
            price: 95,
            total: 1900,
            sku: "PM-001",
            unit: "hours",
            taxRate: 8.25
          },
          {
            id: "item-3",
            description: "Technical Documentation",
            quantity: 6,
            price: 85,
            total: 510,
            sku: "DOC-001",
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
        status: "Sent",
        total: 8750,
        amount: "$8,750.00",
        subtotal: 8101.85,
        taxAmount: 648.15,
        notes: "Monthly consulting retainer - Business process optimization",
        terms: "Payment due within 15 days",
        items: [
          {
            id: "item-4",
            description: "Business Process Consulting",
            quantity: 60,
            price: 115,
            total: 6900,
            sku: "CONS-001",
            unit: "hours",
            taxRate: 8.25
          },
          {
            id: "item-5",
            description: "Strategy Development",
            quantity: 15,
            price: 125,
            total: 1875,
            sku: "STRAT-001",
            unit: "hours",
            taxRate: 8.25
          }
        ]
      },
      {
        id: "inv-003",
        invoiceNumber: "INV-2025-003",
        customer: "Innovation Labs",
        customerId: "cust-003",
        date: lastWeek,
        dueDate: nextMonth,
        status: "Draft",
        total: 15750,
        amount: "$15,750.00",
        subtotal: 14583.33,
        taxAmount: 1166.67,
        notes: "Research consulting and technical analysis services",
        terms: "Payment due within 30 days",
        items: [
          {
            id: "item-6",
            description: "Research & Analysis",
            quantity: 90,
            price: 135,
            total: 12150,
            sku: "RES-001",
            unit: "hours",
            taxRate: 8.25
          },
          {
            id: "item-7",
            description: "Technical Report Writing",
            quantity: 24,
            price: 95,
            total: 2280,
            sku: "REP-001",
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
        vendor: "Office Depot",
        category: "Office Supplies",
        amount: 485.75,
        description: "Monthly office supplies - paper, pens, folders",
        status: "Paid",
        paymentMethod: "Credit Card",
        billNumber: "OD-2025-001",
        accountId: "acc-5000",
        taxAmount: 38.86,
        tags: ["office", "supplies", "monthly"]
      },
      {
        id: "exp-002",
        date: lastMonth,
        vendor: "AWS Cloud Services",
        category: "Software & Subscriptions",
        amount: 1299.99,
        description: "Cloud hosting and database services",
        status: "Paid",
        paymentMethod: "Auto-Pay",
        billNumber: "AWS-2025-001",
        accountId: "acc-5000",
        isBillable: false,
        tags: ["cloud", "hosting", "recurring", "infrastructure"]
      },
      {
        id: "exp-003",
        date: currentDate,
        vendor: "Delta Airlines",
        category: "Travel",
        amount: 1850.00,
        description: "Client meeting travel - San Francisco to New York",
        status: "Pending",
        paymentMethod: "Credit Card",
        isBillable: true,
        projectId: "proj-001",
        tags: ["travel", "client", "billable", "nyc"]
      },
      {
        id: "exp-004",
        date: lastWeek,
        vendor: "Staples Business",
        category: "Equipment",
        amount: 3200.00,
        description: "New laptops for development team",
        status: "Paid",
        paymentMethod: "Bank Transfer",
        billNumber: "SB-2025-001",
        accountId: "acc-1500",
        tags: ["equipment", "computers", "team", "development"]
      },
      {
        id: "exp-005",
        date: lastMonth,
        vendor: "Google Ads",
        category: "Marketing",
        amount: 2500.00,
        description: "Q1 digital marketing campaign",
        status: "Paid",
        paymentMethod: "Credit Card",
        billNumber: "GA-2025-001",
        accountId: "acc-5000",
        tags: ["marketing", "ads", "digital", "q1"]
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
        budget: 125000,
        progress: 75,
        description: "Complete digital transformation including new CRM, automation systems, and mobile app development",
        priority: "High",
        billingRate: 125,
        currency: "USD",
        projectManager: "emp-001",
        tracked: 456.5,
        billed: 48750,
        spent: 25420,
        team: ["emp-001", "emp-002", "emp-003", "emp-004"],
        documents: [
          {
            id: "doc-001",
            name: "Project Charter.pdf",
            type: "document",
            size: "2.4 MB",
            uploadedBy: "emp-001",
            uploadDate: "2025-01-05",
            category: "Planning"
          },
          {
            id: "doc-002",
            name: "Technical Specifications.docx",
            type: "document",
            size: "1.8 MB",
            uploadedBy: "emp-002",
            uploadDate: "2025-01-15",
            category: "Technical"
          }
        ],
        milestones: [
          {
            id: "mile-001",
            name: "Requirements Analysis",
            dueDate: "2025-02-15",
            status: "Completed",
            description: "Complete business requirements gathering and analysis",
            budget: 25000
          },
          {
            id: "mile-002",
            name: "System Design & Architecture",
            dueDate: "2025-03-30",
            status: "In Progress",
            description: "Technical architecture and system design documentation",
            budget: 35000
          },
          {
            id: "mile-003",
            name: "Development Phase 1",
            dueDate: "2025-05-15",
            status: "Not Started",
            description: "Core system development and integration",
            budget: 45000
          }
        ],
        tasks: [
          {
            id: "task-001",
            name: "Database Schema Design",
            assigneeId: "emp-002",
            status: "In Progress",
            priority: "High",
            dueDate: "2025-03-15",
            estimatedHours: 40,
            actualHours: 28,
            milestoneId: "mile-002"
          },
          {
            id: "task-002",
            name: "API Development",
            assigneeId: "emp-003",
            status: "Not Started",
            priority: "Medium",
            dueDate: "2025-04-01",
            estimatedHours: 60,
            actualHours: 0,
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
        budget: 85000,
        progress: 25,
        description: "Automate key business processes to improve efficiency and reduce manual work",
        priority: "Medium",
        billingRate: 115,
        currency: "USD",
        projectManager: "emp-001",
        tracked: 125.5,
        billed: 14425,
        spent: 8200,
        team: ["emp-001", "emp-003", "emp-005"],
        documents: [],
        milestones: [
          {
            id: "mile-004",
            name: "Process Analysis",
            dueDate: "2025-03-30",
            status: "In Progress",
            description: "Analyze current business processes and identify automation opportunities",
            budget: 20000
          }
        ],
        tasks: []
      },
      {
        id: "proj-003",
        name: "Innovation Labs Research Platform",
        client: "Innovation Labs",
        clientId: "cust-003",
        status: "Proposal",
        startDate: "2025-04-01",
        endDate: "2025-12-31",
        budget: 150000,
        progress: 5,
        description: "Develop a comprehensive research data management and analysis platform",
        priority: "High",
        billingRate: 135,
        currency: "USD",
        projectManager: "emp-001",
        tracked: 32.0,
        billed: 4320,
        spent: 1200,
        team: ["emp-001", "emp-002", "emp-004"],
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
        description: "Client requirements meeting and project planning session",
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
        description: "Database schema design and optimization work",
        billable: true,
        startTime: "10:00",
        endTime: "16:30",
        status: "Approved",
        billingRate: 110,
        taskId: "task-001"
      },
      {
        id: "time-003",
        employeeId: "emp-003",
        projectId: "proj-002",
        date: lastWeek,
        hours: 7.5,
        description: "Business process analysis and documentation",
        billable: true,
        startTime: "08:30",
        endTime: "16:00",
        status: "Approved",
        billingRate: 105
      },
      {
        id: "time-004",
        employeeId: "emp-004",
        projectId: "proj-001",
        date: currentDate,
        hours: 4,
        description: "UI/UX design mockups and wireframes",
        billable: true,
        startTime: "13:00",
        endTime: "17:00",
        status: "Pending",
        billingRate: 95
      },
      {
        id: "time-005",
        employeeId: "emp-005",
        projectId: "proj-002",
        date: lastWeek,
        hours: 8,
        description: "Process automation research and tool evaluation",
        billable: true,
        startTime: "09:00",
        endTime: "17:00",
        status: "Approved",
        billingRate: 100
      }
    ],

    employees: [
      {
        id: "emp-001",
        name: "John Smith",
        position: "Senior Project Manager",
        email: "john.smith@acmecorp.com",
        phone: "+1 (555) 123-4567",
        salary: 125000,
        hireDate: "2023-01-15",
        status: "Active",
        payRate: 125,
        payType: "Hourly",
        department: "Project Management",
        skills: ["Project Management", "Agile", "Scrum", "Client Relations", "Team Leadership"],
        benefits: ["Health Insurance", "401k", "PTO", "Dental"],
        performanceRating: 4.8
      },
      {
        id: "emp-002",
        name: "Sarah Davis",
        position: "Senior Full-Stack Developer",
        email: "sarah.davis@acmecorp.com",
        phone: "+1 (555) 234-5678",
        salary: 115000,
        hireDate: "2023-03-20",
        status: "Active",
        payRate: 110,
        payType: "Hourly",
        department: "Development",
        manager: "emp-001",
        skills: ["React", "Node.js", "Python", "Database Design", "AWS"],
        benefits: ["Health Insurance", "401k", "PTO", "Dental"],
        performanceRating: 4.6
      },
      {
        id: "emp-003",
        name: "Mike Johnson",
        position: "Senior Business Analyst",
        email: "mike.johnson@acmecorp.com",
        phone: "+1 (555) 345-6789",
        salary: 95000,
        hireDate: "2023-06-10",
        status: "Active",
        payRate: 105,
        payType: "Hourly",
        department: "Analysis",
        manager: "emp-001",
        skills: ["Business Analysis", "Requirements Gathering", "Process Design", "Data Analysis"],
        benefits: ["Health Insurance", "401k", "PTO", "Dental"],
        performanceRating: 4.2
      },
      {
        id: "emp-004",
        name: "Emily Rodriguez",
        position: "UI/UX Designer",
        email: "emily.rodriguez@acmecorp.com",
        phone: "+1 (555) 456-7890",
        salary: 85000,
        hireDate: "2023-08-15",
        status: "Active",
        payRate: 95,
        payType: "Hourly",
        department: "Design",
        manager: "emp-001",
        skills: ["UI Design", "UX Research", "Figma", "Adobe Creative Suite", "Prototyping"],
        benefits: ["Health Insurance", "401k", "PTO", "Dental"],
        performanceRating: 4.4
      },
      {
        id: "emp-005",
        name: "David Chen",
        position: "DevOps Engineer",
        email: "david.chen@acmecorp.com",
        phone: "+1 (555) 567-8901",
        salary: 105000,
        hireDate: "2023-09-01",
        status: "Active",
        payRate: 100,
        payType: "Hourly",
        department: "Operations",
        manager: "emp-001",
        skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Infrastructure as Code"],
        benefits: ["Health Insurance", "401k", "PTO", "Dental"],
        performanceRating: 4.3
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
            budgeted: 180000,
            actual: 165000,
            isActive: true
          },
          {
            id: "cat-002",
            name: "Consulting Revenue",
            type: "income",
            budgeted: 120000,
            actual: 135500,
            isActive: true
          },
          {
            id: "cat-003",
            name: "Salaries & Benefits",
            type: "expense",
            budgeted: 85000,
            actual: 82500,
            isActive: true
          },
          {
            id: "cat-004",
            name: "Office & Administrative",
            type: "expense",
            budgeted: 25000,
            actual: 22750,
            isActive: true
          },
          {
            id: "cat-005",
            name: "Marketing & Sales",
            type: "expense",
            budgeted: 35000,
            actual: 28500,
            isActive: true
          }
        ],
        totalBudgeted: "$265,000.00",
        totalActual: "$234,250.00",
        variance: "$30,750.00"
      },
      {
        id: "budget-002",
        name: "Annual 2025 Budget",
        period: "Annual",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        status: "Active",
        owner: "emp-001",
        department: "Finance",
        categories: [
          {
            id: "cat-006",
            name: "Total Revenue",
            type: "income",
            budgeted: 1200000,
            actual: 300500,
            isActive: true
          },
          {
            id: "cat-007",
            name: "Operating Expenses",
            type: "expense",
            budgeted: 850000,
            actual: 185250,
            isActive: true
          }
        ],
        totalBudgeted: "$1,200,000.00",
        totalActual: "$485,750.00",
        variance: "$714,250.00"
      }
    ],

    estimates: [
      {
        id: "est-001",
        estimateNumber: "EST-2025-001",
        customer: "Startup Inc.",
        date: currentDate,
        expiryDate: nextMonth,
        status: "Sent",
        total: 45000,
        amount: "$45,000.00",
        validUntil: nextMonth,
        probability: 75,
        followUpDate: "2025-02-15",
        notes: "Custom mobile app development with backend API integration",
        items: [
          {
            id: "est-item-1",
            description: "Mobile App Development (iOS & Android)",
            quantity: 280,
            price: 125,
            total: 35000,
            sku: "MOBILE-001",
            unit: "hours"
          },
          {
            id: "est-item-2",
            description: "Backend API Development",
            quantity: 80,
            price: 115,
            total: 9200,
            sku: "API-001",
            unit: "hours"
          },
          {
            id: "est-item-3",
            description: "Testing & QA",
            quantity: 32,
            price: 95,
            total: 3040,
            sku: "QA-001",
            unit: "hours"
          }
        ]
      },
      {
        id: "est-002",
        estimateNumber: "EST-2025-002",
        customer: "MedTech Solutions",
        date: lastWeek,
        expiryDate: nextMonth,
        status: "Draft",
        total: 85000,
        amount: "$85,000.00",
        validUntil: nextMonth,
        probability: 60,
        followUpDate: "2025-02-20",
        notes: "Healthcare management system with HIPAA compliance",
        items: [
          {
            id: "est-item-4",
            description: "Healthcare System Development",
            quantity: 400,
            price: 145,
            total: 58000,
            sku: "HEALTH-001",
            unit: "hours"
          },
          {
            id: "est-item-5",
            description: "HIPAA Compliance Implementation",
            quantity: 120,
            price: 155,
            total: 18600,
            sku: "HIPAA-001",
            unit: "hours"
          },
          {
            id: "est-item-6",
            description: "Security Audit & Testing",
            quantity: 80,
            price: 135,
            total: 10800,
            sku: "SEC-001",
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
      },
      {
        id: "sale-002",
        date: lastMonth,
        customer: "Global Dynamics",
        customerId: "cust-002",
        amount: 8750,
        status: "Completed",
        paymentMethod: "Credit Card",
        salesRep: "emp-001",
        channel: "Direct",
        items: [
          {
            id: "sale-item-2",
            itemId: "srv-002",
            quantity: 1,
            unitPrice: 8750,
            total: 8750
          }
        ]
      },
      {
        id: "sale-003",
        date: lastWeek,
        customer: "Innovation Labs",
        customerId: "cust-003",
        amount: 15750,
        status: "Pending",
        paymentMethod: "Bank Transfer",
        salesRep: "emp-001",
        channel: "Direct",
        items: [
          {
            id: "sale-item-3",
            itemId: "srv-003",
            quantity: 1,
            unitPrice: 15750,
            total: 15750
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
          description: "Annual enterprise software license with full support",
          images: ["https://images.unsplash.com/photo-1461749280684-dccba630e2f6"],
          lastRestocked: lastMonth
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
          description: "Comprehensive professional services package including consulting and support",
          images: ["https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"],
          lastRestocked: currentDate
        },
        {
          id: "inv-003",
          name: "Development Workstation",
          sku: "DWS-001",
          quantity: 15,
          price: 3200,
          cost: 2400,
          category: "Hardware",
          location: "Office",
          supplier: "Dell Technologies",
          reorderLevel: 5,
          maxStock: 30,
          unit: "each",
          description: "High-performance development workstation with 32GB RAM and SSD",
          images: ["https://images.unsplash.com/photo-1518770660439-4636190af475"],
          lastRestocked: lastWeek
        },
        {
          id: "inv-004",
          name: "Cloud Storage Credits",
          sku: "CSC-001",
          quantity: 100,
          price: 150,
          cost: 75,
          category: "Cloud Services",
          location: "Digital",
          supplier: "AWS",
          reorderLevel: 20,
          maxStock: 200,
          unit: "credit",
          description: "Monthly cloud storage and compute credits",
          lastRestocked: currentDate
        }
      ],
      categories: ["Software", "Services", "Hardware", "Cloud Services", "Consulting", "Equipment"],
      locations: ["Digital", "Virtual", "Office", "Warehouse", "Remote"],
      bundles: [
        {
          id: "bundle-001",
          name: "Complete Development Suite",
          items: [
            { itemId: "inv-001", quantity: 1 },
            { itemId: "inv-003", quantity: 1 },
            { itemId: "inv-004", quantity: 10 }
          ],
          price: 7500,
          sku: "CDS-001",
          description: "Everything needed for a complete development environment"
        }
      ],
      serialNumbers: [
        {
          id: "serial-001",
          itemId: "inv-003",
          serialNumber: "DWS-2025-001",
          status: "In Stock",
          location: "Office"
        },
        {
          id: "serial-002",
          itemId: "inv-003",
          serialNumber: "DWS-2025-002",
          status: "Assigned",
          location: "Office",
          soldTo: "emp-002",
          saleDate: lastMonth
        }
      ],
      lotTracking: [
        {
          id: "lot-001",
          itemId: "inv-001",
          lotNumber: "ESL-2025-Q1",
          quantity: 25,
          expiryDate: "2025-12-31",
          receivedDate: lastMonth,
          supplierId: "sup-001"
        }
      ],
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
        },
        {
          id: "sup-002",
          name: "Dell Technologies",
          email: "business@dell.com",
          phone: "+1 (800) 999-3355",
          address: "456 Hardware Avenue, Austin, TX 78759",
          contactPerson: "Maria Garcia",
          paymentTerms: "Net 15",
          rating: 4.7
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
          totalPaid: 28500,
          payDate: "2025-01-20",
          totalGross: 35000,
          totalNet: 28500,
          totalTaxes: 5200,
          totalDeductions: 1300,
          employees: [
            {
              id: "pe-001",
              employeeId: "emp-001",
              hoursWorked: 80,
              grossPay: 10000,
              netPay: 8200,
              federalTax: 1200,
              stateTax: 400,
              socialSecurity: 620,
              medicare: 145
            },
            {
              id: "pe-002",
              employeeId: "emp-002",
              hoursWorked: 80,
              grossPay: 8800,
              netPay: 7200,
              federalTax: 1056,
              stateTax: 352,
              socialSecurity: 546,
              medicare: 128
            }
          ]
        },
        {
          id: "pay-002",
          startDate: "2025-01-16",
          endDate: "2025-01-31",
          status: "Processing",
          totalPaid: 0,
          payDate: "2025-02-05",
          totalGross: 32000,
          totalNet: 25600,
          totalTaxes: 4800,
          totalDeductions: 1600,
          employees: []
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
      current: 485750,
      previous: 425000,
      percentChange: 14.3,
      monthlyData: [
        { month: "Jan", revenue: 165000, expenses: 85000, profit: 80000 },
        { month: "Feb", revenue: 155000, expenses: 78000, profit: 77000 },
        { month: "Mar", revenue: 185000, expenses: 92000, profit: 93000 },
        { month: "Apr", revenue: 195000, expenses: 95000, profit: 100000 }
      ]
    },

    profitMargin: {
      value: 35.8,
      trend: 8.2,
      percentChange: 12.1,
      grossMargin: 72.5,
      netMargin: 35.8,
      operatingMargin: 38.2
    },

    outstandingInvoices: {
      amount: 24500,
      percentChange: -8.5,
      count: 2,
      averageDaysOverdue: 12
    },

    activeCustomers: {
      count: 38,
      percentChange: 18.4,
      newCustomers: 6,
      retentionRate: 94.5,
      averageOrderValue: 15850
    },

    leads: [
      {
        id: "lead-001",
        name: "Jennifer Wilson",
        email: "jennifer@innovatetech.com",
        phone: "+1 (555) 999-0000",
        company: "InnovateTech Solutions",
        value: 65000,
        stage: "Qualified",
        source: "Website",
        assignedTo: "emp-001",
        lastContact: currentDate,
        nextFollowUp: "2025-02-10",
        score: 85,
        industry: "Healthcare Technology",
        employees: 150,
        pain_points: ["Manual processes", "Scalability issues", "Data integration"],
        interests: ["Cloud migration", "Process automation", "Mobile solutions"]
      },
      {
        id: "lead-002",
        name: "Robert Martinez",
        email: "robert@futurelogistics.com",
        phone: "+1 (555) 888-1111",
        company: "Future Logistics Corp",
        value: 95000,
        stage: "Proposal",
        source: "Referral",
        assignedTo: "emp-001",
        lastContact: lastWeek,
        nextFollowUp: "2025-02-05",
        score: 92,
        industry: "Logistics & Transportation",
        employees: 300,
        pain_points: ["Inventory tracking", "Route optimization", "Real-time visibility"],
        interests: ["IoT solutions", "AI-powered analytics", "Mobile apps"]
      },
      {
        id: "lead-003",
        name: "Lisa Thompson",
        email: "lisa@greentech.com",
        phone: "+1 (555) 777-2222",
        company: "GreenTech Energy",
        value: 125000,
        stage: "Negotiation",
        source: "Trade Show",
        assignedTo: "emp-001",
        lastContact: currentDate,
        nextFollowUp: "2025-02-08",
        score: 78,
        industry: "Renewable Energy",
        employees: 200,
        pain_points: ["Legacy systems", "Compliance reporting", "Data analytics"],
        interests: ["Sustainability platform", "Regulatory compliance", "Predictive analytics"]
      }
    ],

    opportunities: [
      {
        id: "opp-001",
        name: "Enterprise CRM Implementation",
        customer: "MegaCorp Industries",
        value: 185000,
        probability: 75,
        stage: "Proposal",
        closeDate: "2025-03-15",
        description: "Large-scale CRM implementation with custom integrations and mobile access",
        salesRep: "emp-001",
        source: "Referral",
        nextAction: "Present final proposal and pricing"
      },
      {
        id: "opp-002",
        name: "Supply Chain Optimization Platform",
        customer: "LogiFlow Systems",
        value: 225000,
        probability: 65,
        stage: "Negotiation",
        closeDate: "2025-04-30",
        description: "AI-powered supply chain optimization with real-time tracking",
        salesRep: "emp-001",
        source: "Cold Outreach",
        nextAction: "Schedule executive meeting for contract discussion"
      },
      {
        id: "opp-003",
        name: "Healthcare Data Platform",
        customer: "MedData Solutions",
        value: 350000,
        probability: 55,
        stage: "Discovery",
        closeDate: "2025-06-15",
        description: "HIPAA-compliant healthcare data management and analytics platform",
        salesRep: "emp-001",
        source: "Website",
        nextAction: "Conduct technical requirements workshop"
      }
    ],

    auditTrail: [
      {
        id: "audit-001",
        timestamp: new Date().toISOString(),
        userId: "emp-001",
        action: "Invoice Created",
        entity: "Invoice",
        entityId: "inv-003",
        changes: { status: "Draft", total: 15750 }
      },
      {
        id: "audit-002",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        userId: "emp-002",
        action: "Project Updated",
        entity: "Project",
        entityId: "proj-001",
        changes: { progress: 75, status: "In Progress" }
      },
      {
        id: "audit-003",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        userId: "emp-001",
        action: "Customer Added",
        entity: "Customer",
        entityId: "cust-003",
        changes: { name: "Innovation Labs", status: "Active" }
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
        name: "QuickBooks Online",
        type: "Accounting",
        status: "Connected",
        lastSync: lastWeek,
        syncFrequency: "Daily"
      },
      {
        id: "int-003",
        name: "Mailchimp Marketing",
        type: "Marketing",
        status: "Connected",
        lastSync: currentDate,
        syncFrequency: "Weekly"
      },
      {
        id: "int-004",
        name: "Slack Communication",
        type: "Communication",
        status: "Disconnected",
        syncFrequency: "Real-time"
      }
    ],

    // Enhanced data for additional modules
    vendorBills: [
      {
        id: "bill-001",
        billNumber: "BILL-2025-001",
        vendor: "Office Depot",
        vendorId: "vendor-001",
        date: currentDate,
        dueDate: nextMonth,
        amount: 485.75,
        status: "Pending Approval",
        category: "Office Supplies",
        description: "Monthly office supplies - January 2025",
        items: [
          {
            id: "bill-item-1",
            description: "Paper and printing supplies",
            quantity: 1,
            unitCost: 285.75,
            total: 285.75,
            accountId: "acc-5000"
          },
          {
            id: "bill-item-2",
            description: "Office furniture accessories",
            quantity: 1,
            unitCost: 200.00,
            total: 200.00,
            accountId: "acc-5000"
          }
        ]
      },
      {
        id: "bill-002",
        billNumber: "BILL-2025-002",
        vendor: "AWS Cloud Services",
        vendorId: "vendor-002",
        date: lastMonth,
        dueDate: currentDate,
        amount: 1299.99,
        status: "Paid",
        category: "Software & Subscriptions",
        description: "January 2025 cloud hosting services",
        paidDate: currentDate,
        items: [
          {
            id: "bill-item-3",
            description: "EC2 instances and storage",
            quantity: 1,
            unitCost: 899.99,
            total: 899.99,
            accountId: "acc-5000"
          },
          {
            id: "bill-item-4",
            description: "Database and backup services",
            quantity: 1,
            unitCost: 400.00,
            total: 400.00,
            accountId: "acc-5000"
          }
        ]
      }
    ],

    mileageEntries: [
      {
        id: "mile-001",
        date: currentDate,
        startLocation: "Office - 123 Business Street",
        endLocation: "TechCorp Solutions - 456 Tech Avenue",
        purpose: "Client meeting - project review",
        miles: 25.8,
        rate: 0.67,
        amount: 17.29,
        status: "Approved",
        vehicle: "Company Car #1",
        employeeId: "emp-001",
        isReimbursable: true
      },
      {
        id: "mile-002",
        date: lastWeek,
        startLocation: "Office",
        endLocation: "San Francisco Airport",
        purpose: "Business travel - Innovation Labs meeting",
        miles: 45.2,
        rate: 0.67,
        amount: 30.28,
        status: "Pending",
        vehicle: "Personal Vehicle",
        employeeId: "emp-002",
        isReimbursable: true
      }
    ],

    scannedReceipts: [
      {
        id: "receipt-001",
        fileName: "office_depot_receipt_2025_01.jpg",
        uploadDate: currentDate,
        status: "Completed",
        extractedData: {
          vendor: "Office Depot",
          amount: 485.75,
          date: currentDate,
          category: "Office Supplies",
          items: [
            { description: "Paper supplies", amount: 285.75 },
            { description: "Office accessories", amount: 200.00 }
          ]
        },
        confidence: 95,
        reviewRequired: false
      },
      {
        id: "receipt-002",
        fileName: "travel_expense_receipt.jpg",
        uploadDate: lastWeek,
        status: "Processing",
        confidence: 78,
        reviewRequired: true
      }
    ],

    recurringInvoices: [
      {
        id: "rec-inv-001",
        template: "Monthly Retainer - TechCorp",
        customer: "TechCorp Solutions",
        customerId: "cust-001",
        frequency: "Monthly",
        nextDate: nextMonth,
        amount: 5000,
        status: "Active",
        lastSent: currentDate,
        endDate: "2025-12-31",
        occurrences: 12,
        remainingOccurrences: 10
      },
      {
        id: "rec-inv-002",
        template: "Quarterly Consulting - Global Dynamics",
        customer: "Global Dynamics",
        customerId: "cust-002",
        frequency: "Quarterly",
        nextDate: "2025-04-01",
        amount: 15000,
        status: "Active",
        lastSent: "2025-01-01",
        occurrences: 4,
        remainingOccurrences: 3
      }
    ],

    reportData: {
      financialReports: [
        {
          id: "report-001",
          name: "Profit & Loss Statement",
          type: "P&L",
          period: "Q1 2025",
          data: {
            revenue: 485750,
            expenses: 312250,
            netIncome: 173500,
            margins: { gross: 72.5, net: 35.7 }
          },
          generatedDate: currentDate,
          format: "PDF"
        },
        {
          id: "report-002",
          name: "Balance Sheet",
          type: "Balance Sheet",
          period: "Q1 2025",
          data: {
            assets: 515500,
            liabilities: 95650,
            equity: 419850
          },
          generatedDate: currentDate,
          format: "Excel"
        }
      ],
      customReports: [
        {
          id: "custom-001",
          name: "Project Profitability Analysis",
          description: "Detailed analysis of project margins and profitability",
          query: "SELECT * FROM projects WHERE status = 'Completed'",
          parameters: [
            { name: "date_range", type: "date", defaultValue: "last_quarter", required: true },
            { name: "client_id", type: "string", required: false }
          ],
          schedule: "Monthly",
          recipients: ["john.smith@acmecorp.com", "finance@acmecorp.com"]
        }
      ]
    },

    taxFilings: [
      {
        id: "tax-001",
        taxYear: "2024",
        type: "Corporate Income Tax",
        status: "Filed",
        filedDate: "2025-01-15",
        dueDate: "2025-03-15",
        refundAmount: 0,
        owedAmount: 25000,
        forms: [
          {
            id: "form-001",
            formType: "Form 1120",
            data: { grossReceipts: 2500000, taxableIncome: 425000 },
            status: "Filed",
            filedDate: "2025-01-15"
          }
        ]
      }
    ]
  };
};

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentCompany, setCurrentCompany] = useState<Company>(createComprehensiveDemoData());

  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (savedData && Object.keys(savedData).length > 0) {
      console.log('Data loaded from local storage', savedData);
      setCurrentCompany(savedData);
    } else {
      console.log('Using comprehensive demo data');
      const demoData = createComprehensiveDemoData();
      setCurrentCompany(demoData);
      saveToLocalStorage(demoData);
    }
  }, []);

  useEffect(() => {
    saveToLocalStorage(currentCompany);
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
