export interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
  industry: string;
  fiscalYearStart?: string;
  fiscalYear?: string;
  
  customers?: Customer[];
  invoices?: Invoice[];
  expenses?: Expense[];
  projects?: Project[];
  employees?: Employee[];
  bankAccounts?: BankAccount[];
  accounts?: Account[];
  taxRates?: TaxRate[];
  budgets?: Budget[];
  estimates?: Estimate[];
  timeEntries?: TimeEntry[];
  sales?: Sale[];
  transactions?: Transaction[];
  inventory?: {
    items: InventoryItem[];
    bundles: Bundle[];
    serialNumbers: SerialNumber[];
    lotTracking: LotTrack[];
    suppliers?: Supplier[];
  };
  revenue?: {
    current: number;
    previous: number;
    percentChange: number;
  };
  profitMargin?: {
    value: number;
    previous: number;
    percentChange: number;
  };
  outstandingInvoices?: {
    amount: number;
    percentChange: number;
  };
  activeCustomers?: {
    count: number;
    percentChange: number;
  };
  payrollData?: {
    totalPayroll: number;
    employeeCount: number;
    averageSalary: number;
    payPeriods?: PayPeriod[];
    taxSettings?: any;
    deductionTypes?: any;
  };
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  paymentTerms?: string;
  status: 'Active' | 'Inactive';
  customerSince: string;
  totalSales?: number;
  contactName?: string;
  type?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber?: string;
  customerId?: string;
  customer: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax?: number;
  taxAmount?: number;
  total: number;
  amount?: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Pending' | 'Outstanding';
  paymentStatus?: string;
  notes?: string;
  terms?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Expense {
  id: string;
  date: string;
  vendor: string;
  category: string;
  description: string;
  amount: number | string;
  paymentMethod: string;
  status: 'Pending' | 'Paid' | 'Approved' | 'Rejected';
  receiptUrl?: string;
  billNumber?: string;
  dueDate?: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  client: string;
  status: 'Active' | 'Completed' | 'On Hold' | 'In Progress' | 'Planning';
  startDate: string;
  endDate?: string;
  budget: number;
  description?: string;
  priority?: 'Low' | 'Medium' | 'High';
  billed?: number;
  tracked?: number;
  progress?: number;
  teamMembers?: string[];
  team?: string[];
  tasks?: ProjectTask[];
  milestones?: ProjectMilestone[];
  documents?: ProjectDocument[];
  projectManager?: string;
  billingRate?: number;
}

export interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  status: 'Todo' | 'In Progress' | 'Done';
  assignedTo?: string;
  dueDate?: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: 'Pending' | 'Completed';
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  url?: string;
  uploadedBy: string;
  uploadDate?: string;
  date?: string;
  lastModified?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  position: string;
  department: string;
  salary: number;
  payRate?: number;
  payType?: 'Hourly' | 'Salary';
  manager?: string;
  emergencyContact?: string;
  benefits?: string[];
  skills?: string[];
  hireDate: string;
  status: 'Active' | 'Inactive' | 'Pending';
}

export interface BankAccount {
  id: string;
  name: string;
  type: string;
  balance: number;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  transactions: Transaction[];
  isActive?: boolean;
  openingDate?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number | string;
  type: 'Debit' | 'Credit' | 'Deposit' | 'Withdrawal' | 'Transfer';
  category: string;
  account: string;
  bankAccount?: string;
  reconciled?: boolean;
  reference?: string;
  memo?: string;
}

export interface Account {
  id: string;
  number?: string;
  name: string;
  type: string;
  balance: number;
  description?: string;
}

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  isDefault?: boolean;
  description?: string;
  category?: string;
  jurisdiction?: string;
  effectiveDate?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  budgeted: number;
  actual: number;
  budgetedAmount?: string;
  actualAmount?: string;
}

export interface Budget {
  id: string;
  name: string;
  amount?: number;
  period: string;
  category?: string;
  categories?: BudgetCategory[];
  startDate?: string;
  endDate?: string;
  status?: 'Draft' | 'Active' | 'Completed';
  totalBudgeted?: string;
  totalActual?: string;
  variance?: string;
}

export interface Estimate {
  id: string;
  estimateNumber: string;
  customerId: string;
  customer?: string;
  date: string;
  expiryDate: string;
  items: EstimateItem[];
  total: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Declined';
}

export interface EstimateItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  amount: number;
}

export interface TimeEntry {
  id: string;
  projectId: string;
  employeeId: string;
  date: string;
  hours: number;
  description: string;
  billable: boolean;
  status?: 'Draft' | 'Submitted' | 'Approved';
  billingRate?: number;
  startTime?: string;
  endTime?: string;
  hourlyRate?: number;
}

export interface Sale {
  id: string;
  date: string;
  customer: string;
  customerId?: string;
  amount: number;
  status: 'Completed' | 'Pending';
  paymentMethod?: string;
  notes?: string;
  items?: SaleItem[];
}

export interface PayPeriod {
  id: string;
  startDate: string;
  endDate: string;
  payDate: string;
  status: 'Processing' | 'Completed' | 'Current';
  employees?: PayrollEmployee[];
  totalGross?: string | number;
  totalNet?: string | number;
  totalTaxes?: string | number;
  totalDeductions?: string | number;
  totalPaid?: string | number;
}

export interface PayrollEmployee {
  employeeId: string;
  grossPay: string | number;
  netPay: string | number;
  taxes: string | number;
  deductions: string | number;
}

export interface PayrollData {
  totalPayroll: number;
  employeeCount: number;
  averageSalary: number;
  payPeriods?: PayPeriod[];
  taxSettings?: any;
  deductionTypes?: any;
}

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

// Inventory related interfaces
export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  description?: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  supplier?: string;
  location?: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  reorderPoint?: number;
  reorderQuantity?: number;
  lastUpdated: string;
  barcode?: string;
  price?: number;
  cost?: number;
  reorderLevel?: number;
  maxLevel?: number;
  maxStock?: number;
  unit?: string;
  weight?: number;
  dimensions?: string;
  taxable?: boolean;
  trackSerial?: boolean;
  trackLots?: boolean;
  images?: string[];
  customFields?: Record<string, string>;
  stockMovements?: Array<{
    id: string;
    type: 'in' | 'out' | 'adjustment';
    quantity: number;
    date: string;
    reason: string;
    reference: string;
  }>;
}

export interface Bundle {
  id: string;
  name: string;
  sku?: string;
  description?: string;
  items: BundleItem[];
  totalCost: number;
  sellingPrice: number;
  price?: number;
  status: 'Active' | 'Inactive';
}

export interface BundleItem {
  id: string;
  inventoryItemId: string;
  itemId?: string;
  quantity: number;
  unitCost: number;
}

export interface LotTrack {
  id: string;
  lotNumber: string;
  inventoryItemId: string;
  itemId?: string;
  quantity: number;
  expirationDate?: string;
  expiryDate?: string;
  supplier?: string;
  supplierId?: string;
  receivedDate: string;
  status: 'Available' | 'Reserved' | 'Expired';
}

export interface SerialNumber {
  id: string;
  serialNumber: string;
  inventoryItemId: string;
  itemId?: string;
  status: 'Available' | 'Sold' | 'Reserved' | 'Defective';
  receivedDate: string;
  soldDate?: string;
  customerId?: string;
  location?: string;
  soldTo?: string;
  saleDate?: string;
}

export interface SaleItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  amount: number;
}
