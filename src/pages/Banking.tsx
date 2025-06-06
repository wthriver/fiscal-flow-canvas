
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BankingIntegration } from "@/components/banking/BankingIntegration";
import { ReportTabs } from "@/components/banking/reports/ReportTabs";
import { TransactionDialog } from "@/components/banking/TransactionDialog";
import { useCompany } from "@/contexts/CompanyContext";
import { Plus, Search, MoreHorizontal, Edit, Trash, DollarSign, TrendingUp, Building } from "lucide-react";
import { toast } from "sonner";
import { Transaction } from "@/types/company";

const Banking: React.FC = () => {
  const { currentCompany, deleteTransaction, updateTransaction } = useCompany();
  const [activeTab, setActiveTab] = useState("accounts");
  const [searchTerm, setSearchTerm] = useState("");
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState("");

  const allTransactions = currentCompany.bankAccounts.flatMap(account => 
    account.transactions.map(transaction => ({
      ...transaction,
      accountName: account.name,
      accountId: account.id
    }))
  );

  const filteredTransactions = allTransactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.accountName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBalance = currentCompany.bankAccounts.reduce((total, account) => {
    const balance = typeof account.balance === 'string' 
      ? parseFloat(account.balance.replace(/[^0-9.-]+/g, "") || "0")
      : account.balance;
    return total + balance;
  }, 0);

  const monthlyChange = 15.2; // This would be calculated from actual data
  const accountCount = currentCompany.bankAccounts.length;

  const handleEditTransaction = (transaction: Transaction & { accountId: string }) => {
    setEditingTransaction(transaction);
    setSelectedAccountId(transaction.accountId);
    setIsTransactionDialogOpen(true);
  };

  const handleDeleteTransaction = (transactionId: string, accountId: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(transactionId, accountId);
      toast.success("Transaction deleted successfully!");
    }
  };

  const handleAddTransaction = (accountId: string) => {
    setSelectedAccountId(accountId);
    setEditingTransaction(null);
    setIsTransactionDialogOpen(true);
  };

  const toggleReconciled = (transaction: Transaction & { accountId: string }) => {
    updateTransaction(transaction.id, { reconciled: !transaction.reconciled });
    toast.success(`Transaction ${transaction.reconciled ? 'unreconciled' : 'reconciled'}`);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Banking</h1>
          <p className="text-muted-foreground">Manage your bank accounts and transactions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <p className="text-xl font-semibold">${totalBalance.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Monthly Change</p>
                <p className="text-xl font-semibold">+{monthlyChange}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Bank Accounts</p>
                <p className="text-xl font-semibold">{accountCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bank Accounts</CardTitle>
              <CardDescription>Overview of all your connected bank accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentCompany.bankAccounts.map(account => {
                  const balance = typeof account.balance === 'string' 
                    ? parseFloat(account.balance.replace(/[^0-9.-]+/g, "") || "0")
                    : account.balance;
                  
                  return (
                    <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{account.name}</h3>
                        <p className="text-sm text-muted-foreground">{account.type || 'Checking'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${balance.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{account.transactions.length} transactions</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleAddTransaction(account.id)}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add Transaction
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>All transactions across your bank accounts</CardDescription>
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
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell className="font-medium">{transaction.description}</TableCell>
                        <TableCell>{transaction.accountName}</TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell className={transaction.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                          {transaction.amount}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={transaction.reconciled ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => toggleReconciled(transaction)}
                          >
                            {transaction.reconciled ? "Reconciled" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditTransaction(transaction)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteTransaction(transaction.id, transaction.accountId)}
                                className="text-red-600"
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="mt-6">
          <BankingIntegration />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <ReportTabs accountId="" />
        </TabsContent>
      </Tabs>

      <TransactionDialog
        isOpen={isTransactionDialogOpen}
        onClose={() => setIsTransactionDialogOpen(false)}
        transaction={editingTransaction}
        bankAccountId={selectedAccountId}
      />
    </div>
  );
};

export default Banking;
