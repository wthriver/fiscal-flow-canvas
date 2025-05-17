
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
      transactions: parsedData.transactions || [],
      accounts: parsedData.accounts || [],
      taxRates: parsedData.taxRates || [],
      bankAccounts: parsedData.bankAccounts || [],
      ...parsedData
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
