import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompany } from "@/contexts/CompanyContext";

export interface IncomeExpensesTabProps {
  accountId: string;
}

export const IncomeExpensesTab: React.FC<IncomeExpensesTabProps> = ({ accountId }) => {
  const { currentCompany } = useCompany();

  // Filter transactions based on accountId if provided
  const transactions = accountId 
    ? currentCompany.transactions.filter(t => t.bankAccount === accountId)
    : currentCompany.transactions;

  // Calculate income and expenses
  const income = transactions
    .filter(t => t.type === 'Credit' || t.type === 'Deposit')
    .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[^0-9.-]+/g, "")), 0);

  const expenses = transactions
    .filter(t => t.type === 'Debit' || t.type === 'Withdrawal')
    .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[^0-9.-]+/g, "")), 0);

  // Get income and expense categories
  const incomeByCategory = transactions
    .filter(t => t.type === 'Credit' || t.type === 'Deposit')
    .reduce((acc, t) => {
      const category = t.category || 'Uncategorized';
      const amount = parseFloat(t.amount.replace(/[^0-9.-]+/g, "")) || 0;
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);

  const expensesByCategory = transactions
    .filter(t => t.type === 'Debit' || t.type === 'Withdrawal')
    .reduce((acc, t) => {
      const category = t.category || 'Uncategorized';
      const amount = parseFloat(t.amount.replace(/[^0-9.-]+/g, "")) || 0;
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${income.toLocaleString()}</div>
            <div className="space-y-4 mt-4">
              {Object.entries(incomeByCategory).map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center">
                  <div>{category}</div>
                  <div className="font-medium">${amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${expenses.toLocaleString()}</div>
            <div className="space-y-4 mt-4">
              {Object.entries(expensesByCategory).map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center">
                  <div>{category}</div>
                  <div className="font-medium">${amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Net Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            ${(income - expenses).toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
