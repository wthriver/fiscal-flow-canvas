
import React from "react";
import { Button } from "@/components/ui/button";

interface ReconciliationHeaderProps {
  isReconciling: boolean;
  onStartReconciliation: () => void;
  onCancelReconciliation: () => void;
  onFinishReconciliation: () => void;
}

export const ReconciliationHeader: React.FC<ReconciliationHeaderProps> = ({
  isReconciling,
  onStartReconciliation,
  onCancelReconciliation,
  onFinishReconciliation
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
      <h1 className="text-2xl font-bold">Bank Reconciliation</h1>
      <div>
        {!isReconciling ? (
          <Button onClick={onStartReconciliation}>Start Reconciliation</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancelReconciliation}>Cancel</Button>
            <Button onClick={onFinishReconciliation}>Finish Reconciliation</Button>
          </div>
        )}
      </div>
    </div>
  );
};
