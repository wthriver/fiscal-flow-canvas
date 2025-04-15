
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCompany } from "@/contexts/CompanyContext";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangeDialog } from "@/components/invoices/DateRangeDialog";
import { Download, Calendar } from "lucide-react";

interface ReportsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: string;
  accountName: string;
}

export const ReportsDialog: React.FC<ReportsDialogProps> = ({
  open,
  onOpenChange,
  accountId,
  accountName,
}) => {
  const { currentCompany } = useCompany();
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [activeTab, setActiveTab] = useState("transaction-history");

  // Filter transactions for the specific account
  const accountTransactions = currentCompany.transactions.filter(
    (transaction) => transaction.account === accountName
  );

  // Filter transactions by date range if it's set
  const filteredTransactions = accountTransactions.filter((transaction) => {
    if (!dateRange.from && !dateRange.to) return true;
    
    const transactionDate = new Date(transaction.date);
    
    if (dateRange.from && !dateRange.to) {
      return transactionDate >= dateRange.from;
    }
    
    if (!dateRange.from && dateRange.to) {
      return transactionDate <= dateRange.to;
    }
    
    if (dateRange.from && dateRange.to) {
      return transactionDate >= dateRange.from && transactionDate <= dateRange.to;
    }
    
    return true;
  });

  // Calculate income and expenses data for chart
  const incomeExpenseData = accountTransactions.reduce((acc: any[], transaction) => {
    const date = transaction.date.substring(0, 7); // Get YYYY-MM format
    const amount = parseFloat(transaction.amount.replace(/[^0-9.-]+/g, ""));
    const isIncome = transaction.amount.startsWith("+");
    
    const existingEntry = acc.find((entry) => entry.month === date);
    
    if (existingEntry) {
      if (isIncome) {
        existingEntry.income += amount;
      } else {
        existingEntry.expenses += amount;
      }
      existingEntry.balance = existingEntry.income - existingEntry.expenses;
    } else {
      acc.push({
        month: date,
        income: isIncome ? amount : 0,
        expenses: isIncome ? 0 : amount,
        balance: isIncome ? amount : -amount,
      });
    }
    
    return acc;
  }, []).sort((a, b) => a.month.localeCompare(b.month));

  // Create reconciliation status data
  const reconciliationData = {
    reconciled: accountTransactions.filter(t => t.reconciled).length,
    unreconciled: accountTransactions.filter(t => !t.reconciled).length
  };

  // Calculate account balance over time
  const balanceHistory = accountTransactions
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc: any[], transaction) => {
      const date = transaction.date;
      const amount = parseFloat(transaction.amount.replace(/[^0-9.-]+/g, ""));
      const isIncome = transaction.amount.startsWith("+");
      
      const lastBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0;
      const newBalance = isIncome ? lastBalance + amount : lastBalance - amount;
      
      acc.push({
        date,
        amount: isIncome ? amount : -amount,
        balance: newBalance,
      });
      
      return acc;
    }, []);

  const handleApplyDateRange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
    setDateRangeOpen(false);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    // Generate CSV content based on filtered transactions
    const headers = ["Date", "Description", "Category", "Amount", "Reconciled"];
    const csvRows = [headers.join(",")];

    filteredTransactions.forEach((transaction) => {
      const row = [
        transaction.date,
        `"${transaction.description.replace(/"/g, '""')}"`,
        `"${transaction.category.replace(/"/g, '""')}"`,
        transaction.amount,
        transaction.reconciled ? "Yes" : "No"
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${accountName.replace(/\s+/g, "-")}-Transactions.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{accountName} Reports</DialogTitle>
            <DialogDescription>
              View detailed reports and analytics for your {accountName}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-between items-center pb-2">
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={() => setDateRangeOpen(true)}
              >
                <Calendar className="h-4 w-4" />
                <span>
                  {dateRange.from || dateRange.to ? (
                    <>
                      {dateRange.from ? format(dateRange.from, "MMM d, yyyy") : "Any"} - {dateRange.to ? format(dateRange.to, "MMM d, yyyy") : "Any"}
                    </>
                  ) : (
                    "Date Range"
                  )}
                </span>
              </Button>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={handlePrintReport}
              >
                Print
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={handleDownloadCSV}
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="transaction-history">Transaction History</TabsTrigger>
              <TabsTrigger value="account-statement">Account Statement</TabsTrigger>
              <TabsTrigger value="income-expenses">Income & Expenses</TabsTrigger>
              <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transaction-history" className="max-h-[60vh] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
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
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="account-statement">
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
                        const transaction = accountTransactions.find(t => t.date === entry.date);
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
            </TabsContent>
            
            <TabsContent value="income-expenses">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Income vs. Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={incomeExpenseData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value: any) => [`$${value.toFixed(2)}`, ""]} />
                          <Legend />
                          <Bar dataKey="income" name="Income" fill="#82ca9d" />
                          <Bar dataKey="expenses" name="Expenses" fill="#ff7e7e" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Income</TableHead>
                      <TableHead>Expenses</TableHead>
                      <TableHead>Net</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incomeExpenseData.length > 0 ? (
                      incomeExpenseData.map((entry, index) => (
                        <TableRow key={index}>
                          <TableCell>{entry.month}</TableCell>
                          <TableCell className="text-green-600">${entry.income.toFixed(2)}</TableCell>
                          <TableCell className="text-red-600">${entry.expenses.toFixed(2)}</TableCell>
                          <TableCell className={entry.balance >= 0 ? "text-green-600" : "text-red-600"}>
                            ${entry.balance.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          No data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="reconciliation">
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
                          <span className="font-medium">{accountTransactions.length}</span>
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
                            {accountTransactions.length > 0
                              ? ((reconciliationData.reconciled / accountTransactions.length) * 100).toFixed(1) + "%"
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
                        {accountTransactions.filter(t => !t.reconciled).length > 0 ? (
                          accountTransactions
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
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <DateRangeDialog
        open={dateRangeOpen}
        onOpenChange={setDateRangeOpen}
        onApplyDateRange={handleApplyDateRange}
        currentDateRange={dateRange}
      />
    </>
  );
};
