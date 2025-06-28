
import { Company, Invoice, Expense, Customer, Project, Employee, Sale, Estimate, Budget, TimeEntry, Transaction, BankAccount, Account, TaxRate } from '@/types/company';

const STORAGE_KEY = 'accounting_app_data';

export interface AppData {
  companies: Company[];
  currentCompanyId: string;
}

export const localStorageService = {
  // Load data from localStorage
  loadData(): AppData | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      return null;
    }
  },

  // Save data to localStorage
  saveData(data: AppData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  },

  // Clear all data
  clearData(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing data from localStorage:', error);
    }
  },

  // Export data
  exportData(): string {
    const data = this.loadData();
    return JSON.stringify(data, null, 2);
  },

  // Import data
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      this.saveData(data);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  },

  // Company operations
  saveCompany(company: Company): void {
    const data = this.loadData();
    if (!data) return;

    const companyIndex = data.companies.findIndex(c => c.id === company.id);
    if (companyIndex >= 0) {
      data.companies[companyIndex] = company;
    } else {
      data.companies.push(company);
    }

    this.saveData(data);
  },

  deleteCompany(companyId: string): void {
    const data = this.loadData();
    if (!data) return;

    data.companies = data.companies.filter(c => c.id !== companyId);
    
    // If deleted company was current, switch to first available
    if (data.currentCompanyId === companyId && data.companies.length > 0) {
      data.currentCompanyId = data.companies[0].id;
    }

    this.saveData(data);
  },

  // Backup operations
  createBackup(): string {
    return this.exportData();
  },

  restoreBackup(backupData: string): boolean {
    return this.importData(backupData);
  },

  // Migration helpers
  migrateData(oldData: any): AppData {
    // Handle migration from older versions
    const migratedData: AppData = {
      companies: [],
      currentCompanyId: ''
    };

    if (oldData.companies && Array.isArray(oldData.companies)) {
      migratedData.companies = oldData.companies.map((company: any) => ({
        ...company,
        // Ensure all required fields exist
        customers: company.customers || [],
        invoices: company.invoices || [],
        expenses: company.expenses || [],
        projects: company.projects || [],
        employees: company.employees || [],
        bankAccounts: company.bankAccounts || [],
        accounts: company.accounts || [],
        taxRates: company.taxRates || [],
        budgets: company.budgets || [],
        estimates: company.estimates || [],
        timeEntries: company.timeEntries || [],
        sales: company.sales || [],
        transactions: company.transactions || [],
        inventory: company.inventory || {
          items: [],
          bundles: [],
          serialNumbers: [],
          lotTracking: [],
          suppliers: []
        },
        revenue: company.revenue || { current: 0, previous: 0, percentChange: 0 },
        profitMargin: company.profitMargin || { value: 0, previous: 0, percentChange: 0 },
        outstandingInvoices: company.outstandingInvoices || { amount: 0, percentChange: 0 },
        activeCustomers: company.activeCustomers || { count: 0, percentChange: 0 },
        payrollData: company.payrollData || {
          totalPayroll: 0,
          employeeCount: 0,
          averageSalary: 0,
          payPeriods: [],
          taxSettings: {},
          deductionTypes: {}
        }
      }));
    }

    migratedData.currentCompanyId = oldData.currentCompanyId || (migratedData.companies[0]?.id || '');

    return migratedData;
  }
};

export default localStorageService;
