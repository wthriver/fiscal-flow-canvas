
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompany } from "@/contexts/CompanyContext";

interface IncomeExpensesTabProps {
  accountId: string;
}

export const IncomeExpensesTab: React.FC<IncomeExpensesTabProps> = ({ accountId }) => {
  const { currentCompany } = useCompany();

  const calculateTotals = () => {
    const account = currentCompany.bankAccounts?.find(acc => acc.id === accountId);
    const transactions = account?.transactions || [];
    
    const income = transactions
      .filter(t => t.type === 'Credit' || t.type === 'Deposit')
      .reduce((sum, t) => sum + (parseFloat(t.amount.replace(/[^0-9.-]+/g, "")) || 0), 0);
    
    const expenses = transactions
      .filter(t => t.type === 'Debit' || t.type === 'Withdrawal')
      .reduce((sum, t) => sum + (parseFloat(t.amount.replace(/[^0-9.-]+/g, "")) || 0), 0);
    
    return { income, expenses, net: income - expenses };
  };

  const { income, expenses, net } = calculateTotals();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${income.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${expenses.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Net Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${net.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
