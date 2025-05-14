
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TransactionHistoryTab } from "./TransactionHistoryTab";
import { IncomeExpensesTab } from "./IncomeExpensesTab";
import { AccountStatementTab } from "./AccountStatementTab";
import { ReconciliationTab } from "./ReconciliationTab";
import { useCompany } from "@/contexts/CompanyContext";

export interface ReportTabsProps {
  accountId: string;
}

export const ReportTabs: React.FC<ReportTabsProps> = ({ accountId }) => {
  const [activeTab, setActiveTab] = useState("transactions");
  const { currentCompany } = useCompany();

  // Ensure all required properties are present
  const transactions = accountId
    ? currentCompany.transactions
        .filter(t => t.bankAccount === accountId)
        .map(t => ({
          ...t,
          reconciled: t.reconciled === undefined ? false : t.reconciled
        }))
    : currentCompany.transactions.map(t => ({
        ...t,
        reconciled: t.reconciled === undefined ? false : t.reconciled
      }));

  return (
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
  );
};
