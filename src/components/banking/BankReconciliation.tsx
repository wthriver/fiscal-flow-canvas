
import React, { useState } from "react";
import { toast } from "sonner";
import { ReconciliationHeader } from "./reconciliation/ReconciliationHeader";
import { AccountSummaryCards } from "./reconciliation/AccountSummaryCards";
import { ReconciliationContent } from "./reconciliation/ReconciliationContent";
import { FinishReconciliationDialog } from "./reconciliation/FinishReconciliationDialog";

export const BankReconciliation: React.FC = () => {
  const [isReconciling, setIsReconciling] = useState(false);
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);
  
  // Sample data for transactions
  const bankTransactions = [
    { id: "bt001", date: "2025-04-14", description: "Office Supplies", amount: "-$253.75" },
    { id: "bt002", date: "2025-04-13", description: "Client Payment - ABC Corp", amount: "+$1,250.00" },
    { id: "bt003", date: "2025-04-12", description: "Monthly Rent", amount: "-$2,500.00" },
    { id: "bt004", date: "2025-04-10", description: "Utility Bill", amount: "-$187.45" },
  ];
  
  const bookTransactions = [
    { id: "bk001", date: "2025-04-14", description: "Office Supplies", amount: "-$253.75", reconciled: true },
    { id: "bk002", date: "2025-04-13", description: "Client Payment - ABC Corp", amount: "+$1,250.00", reconciled: true },
    { id: "bk003", date: "2025-04-12", description: "Monthly Rent", amount: "-$2,500.00", reconciled: true },
    { id: "bk004", date: "2025-04-10", description: "Utility Bill", amount: "-$187.45", reconciled: false },
    { id: "bk005", date: "2025-04-09", description: "Client Payment - XYZ Ltd", amount: "+$3,450.00", reconciled: false },
  ];

  const handleStartReconciliation = () => {
    setIsReconciling(true);
    toast.info("Starting bank reconciliation", {
      description: "Match your book transactions with bank statement transactions"
    });
  };

  const handleFinishReconciliation = () => {
    setFinishDialogOpen(false);
    setIsReconciling(false);
    toast.success("Bank reconciliation completed successfully", {
      description: "Your account has been reconciled through April 14, 2025"
    });
  };
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <ReconciliationHeader
        isReconciling={isReconciling}
        onStartReconciliation={handleStartReconciliation}
        onCancelReconciliation={() => setIsReconciling(false)}
        onFinishReconciliation={() => setFinishDialogOpen(true)}
      />
      
      {!isReconciling ? (
        <AccountSummaryCards />
      ) : (
        <ReconciliationContent 
          bankTransactions={bankTransactions} 
          bookTransactions={bookTransactions} 
        />
      )}
      
      <FinishReconciliationDialog
        open={finishDialogOpen}
        onOpenChange={setFinishDialogOpen}
        onComplete={handleFinishReconciliation}
      />
    </div>
  );
};
