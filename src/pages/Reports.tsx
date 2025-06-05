
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialReports } from "@/components/reports/FinancialReports";
import { CashFlowStatement } from "@/components/reports/CashFlowStatement";
import { AccountsReceivableAging } from "@/components/accounting/AccountsReceivableAging";

const Reports: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Comprehensive financial reporting and analytics</p>
      </div>

      <Tabs defaultValue="financial" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="financial">Financial Reports</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="aging">A/R Aging</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="financial">
          <FinancialReports />
        </TabsContent>

        <TabsContent value="cashflow">
          <CashFlowStatement />
        </TabsContent>

        <TabsContent value="aging">
          <AccountsReceivableAging />
        </TabsContent>

        <TabsContent value="custom">
          <div className="text-center py-8 text-muted-foreground">
            Custom report builder coming soon
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
