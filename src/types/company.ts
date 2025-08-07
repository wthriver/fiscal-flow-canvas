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
  
  // Enhanced Company Settings
  logo?: string;
  currency: string;
  dateFormat: string;
  timeZone: string;
  businessType: 'LLC' | 'Corporation' | 'Partnership' | 'Sole Proprietorship' | 'Other';
  ein?: string;
  stateOfIncorporation?: string;
  incorporationDate?: string;
  accountingMethod: 'Cash' | 'Accrual';
  payrollSettings?: PayrollSettings;
  taxSettings?: TaxSettings;
  bankingSettings?: BankingSettings;
  reportingSettings?: ReportingSettings;
  
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
  vendors?: Vendor[];
  purchaseOrders?: PurchaseOrder[];
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
  revenue?: number;
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

// Enhanced Enterprise Interfaces for QuickBooks-like functionality

export interface PayrollSettings {
  payFrequency: 'Weekly' | 'Bi-weekly' | 'Semi-monthly' | 'Monthly';
  federalTaxId: string;
  stateTaxId?: string;
  stateUnemploymentId?: string;
  workersCompId?: string;
  directDepositEnabled: boolean;
  autoCalculateTaxes: boolean;
  payrollServiceProvider?: string;
}

export interface TaxSettings {
  defaultSalesTaxRate: string;
  salesTaxAgency?: string;
  salesTaxNumber?: string;
  taxableByDefault: boolean;
  taxBasis: 'Cash' | 'Accrual';
  multiJurisdictionTax: boolean;
  taxExemptions: TaxExemption[];
  taxCodes: EnhancedTaxRate[];
}

export interface BankingSettings {
  defaultBankAccount?: string;
  enableBankFeeds: boolean;
  autoReconcile: boolean;
  duplicateDetection: boolean;
  bankRules: BankRule[];
  reconciliationSettings: ReconciliationSettings;
}

export interface ReportingSettings {
  defaultReportPeriod: 'Monthly' | 'Quarterly' | 'Yearly';
  consolidateReports: boolean;
  showComparativePeriods: boolean;
  customReportTemplates: CustomReport[];
  scheduledReports: ScheduledReport[];
}

export interface TaxExemption {
  id: string;
  customerId: string;
  exemptionType: string;
  exemptionNumber: string;
  validFrom: string;
  validTo?: string;
  jurisdiction: string;
}

export interface EnhancedTaxRate extends TaxRate {
  jurisdiction: string;
  taxType: 'Sales' | 'Use' | 'VAT' | 'GST' | 'Other';
  compound: boolean;
  includedInPrice: boolean;
  validFrom: string;
  validTo?: string;
  reportingCode?: string;
}

export interface BankRule {
  id: string;
  name: string;
  conditions: BankRuleCondition[];
  actions: BankRuleAction[];
  enabled: boolean;
  priority: number;
}

export interface BankRuleCondition {
  field: 'description' | 'amount' | 'payee';
  operator: 'contains' | 'equals' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than';
  value: string;
}

export interface BankRuleAction {
  type: 'categorize' | 'assign_vendor' | 'assign_customer' | 'add_memo';
  value: string;
}

export interface ReconciliationSettings {
  autoMatchThreshold: number;
  suggestMatches: boolean;
  requireApproval: boolean;
  lockPeriod: number; // days after reconciliation
}

export interface CustomReport {
  id: string;
  name: string;
  type: 'BalanceSheet' | 'ProfitLoss' | 'CashFlow' | 'Custom';
  template: any;
  filters: ReportFilter[];
  columns: ReportColumn[];
}

export interface ScheduledReport {
  id: string;
  reportId: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly';
  recipients: string[];
  enabled: boolean;
  nextRun: string;
}

export interface ReportFilter {
  field: string;
  operator: string;
  value: string;
}

export interface ReportColumn {
  field: string;
  label: string;
  width?: number;
  format?: 'currency' | 'number' | 'percentage' | 'date';
}

// Enhanced Banking Interfaces
export interface EnhancedBankAccount extends BankAccount {
  institution: BankInstitution;
  connectionStatus: 'Connected' | 'Disconnected' | 'Error' | 'Pending';
  lastSync?: string;
  autoReconcile: boolean;
  feedType: 'Direct' | 'Manual' | 'CSV' | 'API';
  rules: BankRule[];
  openingBalance: number;
  openingDate: string;
  interestRate?: number;
  minimumBalance?: number;
  overdraftLimit?: number;
  accountHolder: string;
  signatories: string[];
  monthlyFees?: number;
  statementFrequency: 'Monthly' | 'Quarterly';
}

export interface BankInstitution {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  routingNumber: string;
  supportedFeatures: string[];
}

export interface EnhancedTransaction extends Transaction {
  bankTransactionId?: string;
  cleared: boolean;
  locked: boolean;
  splitTransactions?: TransactionSplit[];
  attachments: TransactionAttachment[];
  tags: string[];
  locationId?: string;
  classId?: string;
  customerId?: string;
  vendorId?: string;
  projectId?: string;
  billableHours?: number;
  exchangeRate?: number;
  originalCurrency?: string;
  originalAmount?: number;
  approvedBy?: string;
  approvalDate?: string;
  notes?: string;
}

