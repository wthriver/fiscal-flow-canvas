
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Banknote,
  Building,
  CheckCircle,
  AlertCircle,
  Plus
} from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { safeStringStartsWith } from "@/utils/typeHelpers";

export const BankingIntegration: React.FC = () => {
  const { currentCompany } = useCompany();
  
  const bankAccounts = currentCompany.bankAccounts || [];
  const transactions = currentCompany.transactions || [];
  
  const getTotalBalance = () => {
    return bankAccounts.reduce((sum, account) => {
      const balance = typeof account.balance === 'number' ? account.balance : parseFloat(String(account.balance)) || 0;
      return sum + balance;
    }, 0);
  };

  const getRecentTransactions = () => {
    return transactions.slice(0, 10);
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'checking': return <Building className="h-4 w-4" />;
      case 'savings': return <Banknote className="h-4 w-4" />;
      case 'credit': return <CreditCard className="h-4 w-4" />;
      default: return <Building className="h-4 w-4" />;
    }
  };

  const getTransactionIcon = (type: string) => {
    return type === 'Deposit' ? 
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getBalanceColor = (balance: number) => {
    if (balance < 0) return 'text-red-600';
    if (balance > 100000) return 'text-green-600';
    return 'text-blue-600';
  };

  const getAccountBalance = (account: any) => {
    return typeof account.balance === 'number' ? account.balance : parseFloat(String(account.balance)) || 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Banking Integration</h1>
          <p className="text-muted-foreground">Manage your bank accounts and transactions</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Connect Account
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getBalanceColor(getTotalBalance())}`}>
              ${getTotalBalance().toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Accounts</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bankAccounts.length}</div>
            <p className="text-xs text-muted-foreground">Active connections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground">This period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reconciled</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transactions.filter(t => t.reconciled).length}
            </div>
            <p className="text-xs text-muted-foreground">Of {transactions.length} transactions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="accounts" className="w-full">
        <TabsList>
          <TabsTrigger value="accounts">Bank Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Bank Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              {bankAccounts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Bank</TableHead>
                      <TableHead>Account Number</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bankAccounts.map((account) => {
                      const balance = getAccountBalance(account);
                      return (
                        <TableRow key={account.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              {getAccountTypeIcon(account.type || 'checking')}
                              <span>{account.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{account.type || 'Checking'}</Badge>
                          </TableCell>
                          <TableCell>{account.bankName || 'Unknown Bank'}</TableCell>
                          <TableCell>{account.accountNumber || '****0000'}</TableCell>
                          <TableCell className={getBalanceColor(balance)}>
                            ${balance.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge className={(account.isActive ?? true) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {(account.isActive ?? true) ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>{account.openingDate || 'Unknown'}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Building className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No bank accounts connected</p>
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Connect Your First Account
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getRecentTransactions().map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getTransactionIcon(transaction.type || 'Withdrawal')}
                            <div>
                              <div className="font-medium">{transaction.description}</div>
                              {transaction.memo && (
                                <div className="text-sm text-muted-foreground">{transaction.memo}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{transaction.category}</Badge>
                        </TableCell>
                        <TableCell>{transaction.account}</TableCell>
                        <TableCell className={safeStringStartsWith(transaction.amount, '+') ? 'text-green-600' : 'text-red-600'}>
                          {transaction.amount}
                        </TableCell>
                        <TableCell>
                          <Badge className={transaction.reconciled ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {transaction.reconciled ? 'Reconciled' : 'Pending'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No transactions found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reconciliation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Reconciliation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bankAccounts.map((account) => {
                  const accountTransactions = transactions.filter(t => t.account === account.name);
                  const reconciledCount = accountTransactions.filter(t => t.reconciled).length;
                  const reconciliationRate = accountTransactions.length > 0 ? (reconciledCount / accountTransactions.length) * 100 : 0;
                  const balance = getAccountBalance(account);
                  
                  return (
                    <div key={account.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">{account.name}</h3>
                        <Badge className={reconciliationRate === 100 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {Math.round(reconciliationRate)}% Reconciled
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Book Balance</p>
                          <p className="font-medium">${balance.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Transactions</p>
                          <p className="font-medium">{accountTransactions.length}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Reconciled</p>
                          <p className="font-medium">{reconciledCount}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Pending</p>
                          <p className="font-medium">{accountTransactions.length - reconciledCount}</p>
                        </div>
                      </div>
                      <Button className="mt-4" variant="outline" size="sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Reconcile Account
                      </Button>
                    </div>
                  );
                })}
                
                {bankAccounts.length === 0 && (
                  <div className="text-center py-8">
                    <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Connect bank accounts to start reconciliation</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
