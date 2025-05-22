
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";

export interface ReconciliationTabProps {
  accountId: string;
}

export const ReconciliationTab: React.FC<ReconciliationTabProps> = ({ accountId }) => {
  const { currentCompany, updateTransaction } = useCompany();
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [statementBalance, setStatementBalance] = useState<string>("");
  
  // Get account info and unreconciled transactions
  const account = currentCompany.bankAccounts.find(acc => acc.id === accountId);
  const unreconciledTransactions = currentCompany.transactions
    .filter(t => !accountId || t.bankAccount === accountId)
    .filter(t => !t.reconciled)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate account balance from transactions
  const calculateBalance = (reconciled: boolean) => {
    return currentCompany.transactions
      .filter(t => (!accountId || t.bankAccount === accountId) && t.reconciled === reconciled)
      .reduce((sum, t) => {
        const amount = parseFloat(t.amount.replace(/[^0-9.-]+/g, "")) || 0;
        return (t.type === 'Credit' || t.type === 'Deposit') ? sum + amount : sum - amount;
      }, 0);
  };

  const bookBalance = calculateBalance(true);
  const pendingBalance = calculateBalance(false);
  const selectedBalance = unreconciledTransactions
    .filter(t => selectedTransactions.includes(t.id))
    .reduce((sum, t) => {
      const amount = parseFloat(t.amount.replace(/[^0-9.-]+/g, "")) || 0;
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
    selectedTransactions.forEach(id => {
      updateTransaction(id, { reconciled: true });
    });
    
    toast.success(`${selectedTransactions.length} transactions reconciled successfully!`);
    setSelectedTransactions([]);
    setStatementBalance("");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Book Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${bookBalance.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">All reconciled transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${pendingBalance.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Unreconciled transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Selected Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${selectedBalance.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{selectedTransactions.length} transactions selected</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Reconciliation</CardTitle>
          <div className="flex items-center gap-2">
            <div>
              <label htmlFor="statement-balance" className="text-sm mr-2">Statement Balance:</label>
              <input 
                id="statement-balance" 
                type="text" 
                value={statementBalance} 
                onChange={e => setStatementBalance(e.target.value)}
                placeholder="$ 0.00"
                className="w-32 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
              />
            </div>
            <Button 
              onClick={handleReconcile}
              disabled={selectedTransactions.length === 0}
            >
              Reconcile
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unreconciledTransactions.length > 0 ? (
                unreconciledTransactions.map(t => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedTransactions.includes(t.id)} 
                        onCheckedChange={() => handleToggleTransaction(t.id)}
                      />
                    </TableCell>
                    <TableCell>{t.date}</TableCell>
                    <TableCell>{t.description}</TableCell>
                    <TableCell>{t.category}</TableCell>
                    <TableCell className={`text-right ${(t.type === 'Credit' || t.type === 'Deposit') ? 'text-green-600' : 'text-red-600'}`}>
                      {(t.type === 'Credit' || t.type === 'Deposit') ? '+' : '-'}{t.amount}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    All transactions have been reconciled.
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
