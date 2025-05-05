
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, AlertTriangle } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { prepareTransactionData } from "@/utils/reportUtils";

interface ReconciliationTabProps {
  accountId: string;
}

export const ReconciliationTab: React.FC<ReconciliationTabProps> = ({ accountId }) => {
  const { currentCompany } = useCompany();
  
  const account = accountId ? 
    currentCompany.bankAccounts.find(acc => acc.id === accountId) : 
    null;
  
  const accountName = account ? account.name : "All Accounts";
  
  // Use the utility function to prepare data
  const { reconciliationData, filteredTransactions } = prepareTransactionData(
    currentCompany.transactions,
    accountName,
    { from: undefined, to: undefined }
  );

  // Prepare data for the pie chart
  const pieData = [
    { name: "Reconciled", value: reconciliationData?.reconciled || 0, color: "#10b981" },
    { name: "Unreconciled", value: reconciliationData?.unreconciled || 0, color: "#f43f5e" }
  ];

  // Get the most recent unreconciled transactions
  const unreconciledTransactions = filteredTransactions
    .filter(t => !t.reconciled)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Reconciliation Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} transactions`, ""]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-green-50 p-3 text-center">
                <div className="text-xl font-bold text-green-700">{reconciliationData?.reconciled || 0}</div>
                <div className="text-sm text-green-600">Reconciled</div>
              </div>
              <div className="rounded-lg bg-red-50 p-3 text-center">
                <div className="text-xl font-bold text-red-700">{reconciliationData?.unreconciled || 0}</div>
                <div className="text-sm text-red-600">Unreconciled</div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unreconciledTransactions.length > 0 ? (
                  unreconciledTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Unreconciled
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      All transactions have been reconciled
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="flex justify-end mt-4">
              <Button className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Start Reconciliation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
