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
  fiscalYear?: string;
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
  auditTrail?: AuditEntry[];
  integrations?: Integration[];
  sales?: Sale[];
  revenue?: RevenueData;
  profitMargin?: ProfitMarginData;
  outstandingInvoices?: OutstandingInvoicesData;
  activeCustomers?: ActiveCustomersData;
  
  // New advanced features
  leads?: Lead[];
  opportunities?: Opportunity[];
  bankConnections?: BankConnection[];
  users?: User[];
  roles?: Role[];
  paymentTemplates?: PaymentTemplate[];
  recurringInvoices?: RecurringInvoice[];
  mileageEntries?: MileageEntry[];
  vendorBills?: VendorBill[];
  scannedReceipts?: ScannedReceipt[];
  reportData?: ReportData;
  taxFilings?: TaxFiling[];
}

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  isDefault: boolean;
  description?: string;
  category?: string;
  jurisdiction?: string;
  effectiveDate?: string;
  expiryDate?: string;
}

export interface BankAccount {
  id: string;
  name: string;
  balance: number | string;
  transactions: Transaction[];
  type?: string;
  lastTransaction?: string;
  accountNumber?: string;
  routingNumber?: string;
  bankName?: string;
  isActive?: boolean;
  openingDate?: string;
  interestRate?: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: string;
  category: string;
  account: string;
  reconciled: boolean;
  type: "Deposit" | "Withdrawal" | "Transfer" | "Credit" | "Debit";
  bankAccount?: string;
  reference?: string;
  memo?: string;
  attachments?: string[];
  tags?: string[];
  location?: string;
  merchant?: string;
}

export interface Account {
  id: string;
  number: string;
  name: string;
  type: string;
  balance: number;
  description: string;
  parentAccount?: string;
  isActive?: boolean;
  taxType?: string;
  defaultTaxRate?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  contactName?: string;
  type?: string;
  status?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  website?: string;
  taxId?: string;
  paymentTerms?: string;
  creditLimit?: number;
  totalSales?: number;
  lastOrderDate?: string;
  customerSince?: string;
  notes?: string;
  billingAddress?: Address;
  shippingAddress?: Address;
  contacts?: Contact[];
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isPrimary: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber?: string;
  customer: string;
  customerId?: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  status: string;
  total: number;
  amount: string;
  subtotal?: number;
  taxAmount?: number;
  discountAmount?: number;
  notes?: string;
  terms?: string;
  poNumber?: string;
  paymentStatus?: string;
  paymentDate?: string;
  paymentMethod?: string;
  lateFees?: number;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
  sku?: string;
  unit?: string;
  taxRate?: number;
  discountPercent?: number;
}

export interface Expense {
  id: string;
  date: string;
  vendor: string;
  category: string;
  amount: number | string;
  description: string;
  status: string;
  paymentMethod?: string;
  receipt?: string;
  billNumber?: string;
  dueDate?: string;
  accountId?: string;
  taxAmount?: number;
  isBillable?: boolean;
  projectId?: string;
  approvedBy?: string;
  submittedBy?: string;
  tags?: string[];
}

export interface Project {
  id: string;
  name: string;
  client: string;
  clientId?: string;
  status: string;
  startDate: string;
  endDate?: string;
  budget?: number;
  documents: ProjectDocument[];
  tracked?: number | string;
  billed?: number | string | boolean;
  spent?: number | string;
  progress?: number;
  team?: string[];
  teamMembers?: string[];
  description?: string;
  priority?: string;
  billingRate?: number;
  currency?: string;
  projectManager?: string;
  milestones?: Milestone[];
  tasks?: Task[];
}

export interface Milestone {
  id: string;
  name: string;
  dueDate: string;
  date?: string;
  status: string;
  completed?: boolean;
  description?: string;
  budget?: number;
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  assigneeId?: string;
  assignee?: string;
  status: string;
  priority: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  milestoneId?: string;
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  url?: string;
  uploadedBy?: string;
  date?: string;
  uploadDate?: string;
  lastModified?: string;
  category?: string;
  version?: number;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  salary?: number;
  hireDate?: string;
  status: string;
  payRate?: string | number;
  payType?: string;
  email?: string;
  phone?: string;
  address?: string;
  emergencyContact?: string;
  department?: string;
  manager?: string;
  skills?: string[];
  benefits?: string[];
  performanceRating?: number;
}

