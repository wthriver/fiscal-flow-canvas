import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
import { Budget } from "@/types/company";

interface BudgetAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget: Budget | null;
}

export const BudgetAnalysisDialog: React.FC<BudgetAnalysisDialogProps> = ({
  open,
  onOpenChange,
  budget,
}) => {
  if (!budget) return null;

  const categories = budget.categories || [];
  const totalBudgeted = categories.reduce((sum, cat) => sum + (cat.budgeted || 0), 0);
  const totalActual = categories.reduce((sum, cat) => sum + (cat.actual || 0), 0);
  const totalVariance = totalBudgeted - totalActual;
  const utilizationRate = totalBudgeted > 0 ? (totalActual / totalBudgeted) * 100 : 0;

  const getPerformanceInsights = () => {
    const insights = [];
    
    if (utilizationRate > 90) {
      insights.push({
        type: "warning",
        icon: AlertTriangle,
        message: "Budget utilization is very high (>90%). Consider reviewing spending."
      });
    } else if (utilizationRate < 50) {
      insights.push({
        type: "info",
        icon: CheckCircle,
        message: "Budget utilization is low (<50%). You have room for additional investments."
      });
    }

    const overBudgetCategories = categories.filter(cat => cat.actual > cat.budgeted);
    if (overBudgetCategories.length > 0) {
      insights.push({
        type: "warning",
        icon: TrendingUp,
        message: `${overBudgetCategories.length} categories are over budget.`
      });
    }

    const underBudgetCategories = categories.filter(cat => cat.actual < cat.budgeted * 0.5);
    if (underBudgetCategories.length > 0) {
      insights.push({
        type: "success",
        icon: TrendingDown,
        message: `${underBudgetCategories.length} categories are significantly under budget.`
      });
    }

    return insights;
  };

  const insights = getPerformanceInsights();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Budget Analysis: {budget.name}</DialogTitle>
          <DialogDescription>
            Detailed performance analysis and insights for your budget
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Overview Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Budgeted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalBudgeted.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalActual.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          {/* Utilization */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Budget Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{utilizationRate.toFixed(1)}%</span>
                </div>
                <Progress value={Math.min(utilizationRate, 100)} className="h-3" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Remaining: ${(totalBudgeted - totalActual).toLocaleString()}</span>
                  <span className={totalVariance >= 0 ? "text-green-600" : "text-red-600"}>
                    {totalVariance >= 0 ? "Under" : "Over"} by ${Math.abs(totalVariance).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Category Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categories.map((category) => {
                  const progress = category.budgeted > 0 ? (category.actual / category.budgeted) * 100 : 0;
                  const variance = category.budgeted - category.actual;
                  
                  return (
                    <div key={category.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{category.name}</span>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            ${category.actual.toLocaleString()} / ${category.budgeted.toLocaleString()}
                          </div>
                          <div className={`text-xs ${variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {variance >= 0 ? '+' : ''}${variance.toLocaleString()} variance
                          </div>
                        </div>
                      </div>
                      <Progress 
                        value={Math.min(progress, 100)} 
                        className="h-2" 
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          {insights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.map((insight, index) => {
                    const Icon = insight.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <Icon className={`h-5 w-5 mt-0.5 ${
                          insight.type === 'warning' ? 'text-orange-500' :
                          insight.type === 'success' ? 'text-green-500' :
                          'text-blue-500'
                        }`} />
                        <p className="text-sm">{insight.message}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {utilizationRate > 85 && (
                  <p>• Consider reviewing high-spending categories to identify cost-saving opportunities.</p>
                )}
                {utilizationRate < 60 && (
                  <p>• You have budget surplus that could be reallocated to growth initiatives.</p>
                )}
                {categories.some(cat => cat.actual > cat.budgeted) && (
                  <p>• Review over-budget categories and adjust future budgets or spending patterns.</p>
                )}
                <p>• Set up regular budget reviews to stay on track with your financial goals.</p>
                <p>• Consider implementing approval workflows for large expenses.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>
            Close Analysis
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};