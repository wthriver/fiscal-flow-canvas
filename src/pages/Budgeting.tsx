
import React from "react";
import { BudgetingDashboard } from "@/components/budgeting/BudgetingDashboard";

const Budgeting: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Budgeting</h1>
      <BudgetingDashboard />
    </div>
  );
};

export default Budgeting;