export interface TimeEntry {
  id: string;
  employeeId: string;
  projectId: string;
  date: string;
  hours: number;
  description: string;
  billable?: boolean;
  duration?: number | string;
  startTime?: string;
  endTime?: string;
  status?: string;
  taskId?: string;
  billingRate?: number;
  hourlyRate?: number;
  location?: string;
  approvedBy?: string;
  invoiceId?: string;
  tags?: string[];
  amount?: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number | string;
  cost: number | string;
  category: string;
  location?: string;
  supplier?: string;
  reorderLevel?: number;
  maxStock?: number;
  maxLevel?: number;
  unit?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  description?: string;
  images?: string[];
  lastRestocked?: string;
  expiryDate?: string;
  taxable?: boolean;
  trackSerial?: boolean;
  trackLots?: boolean;
  customFields?: Record<string, string>;
  stockMovements?: Array<{
    id: string;
    type: 'in' | 'out' | 'adjustment';
    quantity: number;
    date: string;
    reason: string;
    reference: string;
  }>;
  lastUpdated?: string;
  status?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  type: "income" | "expense";
  budgeted: number;
  actual: number;
  budgetedAmount?: string;
  actualAmount?: string;
  parentCategory?: string;
  isActive?: boolean;
  notes?: string;
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
  owner?: string;
  department?: string;
  approvedBy?: string;
  version?: number;
}

export interface Estimate {
  id: string;
  estimateNumber?: string;
  customer: string;
  customerId?: string;
  date: string;
  expiryDate: string;
  items: InvoiceItem[];
  status: string;
  total: number;
  notes?: string;
  termsAndConditions?: string;
  amount?: string;
  validUntil?: string;
  probability?: number;
  followUpDate?: string;
  convertedToInvoice?: boolean;
  declineReason?: string;
}

export interface PayPeriod {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  totalPaid: number;
  payDate?: string;
  employees?: PayrollEmployee[];
  totalGross?: number | string;
  totalNet?: number;
  totalTaxes?: number;
  totalDeductions?: number;
  payrollRun?: string;
  approvedBy?: string;
}

export interface PayrollEmployee {
  id: string;
  employeeId: string;
  hoursWorked: number;
  overtimeHours?: number;
  grossPay: number;
  netPay: number;
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  deductions?: PayrollDeduction[];
}

export interface PayrollDeduction {
  id: string;
  name: string;
  amount: number;
  type: string;
  isPreTax: boolean;
}

export interface PayrollData {
  payPeriods: PayPeriod[];
  taxSettings?: TaxSettings;
  deductionTypes?: DeductionType[];
}

export interface TaxSettings {
  federalRate: number;
  stateRate: number;
  socialSecurityRate: number;
  medicareRate: number;
  unemploymentRate: number;
}

export interface DeductionType {
  id: string;
  name: string;
  type: string;
  isPreTax: boolean;
  defaultAmount?: number;
}

export interface RevenueData {
  current: number;
  previous: number;
  percentChange: number;
  monthlyData?: MonthlyRevenue[];
  breakdown?: RevenueBreakdown[];
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface RevenueBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface ProfitMarginData {
  value: number;
  trend: number;
  percentChange: number;
  grossMargin?: number;
  netMargin?: number;
  operatingMargin?: number;
}

export interface OutstandingInvoicesData {
  amount: number;
  percentChange: number;
  count?: number;
  averageDaysOverdue?: number;
  aging?: AgingBucket[];
}

export interface AgingBucket {
  range: string;
  amount: number;
  count: number;
}

export interface ActiveCustomersData {
  count: number;
  percentChange: number;
  newCustomers?: number;
  retentionRate?: number;
  averageOrderValue?: number;
}

export interface InventoryData {
  items: InventoryItem[];
  categories: string[];
  locations: string[];
  bundles: Bundle[];
  serialNumbers: SerialNumber[];
  lotTracking: LotTrack[];
  suppliers?: Supplier[];
  stockMovements?: StockMovement[];
}

export interface Bundle {
  id: string;
  name: string;
  items: BundleItem[];
  price: number;
  sku: string;
  description?: string;
}

export interface BundleItem {
  itemId: string;
  quantity: number;
}

export interface SerialNumber {
  id: string;
  itemId: string;
  serialNumber: string;
  status: string;
  location?: string;
  soldTo?: string;
  saleDate?: string;
}

export interface LotTrack {
  id: string;
  itemId: string;
  lotNumber: string;
  quantity: number;
  expiryDate?: string;
  receivedDate: string;
  supplierId?: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  paymentTerms: string;
  rating?: number;
}

export interface StockMovement {
  id: string;
  itemId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  date: string;
  reference: string;
  reason?: string;
  location?: string;
}

export interface Sale {
  id: string;
  date: string;
  customer: string;
  customerId?: string;
  amount: number | string;
  status: string;
  items?: SaleItem[];
  paymentMethod?: string;
  salesRep?: string;
  channel?: string;
  discount?: number;
  taxAmount?: number;
  shipping?: number;
  notes?: string;
}

export interface SaleItem {
  id: string;
  itemId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  discount?: number;
}

// New interfaces for advanced features
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  value: number;
  stage: "New" | "Qualified" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost";
  source: string;
  assignedTo: string;
  lastContact: string;
  nextFollowUp?: string;
  notes?: string;
  score?: number;
  industry?: string;
  website?: string;
  employees?: number;
  pain_points?: string[];
  interests?: string[];
}

