import React from "react";
import { VendorBillManagement } from "@/components/expenses/VendorBillManagement";
import { VendorBillManagement as AlternativeVendorBills } from "@/components/vendors/VendorBillManagement";

const VendorBills: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vendor Bill Management</h1>
        <p className="text-muted-foreground">Comprehensive vendor bill processing and management</p>
      </div>
      <VendorBillManagement />
    </div>
  );
};

export default VendorBills;