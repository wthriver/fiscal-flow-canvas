
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

  const transactions = accountId
    ? currentCompany.transactions.filter(t => t.bankAccount === accountId)
    : currentCompany.transactions;

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
        {/* Pass accountId as a prop to IncomeExpensesTab */}
        <IncomeExpensesTab accountId={accountId} />
      </TabsContent>

      <TabsContent value="statement" className="mt-4">
        {/* Pass accountId as a prop to AccountStatementTab */}
        <AccountStatementTab accountId={accountId} />
      </TabsContent>

      <TabsContent value="reconciliation" className="mt-4">
        {/* Pass accountId as a prop to ReconciliationTab */}
        <ReconciliationTab accountId={accountId} />
      </TabsContent>
    </Tabs>
  );
};