export interface Opportunity {
  id: string;
  name: string;
  customer: string;
  customerId?: string;
  value: number;
  probability: number;
  stage: string;
  closeDate: string;
  description: string;
  salesRep?: string;
  source?: string;
  competitors?: string[];
  nextAction?: string;
  lastActivity?: string;
}

export interface BankConnection {
  id: string;
  bankName: string;
  accountType: string;
  accountNumber: string;
  status: "Connected" | "Disconnected" | "Error";
  lastSync: string;
  autoSync: boolean;
  balance?: number;
  currency?: string;
  connectionType?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Manager" | "User" | "Viewer";
  permissions: string[];
  status: "Active" | "Inactive" | "Pending";
  lastLogin: string;
  department: string;
  phone?: string;
  avatar?: string;
  timezone?: string;
  language?: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
  description: string;
  isSystem?: boolean;
  createdBy?: string;
  userCount?: number;
}

export interface PaymentTemplate {
  id: string;
  name: string;
  description: string;
  amount: number;
  frequency: string;
  isActive: boolean;
  nextDue?: string;
  customer?: string;
  paymentMethod?: string;
  autoProcess?: boolean;
}

export interface RecurringInvoice {
  id: string;
  template: string;
  customer: string;
  customerId?: string;
  frequency: string;
  nextDate: string;
  amount: number;
  status: string;
  lastSent?: string;
  endDate?: string;
  occurrences?: number;
  remainingOccurrences?: number;
}

export interface MileageEntry {
  id: string;
  date: string;
  startLocation: string;
  endLocation: string;
  purpose: string;
  miles: number;
  rate: number;
  amount: number;
  status: string;
  vehicle?: string;
  employeeId?: string;
  receipt?: string;
  isReimbursable?: boolean;
}

export interface VendorBill {
  id: string;
  billNumber: string;
  vendor: string;
  vendorId?: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "Draft" | "Pending Approval" | "Approved" | "Paid" | "Overdue";
  category: string;
  description: string;
  poNumber?: string;
  items?: BillItem[];
  approvedBy?: string;
  paidDate?: string;
}

export interface BillItem {
  id: string;
  description: string;
  quantity: number;
  unitCost: number;
  total: number;
  accountId?: string;
}

export interface ScannedReceipt {
  id: string;
  fileName: string;
  uploadDate: string;
  status: "Processing" | "Completed" | "Failed";
  extractedData?: {
    vendor: string;
    amount: number;
    date: string;
    category: string;
    items?: ReceiptItem[];
  };
  confidence?: number;
  reviewRequired?: boolean;
}

export interface ReceiptItem {
  description: string;
  amount: number;
  category?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
}

export interface Integration {
  id: string;
  name: string;
  type: string;
  status: "Connected" | "Disconnected" | "Error";
  lastSync?: string;
  settings?: any;
  syncFrequency?: string;
}

export interface ReportData {
  financialReports?: FinancialReport[];
  customReports?: CustomReport[];
  dashboards?: Dashboard[];
}

export interface FinancialReport {
  id: string;
  name: string;
  type: string;
  period: string;
  data: any;
  generatedDate: string;
  format?: string;
}

export interface CustomReport {
  id: string;
  name: string;
  description: string;
  query: string;
  parameters?: ReportParameter[];
  schedule?: string;
  recipients?: string[];
}

export interface ReportParameter {
  name: string;
  type: string;
  defaultValue?: any;
  required: boolean;
}

export interface Dashboard {
  id: string;
  name: string;
  widgets: Widget[];
  isDefault?: boolean;
  owner?: string;
}

export interface Widget {
  id: string;
  type: string;
  title: string;
  config: any;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface TaxFiling {
  id: string;
  taxYear: string;
  type: string;
  status: "Draft" | "Filed" | "Accepted" | "Rejected";
  filedDate?: string;
  dueDate: string;
  refundAmount?: number;
  owedAmount?: number;
  forms?: TaxForm[];
}

export interface TaxForm {
  id: string;
  formType: string;
  data: any;
  status: string;
  filedDate?: string;
}
