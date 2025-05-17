
/**
 * Local Storage Service
 * Handles saving and retrieving application data from local storage
 */

import { Company } from "@/contexts/CompanyContext";

const STORAGE_KEY = "financial_app_data";

export const saveToLocalStorage = (data: Company): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log("Data saved to local storage", data);
  } catch (error) {
    console.error("Error saving to local storage:", error);
  }
};

export const loadFromLocalStorage = (): Company | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      console.log("No data found in local storage");
      return null;
    }
    
    const parsedData = JSON.parse(data);
    console.log("Data loaded from local storage", parsedData);
    
    // Ensure the data has the expected structure to avoid issues
    return {
      id: parsedData.id || `company-${Date.now()}`,
      name: parsedData.name || "My Company",
      address: parsedData.address || "",
      phone: parsedData.phone || "",
      email: parsedData.email || "",
      website: parsedData.website || "",
      taxId: parsedData.taxId || "",
      industry: parsedData.industry || "",
      fiscalYearStart: parsedData.fiscalYearStart || "January 1",
      transactions: parsedData.transactions || [],
      accounts: parsedData.accounts || [],
      taxRates: parsedData.taxRates || [],
      bankAccounts: Array.isArray(parsedData.bankAccounts) ? parsedData.bankAccounts : [
        {
          id: 'bank-1',
          name: 'Checking Account',
          balance: 1000,
          transactions: [
            {
              id: 'transaction-1',
              date: '2023-01-01',
              description: 'Initial Deposit',
              amount: '+$1000.00',
              category: 'Deposit',
              account: 'Checking Account',
              reconciled: false,
              type: 'Deposit'
            }
          ]
        }
      ],
      customers: Array.isArray(parsedData.customers) ? parsedData.customers : [],
      invoices: Array.isArray(parsedData.invoices) ? parsedData.invoices : [],
      expenses: Array.isArray(parsedData.expenses) ? parsedData.expenses : [],
      projects: Array.isArray(parsedData.projects) ? parsedData.projects : [],
      employees: Array.isArray(parsedData.employees) ? parsedData.employees : [],
      timeEntries: Array.isArray(parsedData.timeEntries) ? parsedData.timeEntries : [],
      inventory: parsedData.inventory || {
        items: [],
        categories: [],
        locations: [],
        bundles: [],
        serialNumbers: [],
        lotTracking: []
      },
      budgets: Array.isArray(parsedData.budgets) ? parsedData.budgets : [],
      estimates: Array.isArray(parsedData.estimates) ? parsedData.estimates : [],
      payrollData: parsedData.payrollData || { payPeriods: [] },
      auditTrail: Array.isArray(parsedData.auditTrail) ? parsedData.auditTrail : [],
      integrations: Array.isArray(parsedData.integrations) ? parsedData.integrations : [],
      sales: Array.isArray(parsedData.sales) ? parsedData.sales : [],
      revenue: parsedData.revenue || { current: 0, previous: 0, percentChange: 0 },
      profitMargin: parsedData.profitMargin || { value: 0, trend: 0, percentChange: 0 },
      outstandingInvoices: parsedData.outstandingInvoices || { amount: 0, percentChange: 0 },
      activeCustomers: parsedData.activeCustomers || { count: 0, percentChange: 0 }
    };
  } catch (error) {
    console.error("Error loading from local storage:", error);
    return null;
  }
};

export const clearLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log("Local storage data cleared");
  } catch (error) {
    console.error("Error clearing local storage:", error);
  }
};
