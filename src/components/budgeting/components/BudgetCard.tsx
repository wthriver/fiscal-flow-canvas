
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Budget } from "@/types/company";

interface BudgetCardProps {
  budget: Budget;
  calculations: {
    totalBudgeted: string;
    totalActual: string;
    variance: string;
    variancePercent: string;
  };
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ budget, calculations }) => {
  const actualPercent = parseFloat(calculations.totalBudgeted.replace(/[^0-9.-]+/g, "")) > 0
    ? (parseFloat(calculations.totalActual.replace(/[^0-9.-]+/g, "")) / parseFloat(calculations.totalBudgeted.replace(/[^0-9.-]+/g, ""))) * 100
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{budget.name}</CardTitle>
        <CardDescription>
          {budget.period} ({budget.startDate} to {budget.endDate})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span>Budget: {calculations.totalBudgeted}</span>
          <span>Actual: {calculations.totalActual}</span>
        </div>
        <Progress value={actualPercent} className="h-2" />
        <div className="flex justify-between items-center">
          <span className="text-sm">
            <span className={parseFloat(calculations.variance) >= 0 ? "text-green-600" : "text-red-600"}>
              {parseFloat(calculations.variance) >= 0 ? "Under" : "Over"} by {calculations.variance}
            </span>
          </span>
          <span className="text-xs text-muted-foreground">
            {parseFloat(calculations.variancePercent) >= 0 ? "+" : ""}{calculations.variancePercent}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
