
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/types/company";

interface TransactionHistoryTabProps {
  transactions: Transaction[];
}

export const TransactionHistoryTab: React.FC<TransactionHistoryTabProps> = ({ transactions }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <p className="text-sm text-muted-foreground">
          Complete history of all transactions
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <Badge variant={transaction.type === 'Credit' ? 'default' : 'secondary'}>
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>
                    <span className={transaction.type === 'Debit' ? 'text-red-600' : 'text-green-600'}>
                      {transaction.type === 'Debit' ? '-' : '+'}${Math.abs(parseFloat(transaction.amount.replace(/[^0-9.-]+/g, "")) || 0).toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={transaction.reconciled ? 'default' : 'outline'}>
                      {transaction.reconciled ? 'Reconciled' : 'Pending'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
