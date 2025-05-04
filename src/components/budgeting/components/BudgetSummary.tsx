
import React from "react";

interface BudgetSummaryProps {
  calculatedBudget: {
    totalBudgeted: string;
    totalActual: string;
    variance: string;
    variancePercent: string;
  };
}

export const BudgetSummary: React.FC<BudgetSummaryProps> = ({ calculatedBudget }) => {
  return (
    <div className="mt-4 p-4 border rounded-lg">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-sm text-muted-foreground">Total Budgeted</div>
          <div className="text-lg font-bold">{calculatedBudget.totalBudgeted}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Total Actual</div>
          <div className="text-lg font-bold">{calculatedBudget.totalActual}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Variance</div>
          <div className={`text-lg font-bold ${parseFloat(calculatedBudget.variance) >= 0 ? "text-green-600" : "text-red-600"}`}>
            {calculatedBudget.variance} ({calculatedBudget.variancePercent}%)
          </div>
        </div>
      </div>
    </div>
  );
};
