
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
      <div className="overflow-x-auto pb-2">
        <TabsList className="inline-flex w-auto mb-4">
          <TabsTrigger value="transaction-history">Transaction History</TabsTrigger>
          <TabsTrigger value="account-statement">Account Statement</TabsTrigger>
          <TabsTrigger value="income-expenses">Income & Expenses</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
};
