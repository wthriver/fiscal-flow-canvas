
import React from "react";
import { PayrollDashboard } from "@/components/payroll/PayrollDashboard";

const Payroll: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Payroll Management</h1>
      <PayrollDashboard />
    </div>
  );
};

export default Payroll;
