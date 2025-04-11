
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Download, Search, Building, ArrowUpRight, ArrowDownLeft, BarChart4 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Banking: React.FC = () => {
  // Sample accounts data
  const accounts = [
    { id: 1, name: "Business Checking", institution: "First National Bank", balance: "$24,587.65", lastSync: "Today at 9:30 AM" },
    { id: 2, name: "Business Savings", institution: "First National Bank", balance: "$58,900.00", lastSync: "Today at 9:30 AM" },
    { id: 3, name: "Credit Card", institution: "Capital Finance", balance: "-$4,325.18", lastSync: "Yesterday at 11:45 PM" }
  ];

  // Sample transactions data
  const transactions = [
    { id: "TRN-001", account: "Business Checking", date: "2025-04-11", description: "Client Payment - XYZ Corp", amount: "+$5,000.00", category: "Income", reconciled: true },
    { id: "TRN-002", account: "Business Checking", date: "2025-04-10", description: "Office Supplies", amount: "-$156.78", category: "Office Expenses", reconciled: true },
    { id: "TRN-003", account: "Credit Card", date: "2025-04-10", description: "Software Subscription", amount: "-$49.99", category: "Software", reconciled: false },
    { id: "TRN-004", account: "Business Checking", date: "2025-04-09", description: "Utilities - Electricity", amount: "-$235.67", category: "Utilities", reconciled: true },
    { id: "TRN-005", account: "Business Savings", date: "2025-04-08", description: "Transfer from Checking", amount: "+$2,000.00", category: "Transfer", reconciled: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Banking</h1>
          <p className="text-muted-foreground">Manage your financial accounts and transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Building size={16} />
            <span>Connect Bank</span>
          </Button>
          <Button className="flex items-center gap-2">
            <PlusCircle size={16} />
            <span>Add Transaction</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <Card key={account.id}>
            <CardHeader className="pb-2">
              <CardDescription>{account.institution}</CardDescription>
              <CardTitle>{account.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{account.balance}</div>
              <p className="text-xs text-muted-foreground mt-1">Last synced: {account.lastSync}</p>
            </CardContent>
            <CardFooter className="pt-1 flex justify-between">
              <Button variant="ghost" size="sm" className="text-xs">
                <ArrowUpRight size={14} className="mr-1" />
                Transfer Out
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                <ArrowDownLeft size={14} className="mr-1" />
                Transfer In
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                <BarChart4 size={14} className="mr-1" />
                Reports
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search transactions..."
            className="w-full sm:w-[300px] pl-8"
          />
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-1 w-full sm:w-auto">
          <Download size={16} />
          <span>Export Transactions</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Showing the latest transactions across all accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell>{transaction.account}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell className={transaction.amount.startsWith("+") ? "text-green-600" : "text-red-600"}>
                    {transaction.amount}
                  </TableCell>
                  <TableCell className="text-right">
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Banking;
