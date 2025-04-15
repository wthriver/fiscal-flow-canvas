
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface IncomeExpenseData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

interface IncomeExpensesTabProps {
  incomeExpenseData: IncomeExpenseData[];
}

export const IncomeExpensesTab: React.FC<IncomeExpensesTabProps> = ({
  incomeExpenseData
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Income vs. Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={incomeExpenseData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => [`$${value.toFixed(2)}`, ""]} />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#82ca9d" />
                <Bar dataKey="expenses" name="Expenses" fill="#ff7e7e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead>Income</TableHead>
            <TableHead>Expenses</TableHead>
            <TableHead>Net</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incomeExpenseData.length > 0 ? (
            incomeExpenseData.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.month}</TableCell>
                <TableCell className="text-green-600">${entry.income.toFixed(2)}</TableCell>
                <TableCell className="text-red-600">${entry.expenses.toFixed(2)}</TableCell>
                <TableCell className={entry.balance >= 0 ? "text-green-600" : "text-red-600"}>
                  ${entry.balance.toFixed(2)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
