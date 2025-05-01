
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ReportTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

export const ReportTabs: React.FC<ReportTabsProps> = ({
  activeTab,
  onTabChange,
  children
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4 w-full">
        <TabsTrigger value="transaction-history">Transaction History</TabsTrigger>
        <TabsTrigger value="account-statement">Account Statement</TabsTrigger>
        <TabsTrigger value="income-expenses">Income & Expenses</TabsTrigger>
        <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};
