
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdvancedJournalEntry } from "@/components/journal/AdvancedJournalEntry";
import { FixedAssetsManager } from "@/components/fixedassets/FixedAssetsManager";
import { ReportTabs } from "@/components/banking/reports/ReportTabs";

const AdvancedAccounting: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Advanced Accounting</h1>
        <p className="text-muted-foreground">Advanced accounting features for comprehensive financial management</p>
      </div>

      <Tabs defaultValue="journal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="journal">Advanced Journal</TabsTrigger>
          <TabsTrigger value="assets">Fixed Assets</TabsTrigger>
          <TabsTrigger value="reconciliation">Bank Reconciliation</TabsTrigger>
        </TabsList>

        <TabsContent value="journal">
          <AdvancedJournalEntry />
        </TabsContent>

        <TabsContent value="assets">
          <FixedAssetsManager />
        </TabsContent>

        <TabsContent value="reconciliation">
          <ReportTabs accountId="bank-1" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAccounting;
