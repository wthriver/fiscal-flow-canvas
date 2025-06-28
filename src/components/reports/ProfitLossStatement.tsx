import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompany } from "@/contexts/CompanyContext";
import { safeNumberParse } from "@/utils/typeHelpers";

const ProfitLossStatement: React.FC = () => {
  const { currentCompany } = useCompany();
  
  // Calculate total revenue
  const totalRevenue = currentCompany.invoices?.reduce((total, invoice) => {
    return total + safeNumberParse(invoice.total);
  }, 0) || 0;
  
  // Calculate total expenses
  const totalExpenses = currentCompany.expenses?.reduce((total, expense) => {
    return total + safeNumberParse(expense.amount);
  }, 0) || 0;
  
  // Calculate net income
  const netIncome = totalRevenue - totalExpenses;
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Profit & Loss Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
            </div>
          </div>
          <div className="mt-4 border-t pt-4">
            <p className="text-sm font-medium text-muted-foreground">Net Income</p>
            <p className="text-2xl font-bold">${netIncome.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfitLossStatement;
