
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FinishReconciliationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
  beginningBalance?: string;
  endingBalance?: string;
  clearedDeposits?: string;
  clearedPayments?: string;
  difference?: string;
}

export const FinishReconciliationDialog: React.FC<FinishReconciliationDialogProps> = ({
  open,
  onOpenChange,
  onComplete,
  beginningBalance = "$0.00",
  endingBalance = "$0.00",
  clearedDeposits = "$0.00",
  clearedPayments = "$0.00",
  difference = "$0.00"
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Finish Reconciliation</DialogTitle>
          <DialogDescription>
            Please confirm the final reconciliation details
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Statement Date</p>
              <p>April 14, 2025</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ending Balance</p>
              <p>{endingBalance}</p>
            </div>
          </div>
          <div className="rounded-md bg-muted p-4">
            <div className="flex items-center justify-between">
              <p>Beginning Balance</p>
              <p className="font-medium">{beginningBalance}</p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p>Cleared Deposits</p>
              <p className="font-medium text-green-600">{clearedDeposits}</p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p>Cleared Payments</p>
              <p className="font-medium text-red-600">{clearedPayments}</p>
            </div>
            <div className="flex items-center justify-between mt-2 border-t pt-2">
              <p>Difference</p>
              <p className="text-green-600 font-medium">{difference}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            All transactions have been successfully matched. Your books are now reconciled with your bank statement.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onComplete}>
            Complete Reconciliation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
