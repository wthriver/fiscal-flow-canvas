
import React, { useState } from "react";
import { BudgetingDashboard } from "@/components/budgeting/BudgetingDashboard";
import { BudgetDialog } from "@/components/budgeting/BudgetDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Budgeting: React.FC = () => {
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Budget Management</h1>
          <p className="text-muted-foreground">Create and manage your budgets with detailed categories</p>
        </div>
        <Button onClick={() => setIsBudgetDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Budget
        </Button>
      </div>
      
      <BudgetingDashboard />
      
      <BudgetDialog 
        isOpen={isBudgetDialogOpen}
        onClose={() => setIsBudgetDialogOpen(false)}
      />
    </div>
  );
};

export default Budgeting;
