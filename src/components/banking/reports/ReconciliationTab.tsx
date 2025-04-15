
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: string;
  category: string;
  reconciled: boolean;
}

interface ReconciliationData {
  reconciled: number;
  unreconciled: number;
}

interface ReconciliationTabProps {
  reconciliationData: ReconciliationData;
  transactions: Transaction[];
}

export const ReconciliationTab: React.FC<ReconciliationTabProps> = ({
  reconciliationData,
  transactions
}) => {
  const totalTransactions = transactions.length;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Reconciliation Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[reconciliationData]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" hide />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="reconciled" name="Reconciled" fill="#82ca9d" stackId="a" />
                  <Bar dataKey="unreconciled" name="Unreconciled" fill="#ff7e7e" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Reconciliation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Total Transactions:</span>
                <span className="font-medium">{totalTransactions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Reconciled:</span>
                <span className="font-medium text-green-600">{reconciliationData.reconciled}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Unreconciled:</span>
                <span className="font-medium text-red-600">{reconciliationData.unreconciled}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Reconciliation Rate:</span>
                <span className="font-medium">
                  {totalTransactions > 0
                    ? ((reconciliationData.reconciled / totalTransactions) * 100).toFixed(1) + "%"
                    : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Unreconciled Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.filter(t => !t.reconciled).length > 0 ? (
                transactions
                  .filter(t => !t.reconciled)
                  .map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell className={transaction.amount.startsWith("+") ? "text-green-600" : "text-red-600"}>
                        {transaction.amount}
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    All transactions are reconciled
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
