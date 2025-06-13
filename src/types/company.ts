

export interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
  industry: string;
  
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
  inventory?: InventoryItem[];
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
  amount?: string;
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
  price?: number;
  amount: number;
  total?: number;
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
  status: 'Active' | 'Completed' | 'On Hold';
  startDate: string;
  endDate?: string;
  budget: number;
  description?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  department: string;
  salary: number;
  hireDate: string;
  status: 'Active' | 'Inactive';
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
  amount: string;
  type: 'Debit' | 'Credit' | 'Deposit' | 'Withdrawal';
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
  amount: number;
  period: string;
  category: string;
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
  date: string;
  expiryDate: string;
  items: InvoiceItem[];
  total: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Declined';
}

export interface TimeEntry {
  id: string;
  projectId: string;
  employeeId: string;
  date: string;
  hours: number;
  description: string;
  billable: boolean;
}

export interface Sale {
  id: string;
  date: string;
  customer: string;
  amount: number;
  status: 'Completed' | 'Pending';
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
}

export interface Bundle {
  id: string;
  name: string;
  description?: string;
  items: BundleItem[];
  totalCost: number;
  sellingPrice: number;
  status: 'Active' | 'Inactive';
}

export interface BundleItem {
  id: string;
  inventoryItemId: string;
  quantity: number;
  unitCost: number;
}

export interface LotTrack {
  id: string;
  lotNumber: string;
  inventoryItemId: string;
  quantity: number;
  expirationDate?: string;
  supplier?: string;
  receivedDate: string;
  status: 'Available' | 'Reserved' | 'Expired';
}

export interface SerialNumber {
  id: string;
  serialNumber: string;
  inventoryItemId: string;
  status: 'Available' | 'Sold' | 'Reserved' | 'Defective';
  receivedDate: string;
  soldDate?: string;
  customerId?: string;
}

