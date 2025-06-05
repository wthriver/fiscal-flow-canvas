
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface JournalEntry {
  id: string;
  date: string;
  description: string;
  reference?: string;
  debits: Array<{ account: string; amount: number }>;
  credits: Array<{ account: string; amount: number }>;
  status: 'Draft' | 'Posted';
}

interface JournalEntryViewDialogProps {
  entry: JournalEntry;
  children: React.ReactNode;
}

export const JournalEntryViewDialog: React.FC<JournalEntryViewDialogProps> = ({ entry, children }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getTotalDebits = () => entry.debits.reduce((sum, debit) => sum + debit.amount, 0);
  const getTotalCredits = () => entry.credits.reduce((sum, credit) => sum + credit.amount, 0);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Journal Entry: {entry.id}
            <Badge variant={entry.status === 'Posted' ? 'default' : 'outline'}>
              {entry.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium">Date:</span>
              <p className="text-sm text-muted-foreground">{entry.date}</p>
            </div>
            {entry.reference && (
              <div>
                <span className="text-sm font-medium">Reference:</span>
                <p className="text-sm text-muted-foreground">{entry.reference}</p>
              </div>
            )}
          </div>

          <div>
            <span className="text-sm font-medium">Description:</span>
            <p className="text-sm text-muted-foreground">{entry.description}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Transaction Details</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entry.debits.map((debit, index) => (
                  <TableRow key={`debit-${index}`}>
                    <TableCell>{debit.account}</TableCell>
                    <TableCell className="text-right">{formatCurrency(debit.amount)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))}
                {entry.credits.map((credit, index) => (
                  <TableRow key={`credit-${index}`}>
                    <TableCell className="pl-8">{credit.account}</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right">{formatCurrency(credit.amount)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2">
                  <TableCell className="font-semibold">Totals</TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(getTotalDebits())}</TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(getTotalCredits())}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
