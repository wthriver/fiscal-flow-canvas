
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface BalanceHistory {
  date: string;
  amount: number;
  balance: number;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
}

interface AccountStatementTabProps {
  balanceHistory: BalanceHistory[];
  accountName: string;
  transactions: Transaction[];
}

export const AccountStatementTab: React.FC<AccountStatementTabProps> = ({
  balanceHistory,
  accountName,
  transactions
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Account Balance History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={balanceHistory}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value: any) => [`$${Math.abs(value).toFixed(2)}`, value < 0 ? "Debit" : "Credit"]}
                />
                <Legend />
                <Bar dataKey="amount" name="Transaction Amount" fill={accountName.includes("Savings") ? "#8884d8" : "#82ca9d"} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Debits</TableHead>
            <TableHead>Credits</TableHead>
            <TableHead>Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {balanceHistory.length > 0 ? (
            balanceHistory.map((entry, index) => {
              const transaction = transactions.find(t => t.date === entry.date);
              return (
                <TableRow key={index}>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{transaction?.description || "Balance"}</TableCell>
                  <TableCell>{entry.amount < 0 ? `$${Math.abs(entry.amount).toFixed(2)}` : ""}</TableCell>
                  <TableCell>{entry.amount > 0 ? `$${entry.amount.toFixed(2)}` : ""}</TableCell>
                  <TableCell>${entry.balance.toFixed(2)}</TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No transactions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