export interface TransactionSplit {
  id: string;
  accountId: string;
  amount: number;
  description?: string;
  customerId?: string;
  vendorId?: string;
  classId?: string;
}

export interface TransactionAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadDate: string;
  uploadedBy: string;
}

// Enhanced Project Management
export interface EnhancedProject extends Project {
  projectType: 'Fixed Fee' | 'Time & Materials' | 'Non-Billable';
  billingMethod: 'Per Hour' | 'Per Project' | 'Milestone';
  hourlyRates: ProjectHourlyRate[];
  expenses: ProjectExpense[];
  timesheets: ProjectTimesheet[];
  invoices: string[]; // invoice IDs
  estimates: string[]; // estimate IDs
  profitability: ProjectProfitability;
  phases: ProjectPhase[];
  resources: ProjectResource[];
  risks: ProjectRisk[];
  changeOrders: ChangeOrder[];
  contracts: ProjectContract[];
}

export interface ProjectHourlyRate {
  employeeId: string;
  role: string;
  rate: number;
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface ProjectExpense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  billable: boolean;
  approved: boolean;
  receipt?: string;
  employeeId: string;
}

export interface ProjectTimesheet {
  id: string;
  employeeId: string;
  weekEnding: string;
  entries: TimesheetEntry[];
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  totalHours: number;
  totalBillableHours: number;
}

export interface TimesheetEntry {
  date: string;
  projectId: string;
  taskId?: string;
  hours: number;
  description: string;
  billable: boolean;
  hourlyRate: number;
}

export interface ProjectProfitability {
  budgetedCost: number;
  actualCost: number;
  budgetedRevenue: number;
  actualRevenue: number;
  grossMargin: number;
  grossMarginPercent: number;
}

export interface ProjectPhase {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  budget: number;
  actualCost: number;
  status: 'Planning' | 'Active' | 'Completed' | 'On Hold';
  dependencies: string[];
}

export interface ProjectResource {
  id: string;
  employeeId: string;
  role: string;
  allocation: number; // percentage
  startDate: string;
  endDate?: string;
  costCenter?: string;
}

export interface ProjectRisk {
  id: string;
  description: string;
  impact: 'Low' | 'Medium' | 'High';
  probability: 'Low' | 'Medium' | 'High';
  mitigation: string;
  owner: string;
  status: 'Open' | 'Mitigated' | 'Closed';
}

export interface ChangeOrder {
  id: string;
  description: string;
  requestedBy: string;
  requestDate: string;
  estimatedCost: number;
  estimatedHours: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Implemented';
  approvedBy?: string;
  approvalDate?: string;
}

export interface ProjectContract {
  id: string;
  number: string;
  type: 'Master' | 'Statement of Work' | 'Amendment';
  startDate: string;
  endDate: string;
  value: number;
  terms: string;
  signedDate?: string;
  documents: string[];
}

// Enhanced Vendor Management
export interface Vendor {
  id: string;
  name: string;
  displayName?: string;
  email?: string;
  phone?: string;
  website?: string;
  taxId?: string;
  address: VendorAddress;
  contactPerson?: string;
  paymentTerms: string;
  creditLimit?: number;
  accountNumber?: string;
  status: 'Active' | 'Inactive';
  vendorType: 'Service' | 'Material' | 'Both';
  paymentMethods: string[];
  category: string;
  notes?: string;
  w9OnFile: boolean;
  insuranceCertOnFile: boolean;
  performanceRating: number;
  preferredVendor: boolean;
  minimumOrderAmount?: number;
  leadTime?: number;
  qualifications: string[];
  customFields: Record<string, string>;
}

export interface VendorAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface VendorBill {
  id: string;
  vendorId: string;
  billNumber: string;
  referenceNumber?: string;
  date: string;
  dueDate: string;
  terms: string;
  items: VendorBillItem[];
  subtotal: number;
  tax: number;
  total: number;
  amountDue: number;
  status: 'Open' | 'Paid' | 'Overdue' | 'Void';
  paymentStatus: 'Unpaid' | 'Partially Paid' | 'Paid';
  poNumber?: string;
  memo?: string;
  attachments: string[];
  approvals: BillApproval[];
  matching: ThreeWayMatching;
}

export interface VendorBillItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  account: string;
  customer?: string;
  class?: string;
  location?: string;
  billable?: boolean;
}

export interface BillApproval {
  level: number;
  approver: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date?: string;
  comments?: string;
}

export interface ThreeWayMatching {
  purchaseOrderId?: string;
  receiptId?: string;
  matched: boolean;
  discrepancies: string[];
}

