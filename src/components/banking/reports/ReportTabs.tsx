
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TransactionHistoryTab } from "./TransactionHistoryTab";
import { IncomeExpensesTab } from "./IncomeExpensesTab";
import { AccountStatementTab } from "./AccountStatementTab";
import { ReconciliationTab } from "./ReconciliationTab";
import { ReportHeader } from "./ReportHeader";
import { useCompany } from "@/contexts/CompanyContext";

export interface ReportTabsProps {
  accountId: string;
}

export const ReportTabs: React.FC<ReportTabsProps> = ({ accountId }) => {
  const [activeTab, setActiveTab] = useState("transactions");
  const { currentCompany } = useCompany();

  // Get transactions for the specific account or all transactions
  const getTransactions = () => {
    if (accountId) {
      const account = currentCompany.bankAccounts.find(acc => acc.id === accountId);
      return account?.transactions || [];
    }
    
    // Return all transactions from all bank accounts
    return currentCompany.bankAccounts.flatMap(account => 
      account.transactions.map(transaction => ({
        ...transaction,
        reconciled: transaction.reconciled ?? false
      }))
    );
  };

  const transactions = getTransactions();

  return (
    <div className="space-y-4">
      <ReportHeader accountId={accountId} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          <TabsTrigger value="income-expenses">Income & Expenses</TabsTrigger>
          <TabsTrigger value="statement">Account Statement</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-4">
          <TransactionHistoryTab transactions={transactions} />
        </TabsContent>

        <TabsContent value="income-expenses" className="mt-4">
          <IncomeExpensesTab accountId={accountId} />
        </TabsContent>

        <TabsContent value="statement" className="mt-4">
          <AccountStatementTab accountId={accountId} />
        </TabsContent>

        <TabsContent value="reconciliation" className="mt-4">
          <ReconciliationTab accountId={accountId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
