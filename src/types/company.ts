
// Company and related types
export interface Company {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  taxId?: string;
  industry?: string;
  fiscalYearStart?: string;
  transactions: Transaction[];
  accounts: Account[];
  taxRates: TaxRate[];
  bankAccounts: BankAccount[];
  customers?: Customer[];
  invoices?: Invoice[];
  expenses?: Expense[];
  projects?: Project[];
  timeEntries?: TimeEntry[];
  employees?: Employee[];
  inventory?: InventoryData;
  budgets?: Budget[];
  estimates?: Estimate[];
  payrollData?: PayrollData;
  auditTrail?: any[];
  integrations?: any[];
  sales?: any[];
  revenue?: RevenueData;
  profitMargin?: ProfitMarginData;
  outstandingInvoices?: OutstandingInvoicesData;
  activeCustomers?: ActiveCustomersData;
}

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  isDefault: boolean;
  description?: string;
  category?: string;
}

export interface BankAccount {
  id: string;
  name: string;
  balance: number | string;
  transactions: Transaction[];
  type?: string;
  lastTransaction?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: string;
  category: string;
  account: string;
  reconciled: boolean;
  type: "Deposit" | "Withdrawal" | "Transfer";
  bankAccount?: string;
}

export interface Account {
  id: string;
  number: string;
  name: string;
  type: string;
  balance: number;
  description: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
}

export interface Invoice {
  id: string;
  customer: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  status: string;
  total: number;
  amount: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Expense {
  id: string;
  date: string;
  vendor: string;
  category: string;
  amount: number;
  description: string;
  status: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  status: string;
  startDate: string;
  endDate?: string;
  budget?: number;
  documents: ProjectDocument[];
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy?: string;
  date?: string;
  uploadDate?: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  salary: number;
  hireDate: string;
  status: string;
}

export interface TimeEntry {
  id: string;
  employeeId: string;
  projectId: string;
  date: string;
  hours: number;
  description: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  cost: number;
  category: string;
  location?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  type: "income" | "expense";
  budgeted: number;
  actual: number;
}

export interface Budget {
  id: string;
  name: string;
  period?: string;
  startDate: string;
  endDate: string;
  categories: BudgetCategory[];
  status: string;
  totalBudgeted?: string;
  totalActual?: string;
  variance?: string;
}

export interface Estimate {
  id: string;
  customer: string;
  date: string;
  expiryDate: string;
  items: InvoiceItem[];
  status: string;
  total: number;
}

export interface PayPeriod {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  totalPaid: number;
  payDate?: string;
  employees?: any[];
  totalGross?: number;
}

export interface PayrollData {
  payPeriods: PayPeriod[];
}

export interface RevenueData {
  current: number;
  previous: number;
  percentChange: number;
}

export interface ProfitMarginData {
  value: number;
  trend: number;
  percentChange: number;
}

export interface OutstandingInvoicesData {
  amount: number;
  percentChange: number;
}

export interface ActiveCustomersData {
  count: number;
  percentChange: number;
}

export interface InventoryData {
  items: InventoryItem[];
  categories: string[];
  locations: string[];
  bundles: any[];
  serialNumbers: any[];
  lotTracking: any[];
}