// Purchase Orders
export type PurchaseOrderStatus =
  | 'Draft'
  | 'Pending Approval'
  | 'Approved'
  | 'Sent'
  | 'Partially Received'
  | 'Received'
  | 'Closed'
  | 'Cancelled'
  | 'Void';

export interface PurchaseOrderItem {
  id: string;
  inventoryItemId?: string;
  description: string;
  sku?: string;
  quantity: number;
  receivedQuantity: number;
  unitCost: number;
  taxRate?: number;
  discount?: number;
  amount: number;
  notes?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  date: string;
  expectedDate?: string;
  status: PurchaseOrderStatus;
  currency?: string;
  terms?: string;
  shipTo?: string;
  billTo?: string;
  reference?: string;
  notes?: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  taxTotal: number;
  shipping?: number;
  otherCharges?: number;
  total: number;
  approvals?: BillApproval[];
  attachments?: string[];
}

// Enhanced Inventory Management
export interface EnhancedInventoryItem extends InventoryItem {
  manufacturerPartNumber?: string;
  vendorPartNumber?: string;
  alternateItems: string[];
  assemblies: AssemblyItem[];
  stockAdjustments: StockAdjustment[];
  stockTransfers: StockTransfer[];
  minQuantity: number;
  maxQuantity: number;
  averageCost: number;
  standardCost: number;
  lastCost: number;
  priceHistory: PriceHistory[];
  vendors: ItemVendor[];
  locations: ItemLocation[];
  attributes: ItemAttribute[];
  qualityControl: QualityControl;
  compliance: ComplianceInfo;
}

export interface AssemblyItem {
  id: string;
  name: string;
  components: AssemblyComponent[];
  laborCost: number;
  overheadCost: number;
  totalCost: number;
  sellingPrice: number;
  buildInstructions?: string;
}

export interface AssemblyComponent {
  itemId: string;
  quantity: number;
  unitCost: number;
  optional: boolean;
}

export interface StockAdjustment {
  id: string;
  date: string;
  adjustmentType: 'Physical Count' | 'Damaged' | 'Obsolete' | 'Other';
  quantityBefore: number;
  quantityAfter: number;
  quantityAdjusted: number;
  unitCost: number;
  totalValueAdjustment: number;
  reason: string;
  adjustedBy: string;
  approved: boolean;
  approvedBy?: string;
}

export interface StockTransfer {
  id: string;
  date: string;
  fromLocation: string;
  toLocation: string;
  quantity: number;
  reason: string;
  transferredBy: string;
  status: 'Pending' | 'In Transit' | 'Completed';
}

export interface PriceHistory {
  date: string;
  price: number;
  priceType: 'Purchase' | 'Selling';
  vendor?: string;
  reason?: string;
}

export interface ItemVendor {
  vendorId: string;
  vendorPartNumber?: string;
  cost: number;
  leadTime: number;
  minimumOrderQuantity: number;
  preferred: boolean;
  lastOrderDate?: string;
}

export interface ItemLocation {
  locationId: string;
  quantity: number;
  binLocation?: string;
  reservedQuantity: number;
  availableQuantity: number;
}

export interface ItemAttribute {
  name: string;
  value: string;
  type: 'Text' | 'Number' | 'Date' | 'Boolean';
}

export interface QualityControl {
  inspectionRequired: boolean;
  testingRequired: boolean;
  certificationRequired: boolean;
  quarantinePeriod?: number;
  qualityStandards: string[];
}

export interface ComplianceInfo {
  regulatoryInfo: string[];
  msdsRequired: boolean;
  hazardousClassification?: string;
  storageRequirements?: string;
  handlingInstructions?: string;
}

// Enhanced Financial Reporting
export interface FinancialPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  closed: boolean;
  adjustments: PeriodAdjustment[];
}

export interface PeriodAdjustment {
  id: string;
  description: string;
  amount: number;
  account: string;
  date: string;
  type: 'Accrual' | 'Prepaid' | 'Depreciation' | 'Other';
  reversalDate?: string;
}

// Enhanced User Management and Permissions
export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  restrictedModules: string[];
  accessLevel: 'Full' | 'Limited' | 'View Only';
}

export interface Permission {
  module: string;
  actions: PermissionAction[];
  restrictions?: PermissionRestriction[];
}

export interface PermissionAction {
  action: 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export';
  allowed: boolean;
}

export interface PermissionRestriction {
  field: string;
  condition: string;
  value: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  module: string;
  recordId?: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  changes?: AuditChange[];
}

export interface AuditChange {
  field: string;
  oldValue: any;
  newValue: any;
}

// Enhanced Multi-Entity and Consolidation
export interface BusinessUnit {
  id: string;
  name: string;
  type: 'Division' | 'Department' | 'Location' | 'Project';
  parentId?: string;
  manager: string;
  costCenter: string;
  profitCenter: string;
  active: boolean;
}

export interface Class {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  active: boolean;
}

export interface Location {
  id: string;
  name: string;
  address?: string;
  type: 'Office' | 'Warehouse' | 'Store' | 'Remote';
  manager?: string;
  active: boolean;
}
