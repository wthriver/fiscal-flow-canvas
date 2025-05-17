
/**
 * Local Storage Service
 * Handles saving and retrieving application data from local storage
 */

import { Company } from "@/contexts/CompanyContext";

const STORAGE_KEY = "financial_app_data";

export const saveToLocalStorage = (data: Company): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to local storage:", error);
  }
};

export const loadFromLocalStorage = (): Company | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading from local storage:", error);
    return null;
  }
};

export const clearLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing local storage:", error);
  }
};
