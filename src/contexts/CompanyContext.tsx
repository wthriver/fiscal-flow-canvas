import React, { createContext, useState, useContext, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { saveToLocalStorage, loadFromLocalStorage } from "@/services/localStorageService";

export interface Company {
  id: string;
  name: string;
  accounts?: Account[];
  taxRates?: TaxRate[];
  transactions: any[];
  bankAccounts: any[];
}

export interface Account {
  id: string;
  name: string;
  type: string;
  number: string;
  balance: number;
  description?: string;
}

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  description?: string;
  category?: string;
  isDefault?: boolean;
}

export type CompanyContextType = {
  currentCompany: Company;
  saveCompany: (company: Company) => void;
  addTransaction: (transaction: any) => void;
  updateTransaction: (id: string, updatedTransaction: any) => void;
  deleteTransaction: (id: string) => void;
  addAccount: (account: Account) => void;
  updateAccount: (id: string, updatedAccount: Account) => void;
  deleteAccount: (id: string) => void;
  addTaxRate: (taxRate: TaxRate) => void;
  updateTaxRate: (id: string, updatedTaxRate: TaxRate) => void;
  deleteTaxRate: (id: string) => void;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCompany, setCurrentCompany] = useState<Company>({
    id: "company-1",
    name: "Acme Corp",
    transactions: [],
    bankAccounts: [
      {
        id: "bank-1",
        name: "Checking Account",
        balance: 1000,
        transactions: [
          {
            id: "transaction-1",
            date: "2023-01-01",
            description: "Initial Deposit",
            amount: "+$1000.00",
            category: "Deposit",
            account: "Checking Account",
            reconciled: false,
            type: "Deposit"
          },
        ],
      },
    ],
  });

  useEffect(() => {
    const storedCompanyData = loadFromLocalStorage();
    if (storedCompanyData) {
      setCurrentCompany(storedCompanyData);
    }
  }, []);

  useEffect(() => {
    saveToLocalStorage(currentCompany);
  }, [currentCompany]);

  const saveCompany = (company: Company) => {
    setCurrentCompany(company);
  };

  const addTransaction = (transaction: any) => {
    setCurrentCompany((prev) => ({
      ...prev,
      transactions: [...prev.transactions, transaction],
    }));
  };

  const updateTransaction = (id: string, updatedTransaction: any) => {
    setCurrentCompany((prev) => ({
      ...prev,
      transactions: prev.transactions.map((transaction) =>
        transaction.id === id ? updatedTransaction : transaction
      ),
    }));
  };

  const deleteTransaction = (id: string) => {
    setCurrentCompany((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((transaction) => transaction.id !== id),
    }));
  };

  const addAccount = (account: Account) => {
    setCurrentCompany(prev => ({
      ...prev,
      accounts: [...(prev.accounts || []), account]
    }));
  };

  const updateAccount = (id: string, updatedAccount: Account) => {
    setCurrentCompany(prev => ({
      ...prev,
      accounts: (prev.accounts || []).map(account => 
        account.id === id ? updatedAccount : account
      )
    }));
  };

  const deleteAccount = (id: string) => {
    setCurrentCompany(prev => ({
      ...prev,
      accounts: (prev.accounts || []).filter(account => account.id !== id)
    }));
  };

  const addTaxRate = (taxRate: TaxRate) => {
    setCurrentCompany(prev => ({
      ...prev,
      taxRates: [...(prev.taxRates || []), taxRate]
    }));
  };

  const updateTaxRate = (id: string, updatedTaxRate: TaxRate) => {
    setCurrentCompany(prev => ({
      ...prev,
      taxRates: (prev.taxRates || []).map(taxRate => 
        taxRate.id === id ? updatedTaxRate : taxRate
      )
    }));
  };

  const deleteTaxRate = (id: string) => {
    setCurrentCompany(prev => ({
      ...prev,
      taxRates: (prev.taxRates || []).filter(taxRate => taxRate.id !== id)
    }));
  };

  const value = {
    currentCompany,
    saveCompany,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addAccount,
    updateAccount,
    deleteAccount,
    addTaxRate,
    updateTaxRate,
    deleteTaxRate,
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
};
