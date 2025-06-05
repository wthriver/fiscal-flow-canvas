
import React from "react";
import { PurchaseOrderManagement } from "@/components/purchasing/PurchaseOrderManagement";

const PurchaseOrders: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <PurchaseOrderManagement />
    </div>
  );
};

export default PurchaseOrders;
