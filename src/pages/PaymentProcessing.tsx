
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentProcessor } from "@/components/payments/PaymentProcessor";
import { InvoiceTemplates } from "@/components/invoices/InvoiceTemplates";
import { PaymentReminders } from "@/components/invoices/PaymentReminders";
import { LateFeeCalculator } from "@/components/invoices/LateFeeCalculator";
import { RecurringInvoices } from "@/components/invoices/RecurringInvoices";

const PaymentProcessing: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment Processing</h1>
        <p className="text-muted-foreground">Manage payments, invoicing, and automated reminders</p>
      </div>

      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
          <TabsTrigger value="fees">Late Fees</TabsTrigger>
          <TabsTrigger value="recurring">Recurring</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="mt-6">
          <PaymentProcessor />
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <InvoiceTemplates />
        </TabsContent>

        <TabsContent value="reminders" className="mt-6">
          <PaymentReminders />
        </TabsContent>

        <TabsContent value="fees" className="mt-6">
          <LateFeeCalculator />
        </TabsContent>

        <TabsContent value="recurring" className="mt-6">
          <RecurringInvoices />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentProcessing;
