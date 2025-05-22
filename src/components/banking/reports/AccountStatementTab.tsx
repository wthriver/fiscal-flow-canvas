import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer, FileDown } from 'lucide-react';
import { useCompany } from "@/contexts/CompanyContext";

export interface AccountStatementTabProps {
  accountId: string;
}

export const AccountStatementTab: React.FC<AccountStatementTabProps> = ({ accountId }) => {
  const { currentCompany } = useCompany();
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Get account info
  const account = currentCompany.bankAccounts.find(acc => acc.id === accountId);
  
  // Helper function to convert balance to number
  const parseBalance = (balance: string | number): number => {
    if (typeof balance === 'number') return balance;
    return parseFloat(balance.replace(/[^0-9.-]+/g, "")) || 0;
  };
  
  // Filter transactions based on accountId and date range
  const transactions = currentCompany.transactions
    .filter(t => !accountId || t.bankAccount === accountId)
    .filter(t => {
      const transDate = new Date(t.date);
      return transDate >= new Date(startDate) && transDate <= new Date(endDate);
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate opening and closing balances
  const openingBalance = account ? parseBalance(account.balance) - 
    transactions.reduce((sum, t) => {
      const amount = parseFloat(t.amount.replace(/[^0-9.-]+/g, ""));
      return (t.type === 'Credit' || t.type === 'Deposit') ? sum + amount : sum - amount;
    }, 0) : 0;

  const closingBalance = account ? parseBalance(account.balance) : 0;

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ["Date", "Description", "Type", "Category", "Amount", "Balance"];
    const rows = [headers.join(",")];
    
    let runningBalance = openingBalance;
    transactions.forEach(t => {
      const amount = parseFloat(t.amount.replace(/[^0-9.-]+/g, ""));
      runningBalance = (t.type === 'Credit' || t.type === 'Deposit') ? runningBalance + amount : runningBalance - amount;
      
      const row = [
        t.date,
        `"${(t.description || '').replace(/"/g, '""')}"`,
        t.type,
        t.category || 'Uncategorized',
        t.amount,
        `$${runningBalance.toFixed(2)}`
      ];
      rows.push(row.join(","));
    });
    
    const csvContent = rows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `account_statement_${startDate}_to_${endDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">
            {account ? account.name : 'All Accounts'} Statement
          </h3>
          <p className="text-sm text-muted-foreground">
            {startDate} to {endDate}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer size={16} className="mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <FileDown size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Opening Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${openingBalance.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">as of {startDate}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Closing Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${closingBalance.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">as of {endDate}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="start-date" className="text-sm mb-1">Start Date</label>
                <input 
                  id="start-date" 
                  type="date" 
                  value={startDate} 
                  onChange={e => setStartDate(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="end-date" className="text-sm mb-1">End Date</label>
                <input 
                  id="end-date" 
                  type="date" 
                  value={endDate} 
                  onChange={e => setEndDate(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Running Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? (
                  <>
                    <TableRow>
                      <TableCell colSpan={5} className="font-medium">Opening Balance</TableCell>
                      <TableCell className="text-right font-medium">${openingBalance.toLocaleString()}</TableCell>
                    </TableRow>
                    {(() => {
                      let runningBalance = openingBalance;
                      return transactions.map(t => {
                        const amount = parseFloat(t.amount.replace(/[^0-9.-]+/g, ""));
                        runningBalance = (t.type === 'Credit' || t.type === 'Deposit') ? runningBalance + amount : runningBalance - amount;
                        
                        return (
                          <TableRow key={t.id}>
                            <TableCell>{t.date}</TableCell>
                            <TableCell>{t.description}</TableCell>
                            <TableCell>{t.category}</TableCell>
                            <TableCell>{t.type}</TableCell>
                            <TableCell className={`text-right ${(t.type === 'Credit' || t.type === 'Deposit') ? 'text-green-600' : 'text-red-600'}`}>
                              {(t.type === 'Credit' || t.type === 'Deposit') ? '+' : '-'}{t.amount}
                            </TableCell>
                            <TableCell className="text-right">${runningBalance.toLocaleString()}</TableCell>
                          </TableRow>
                        );
                      });
                    })()}
                    <TableRow>
                      <TableCell colSpan={5} className="font-medium">Closing Balance</TableCell>
                      <TableCell className="text-right font-medium">${closingBalance.toLocaleString()}</TableCell>
                    </TableRow>
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No transactions found for the selected period
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
