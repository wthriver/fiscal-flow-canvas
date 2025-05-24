
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountsPayableAging } from "@/components/expenses/AccountsPayableAging";
import { DigitalReceiptCapture } from "@/components/expenses/DigitalReceiptCapture";
import { MileageTracking } from "@/components/expenses/MileageTracking";
import { ReceiptScanner } from "@/components/expenses/ReceiptScanner";
import { VendorBillManagement } from "@/components/expenses/VendorBillManagement";

const Expenses: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Expenses</h1>
        <p className="text-muted-foreground">Manage business expenses, receipts, and vendor bills</p>
      </div>

      <Tabs defaultValue="bills" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="bills">Vendor Bills</TabsTrigger>
          <TabsTrigger value="scanner">Receipt Scanner</TabsTrigger>
          <TabsTrigger value="mileage">Mileage</TabsTrigger>
          <TabsTrigger value="capture">Receipt Capture</TabsTrigger>
          <TabsTrigger value="aging">A/P Aging</TabsTrigger>
        </TabsList>

        <TabsContent value="bills" className="mt-6">
          <VendorBillManagement />
        </TabsContent>

        <TabsContent value="scanner" className="mt-6">
          <ReceiptScanner />
        </TabsContent>

        <TabsContent value="mileage" className="mt-6">
          <MileageTracking />
        </TabsContent>

        <TabsContent value="capture" className="mt-6">
          <DigitalReceiptCapture />
        </TabsContent>

        <TabsContent value="aging" className="mt-6">
          <AccountsPayableAging />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Expenses;
