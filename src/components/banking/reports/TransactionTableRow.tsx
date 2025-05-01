
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Share2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: string;
  category: string;
  reconciled: boolean;
}

interface TransactionTableRowProps {
  transaction: Transaction;
  onViewDetails: (transaction: Transaction) => void;
  onShareTransaction: (transaction: Transaction) => void;
}

export const TransactionTableRow: React.FC<TransactionTableRowProps> = ({
  transaction,
  onViewDetails,
  onShareTransaction
}) => {
  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell>{transaction.date}</TableCell>
      <TableCell>{transaction.description}</TableCell>
      <TableCell>{transaction.category}</TableCell>
      <TableCell className={transaction.amount.startsWith("+") ? "text-green-600" : "text-red-600"}>
        {transaction.amount}
      </TableCell>
      <TableCell>
        {transaction.reconciled ? (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Reconciled
          </span>
        ) : (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onViewDetails(transaction)}
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">View</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
              >
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onShareTransaction(transaction)}>
                Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShareTransaction(transaction)}>
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShareTransaction(transaction)}>
                Download PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
};
