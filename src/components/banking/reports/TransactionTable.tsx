
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TransactionTableRow } from "./TransactionTableRow";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: string;
  category: string;
  reconciled: boolean;
}

interface TransactionTableProps {
  transactions: Transaction[];
  sortConfig: { key: keyof Transaction; direction: "asc" | "desc" } | null;
  onRequestSort: (key: keyof Transaction) => void;
  onViewDetails: (transaction: Transaction) => void;
  onShareTransaction: (transaction: Transaction) => void;
  searchTerm: string;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  sortConfig,
  onRequestSort,
  onViewDetails,
  onShareTransaction,
  searchTerm
}) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => onRequestSort('date')}>
                Date {sortConfig?.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => onRequestSort('description')}>
                Description {sortConfig?.key === 'description' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => onRequestSort('category')}>
                Category {sortConfig?.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => onRequestSort('amount')}>
                Amount {sortConfig?.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => onRequestSort('reconciled')}>
                Status {sortConfig?.key === 'reconciled' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TransactionTableRow 
                  key={transaction.id}
                  transaction={transaction}
                  onViewDetails={onViewDetails}
                  onShareTransaction={onShareTransaction}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  {searchTerm ? "No matching transactions found" : "No transactions found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
