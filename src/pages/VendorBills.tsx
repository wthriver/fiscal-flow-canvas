
import React from "react";
import { VendorBillManagement } from "@/components/expenses/VendorBillManagement";

const VendorBills: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <VendorBillManagement />
    </div>
  );
};

export default VendorBills;
