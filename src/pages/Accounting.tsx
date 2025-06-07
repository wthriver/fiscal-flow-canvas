
import React from "react";
import { GeneralLedger } from "@/components/accounting/GeneralLedger";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecurringInvoices } from "@/components/invoices/RecurringInvoices";
import { AccountsPayableAging } from "@/components/expenses/AccountsPayableAging";
import { DigitalReceiptCapture } from "@/components/expenses/DigitalReceiptCapture";
import { ChartOfAccountsComponent } from "@/components/accounting/ChartOfAccountsComponent";
import { FixedAssetsTracking } from "@/components/accounting/FixedAssetsTracking";
import { AccountsReceivableAging } from "@/components/accounting/AccountsReceivableAging";

const Accounting = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Accounting</h1>
        <p className="text-muted-foreground">Manage your company's financial records</p>
      </div>

      <Tabs defaultValue="general-ledger" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general-ledger">General Ledger</TabsTrigger>
          <TabsTrigger value="chart-of-accounts">Chart of Accounts</TabsTrigger>
          <TabsTrigger value="fixed-assets">Fixed Assets</TabsTrigger>
          <TabsTrigger value="receivables">A/R Aging</TabsTrigger>
        </TabsList>

        <TabsContent value="general-ledger">
          <GeneralLedger />
        </TabsContent>

        <TabsContent value="chart-of-accounts">
          <ChartOfAccountsComponent />
        </TabsContent>

        <TabsContent value="fixed-assets">
          <FixedAssetsTracking />
        </TabsContent>

        <TabsContent value="receivables">
          <AccountsReceivableAging />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Accounting;
