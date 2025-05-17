
import React from "react";
import { GeneralLedger } from "@/components/accounting/GeneralLedger";
import { TaxCalculator } from "@/components/taxes/TaxCalculator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecurringInvoices } from "@/components/invoices/RecurringInvoices";
import { AccountsPayableAging } from "@/components/expenses/AccountsPayableAging";
import { DigitalReceiptCapture } from "@/components/expenses/DigitalReceiptCapture";
import { ChartOfAccountsComponent } from "@/components/accounting/ChartOfAccountsComponent";

const Accounting = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Accounting</h1>
        <p className="text-muted-foreground">Manage your company's financial records</p>
      </div>

      <Tabs defaultValue="general-ledger" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general-ledger">General Ledger</TabsTrigger>
          <TabsTrigger value="chart-of-accounts">Chart of Accounts</TabsTrigger>
          <TabsTrigger value="recurring">Recurring Invoices</TabsTrigger>
          <TabsTrigger value="accounts-payable">Accounts Payable</TabsTrigger>
          <TabsTrigger value="receipts">Receipt Management</TabsTrigger>
          <TabsTrigger value="taxes">Tax Management</TabsTrigger>
        </TabsList>

        <TabsContent value="general-ledger">
          <GeneralLedger />
        </TabsContent>

        <TabsContent value="chart-of-accounts">
          <ChartOfAccountsComponent />
        </TabsContent>

        <TabsContent value="recurring">
          <RecurringInvoices />
        </TabsContent>

        <TabsContent value="accounts-payable">
          <AccountsPayableAging />
        </TabsContent>

        <TabsContent value="receipts">
          <DigitalReceiptCapture />
        </TabsContent>

        <TabsContent value="taxes">
          <TaxCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Accounting;
