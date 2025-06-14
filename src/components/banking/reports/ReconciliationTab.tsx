
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";
import { safeStringReplace } from "@/utils/typeHelpers";

export interface ReconciliationTabProps {
  accountId: string;
}

export const ReconciliationTab: React.FC<ReconciliationTabProps> = ({ accountId }) => {
  const { currentCompany, updateTransaction } = useCompany();
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [statementBalance, setStatementBalance] = useState<string>("");
  
  // Get account info and unreconciled transactions
  const account = currentCompany.bankAccounts?.find(acc => acc.id === accountId);
  const unreconciledTransactions = account?.transactions?.filter(t => !t.reconciled) || [];

  // Calculate balances
  const calculateBalance = (reconciled: boolean) => {
    return account?.transactions?.filter(t => t.reconciled === reconciled)
      .reduce((sum, t) => {
        const amount = parseFloat(safeStringReplace(t.amount, /[^0-9.-]+/g, "")) || 0;
        return (t.type === 'Credit' || t.type === 'Deposit') ? sum + amount : sum - amount;
      }, 0) || 0;
  };

  const bookBalance = calculateBalance(true);
  const pendingBalance = calculateBalance(false);
  const selectedBalance = unreconciledTransactions
    .filter(t => selectedTransactions.includes(t.id))
    .reduce((sum, t) => {
      const amount = parseFloat(safeStringReplace(t.amount, /[^0-9.-]+/g, "")) || 0;
      return (t.type === 'Credit' || t.type === 'Deposit') ? sum + amount : sum - amount;
    }, 0);

  const handleToggleTransaction = (transactionId: string) => {
    setSelectedTransactions(prev => 
      prev.includes(transactionId) 
        ? prev.filter(id => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const handleReconcile = () => {
    if (!statementBalance) {
      toast.error("Please enter your bank statement balance");
      return;
    }

    const parsedStatementBalance = parseFloat(statementBalance.replace(/[^0-9.-]+/g, "")) || 0;
    const expectedBalance = bookBalance + selectedBalance;
    const diff = Math.abs(parsedStatementBalance - expectedBalance);
    
    if (diff > 0.01) {
      toast.error(`Reconciliation difference: $${diff.toFixed(2)}`, {
        description: "Your statement balance doesn't match the selected transactions."
      });
      return;
    }
    
    // Mark selected transactions as reconciled
    selectedTransactions.forEach(transactionId => {
      updateTransaction(transactionId, { reconciled: true });
    });
    
    setSelectedTransactions([]);
    setStatementBalance("");
    toast.success("Bank reconciliation completed successfully");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Book Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${bookBalance.toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">Reconciled transactions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Selected Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${selectedBalance.toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">{selectedTransactions.length} transactions selected</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Statement Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Input
                type="number"
                step="0.01"
                placeholder="Enter bank statement balance"
                value={statementBalance}
                onChange={(e) => setStatementBalance(e.target.value)}
              />
              <Button 
                onClick={handleReconcile} 
                className="w-full"
                disabled={!statementBalance || selectedTransactions.length === 0}
              >
                Reconcile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Unreconciled Transactions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select transactions that appear on your bank statement
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Select</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unreconciledTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    All transactions have been reconciled
                  </TableCell>
                </TableRow>
              ) : (
                unreconciledTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTransactions.includes(transaction.id)}
                        onCheckedChange={() => handleToggleTransaction(transaction.id)}
                      />
                    </TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>
                      <span className={transaction.type === 'Debit' || transaction.type === 'Withdrawal' ? 'text-red-600' : 'text-green-600'}>
                        {transaction.type === 'Debit' || transaction.type === 'Withdrawal' ? '-' : '+'}
                        ${Math.abs(parseFloat(safeStringReplace(transaction.amount, /[^0-9.-]+/g, "")) || 0).toFixed(2)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
