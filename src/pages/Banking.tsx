import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Download, Upload, DollarSign, TrendingUp, AlertCircle, CheckCircle, 
         RefreshCw, Filter, Search, Settings, CreditCard, Banknote, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { BankingIntegration } from "@/components/banking/BankingIntegration";
import { BankReconciliation } from "@/components/banking/BankReconciliation";
import { CashFlowForecasting } from "@/components/banking/CashFlowForecasting";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddTransactionDialog } from "@/components/banking/AddTransactionDialog";
import { BankAccountDialog } from "@/components/banking/BankAccountDialog";
import { safeStringReplace, safeNumberParse } from "@/utils/typeHelpers";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const Banking: React.FC = () => {
  const { currentCompany, addTransaction, addBankAccount, updateBankAccount, updateTransaction } = useCompany();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [transactionFilter, setTransactionFilter] = useState("all");
  const [isReconciliationMode, setIsReconciliationMode] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [showBankRules, setShowBankRules] = useState(false);

  const bankAccounts = currentCompany?.bankAccounts || [];
  const transactions = currentCompany?.transactions || [];

  // Get all transactions from all bank accounts
  const allTransactions = bankAccounts.flatMap(account => 
    (account.transactions || []).map(transaction => ({
      ...transaction,
      accountName: account.name,
      accountId: account.id
    }))
  );

  // Enhanced filtering with period and type filters
  const filteredTransactions = allTransactions.filter(transaction => {
    const searchLower = searchTerm.toLowerCase();
    const amountStr = typeof transaction.amount === 'string' 
      ? transaction.amount 
      : transaction.amount.toString();
    
    const matchesSearch = searchTerm === "" || (
      transaction.description.toLowerCase().includes(searchLower) ||
      transaction.category.toLowerCase().includes(searchLower) ||
      safeStringReplace(amountStr, /[^0-9.-]/g, '').includes(searchTerm) ||
      transaction.accountName.toLowerCase().includes(searchLower)
    );

    const matchesFilter = transactionFilter === "all" || 
      (transactionFilter === "deposits" && (transaction.type === 'Credit' || transaction.type === 'Deposit')) ||
      (transactionFilter === "withdrawals" && (transaction.type === 'Debit' || transaction.type === 'Withdrawal')) ||
      (transactionFilter === "unreconciled" && !transaction.reconciled) ||
      (transactionFilter === "reconciled" && transaction.reconciled);

    // Date filtering based on selected period
    const transactionDate = new Date(transaction.date);
    const now = new Date();
    const periodDays = parseInt(selectedPeriod);
    const periodStart = new Date(now.getTime() - (periodDays * 24 * 60 * 60 * 1000));
    const matchesPeriod = selectedPeriod === "all" || transactionDate >= periodStart;

    return matchesSearch && matchesFilter && matchesPeriod;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Enhanced calculations
  const totalBalance = bankAccounts.reduce((sum, account) => {
    const balance = typeof account.balance === 'string' 
      ? safeNumberParse(account.balance)
      : account.balance;
    return sum + balance;
  }, 0);

  const monthlyIncome = allTransactions
    .filter(t => {
      const date = new Date(t.date);
      const thisMonth = new Date();
      return date.getMonth() === thisMonth.getMonth() && 
             date.getFullYear() === thisMonth.getFullYear() &&
             (t.type === 'Credit' || t.type === 'Deposit');
    })
    .reduce((sum, transaction) => {
      const amount = safeNumberParse(transaction.amount);
      return sum + amount;
    }, 0);

  const monthlyExpenses = allTransactions
    .filter(t => {
      const date = new Date(t.date);
      const thisMonth = new Date();
      return date.getMonth() === thisMonth.getMonth() && 
             date.getFullYear() === thisMonth.getFullYear() &&
             (t.type === 'Debit' || t.type === 'Withdrawal');
    })
    .reduce((sum, transaction) => {
      const amount = safeNumberParse(transaction.amount);
      return sum + Math.abs(amount);
    }, 0);

  const unreconciledTransactions = allTransactions.filter(t => !t.reconciled);
  const connecteddAccounts = bankAccounts.filter(acc => acc.isActive !== false);
  const cashFlow = monthlyIncome - monthlyExpenses;

  // Enhanced event handlers
  const handleAddTransaction = (transactionData: any) => {
    addTransaction(transactionData);
    setIsAddTransactionOpen(false);
    toast.success("Transaction added successfully");
  };

  const handleAddBankAccount = (accountData: any) => {
    if (editingAccount) {
      updateBankAccount(accountData);
      toast.success("Bank account updated successfully");
    } else {
      addBankAccount(accountData);
      toast.success("Bank account added successfully");
    }
    setIsAddAccountOpen(false);
    setEditingAccount(null);
  };

  const handleEditAccount = (account: any) => {
    setEditingAccount(account);
    setIsAddAccountOpen(true);
  };

  const handleToggleReconciled = (transactionId: string) => {
    const transaction = allTransactions.find(t => t.id === transactionId);
    if (transaction) {
      updateTransaction(transactionId, { reconciled: !transaction.reconciled });
      toast.success(`Transaction ${transaction.reconciled ? 'unreconciled' : 'reconciled'}`);
    }
  };

  const handleBulkReconcile = () => {
    selectedTransactions.forEach(transactionId => {
      updateTransaction(transactionId, { reconciled: true });
    });
    setSelectedTransactions([]);
    toast.success(`${selectedTransactions.length} transactions reconciled`);
  };

  const handleSyncBankFeeds = () => {
    toast.info("Syncing bank feeds...");
    // Simulate sync delay
    setTimeout(() => {
      toast.success("Bank feeds synchronized successfully");
    }, 2000);
  };

  const handleCreateBankRule = () => {
    toast.info("Opening bank rules configuration");
    setShowBankRules(true);
  };

  const handleImportTransactions = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls,.qbo,.ofx';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        toast.success(`Importing transactions from ${file.name}`);
        // Here you would implement actual file parsing
      }
    };
    input.click();
  };

  const handleExportTransactions = () => {
    const data = filteredTransactions.map(t => ({
      Date: t.date,
      Description: t.description,
      Account: t.accountName,
      Category: t.category,
      Type: t.type,
      Amount: t.amount,
      Reconciled: t.reconciled ? 'Yes' : 'No',
      Reference: t.reference || '',
      Memo: t.memo || ''
    }));
    
    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `banking_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Transactions exported successfully');
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Banking & Cash Management</h1>
          <p className="text-muted-foreground">
            Complete banking solution with reconciliation, forecasting, and integration
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSyncBankFeeds}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Feeds
          </Button>
          <Button variant="outline" size="sm" onClick={handleImportTransactions}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportTransactions}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsAddTransactionOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
          <TabsTrigger value="integration">Bank Feeds</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          <TabsTrigger value="rules">Rules & Automation</TabsTrigger>
        </TabsList>

        {/* Enhanced Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cash</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalBalance.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Across {connecteddAccounts.length} connected accounts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Cash Flow</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${Math.abs(cashFlow).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {cashFlow >= 0 ? 'Positive' : 'Negative'} cash flow this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unreconciled</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{unreconciledTransactions.length}</div>
                <p className="text-xs text-muted-foreground">
                  Transactions need reconciliation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Connected Accounts</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{connecteddAccounts.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active bank connections
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Account Overview and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Account Overview</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("accounts")}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bankAccounts.slice(0, 4).map((account) => {
                    const balance = typeof account.balance === 'string' 
                      ? safeNumberParse(account.balance)
                      : account.balance;
                    return (
                      <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Banknote className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{account.name}</p>
                            <p className="text-sm text-muted-foreground">{account.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${balance.toLocaleString()}</p>
                          <Badge variant={account.isActive === false ? "secondary" : "default"} className="text-xs">
                            {account.isActive === false ? "Inactive" : "Active"}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Transactions</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("transactions")}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allTransactions.slice(0, 5).map((transaction) => {
                    const amount = safeNumberParse(transaction.amount);
                    const isIncome = transaction.type === 'Credit' || transaction.type === 'Deposit';
                    
                    return (
                      <div key={transaction.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            isIncome ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {isIncome ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{transaction.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {transaction.date} • {transaction.accountName}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                            {isIncome ? '+' : '-'}${Math.abs(amount).toLocaleString()}
                          </p>
                          {transaction.reconciled && (
                            <CheckCircle className="h-3 w-3 text-green-500 ml-auto" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cash Flow Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Trend</CardTitle>
              <CardDescription>30-day cash flow analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center border border-dashed rounded-lg">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Cash Flow Chart</p>
                  <p className="text-xs text-muted-foreground">Chart visualization would appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enhanced Accounts Tab */}
        <TabsContent value="accounts" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Bank Accounts</h3>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCreateBankRule}>
                <Settings className="h-4 w-4 mr-2" />
                Rules
              </Button>
              <Button onClick={() => setIsAddAccountOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Account
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bankAccounts.map((account) => {
              const balance = typeof account.balance === 'string' 
                ? safeNumberParse(account.balance)
                : account.balance;
              const accountTransactions = account.transactions || [];
              const unreconciledCount = accountTransactions.filter(t => !t.reconciled).length;
              
              return (
                <Card key={account.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{account.name}</CardTitle>
                        <CardDescription>
                          {account.bankName} • {account.type}
                        </CardDescription>
                      </div>
                      <Badge variant={account.isActive !== false ? "default" : "secondary"}>
                        {account.isActive !== false ? "Connected" : "Disconnected"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Current Balance</span>
                        <span className="font-bold text-lg">${balance.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Account Number</span>
                        <span className="font-mono text-sm">****{account.accountNumber.slice(-4)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Transactions</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{accountTransactions.length}</span>
                          {unreconciledCount > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {unreconciledCount} unreconciled
                            </Badge>
                          )}
                        </div>
                      </div>

                      <Separator />
                      
                      <div className="flex justify-between gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditAccount(account)}
                          className="flex-1"
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setActiveTab("transactions")}
                          className="flex-1"
                        >
                          Transactions
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {/* Add New Account Card */}
            <Card className="border-dashed hover:shadow-md transition-shadow cursor-pointer" 
                  onClick={() => setIsAddAccountOpen(true)}>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <PlusCircle className="h-8 w-8 text-muted-foreground mb-3" />
                <h3 className="font-semibold mb-1">Add Bank Account</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Connect a new bank account to track transactions
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Enhanced Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={transactionFilter} onValueChange={setTransactionFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All transactions</SelectItem>
                  <SelectItem value="deposits">Deposits only</SelectItem>
                  <SelectItem value="withdrawals">Withdrawals only</SelectItem>
                  <SelectItem value="unreconciled">Unreconciled</SelectItem>
                  <SelectItem value="reconciled">Reconciled</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {isReconciliationMode && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">Reconciliation Mode</span>
                    <Badge variant="outline">{selectedTransactions.length} selected</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleBulkReconcile} disabled={selectedTransactions.length === 0}>
                      Mark as Reconciled
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => {
                      setIsReconciliationMode(false);
                      setSelectedTransactions([]);
                    }}>
                      Exit Mode
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Transactions</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {filteredTransactions.length} transactions
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setIsReconciliationMode(!isReconciliationMode)}
                  >
                    {isReconciliationMode ? 'Exit' : 'Reconcile'} Mode
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredTransactions.slice(0, 20).map((transaction) => {
                  const amount = safeNumberParse(transaction.amount);
                  const isIncome = transaction.type === 'Credit' || transaction.type === 'Deposit';
                  const isSelected = selectedTransactions.includes(transaction.id);
                  
                  return (
                    <div
                      key={transaction.id}
                      className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                        isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isReconciliationMode && (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              if (isSelected) {
                                setSelectedTransactions(prev => prev.filter(id => id !== transaction.id));
                              } else {
                                setSelectedTransactions(prev => [...prev, transaction.id]);
                              }
                            }}
                            className="rounded"
                          />
                        )}
                        
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isIncome ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {isIncome ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{transaction.description}</p>
                            <Badge variant="outline" className="text-xs">
                              {transaction.type}
                            </Badge>
                            {transaction.reconciled && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{transaction.date}</span>
                            <span>{transaction.category}</span>
                            <span>{transaction.accountName}</span>
                            {transaction.reference && <span>Ref: {transaction.reference}</span>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={`font-medium ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                          {isIncome ? '+' : '-'}${Math.abs(amount).toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleReconciled(transaction.id)}
                          >
                            {transaction.reconciled ? 'Unreconcile' : 'Reconcile'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {filteredTransactions.length === 0 && (
                  <div className="text-center py-8">
                    <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm ? 'Try adjusting your search criteria' : 'Add your first transaction to get started'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Existing tabs with enhanced features */}
        <TabsContent value="reconciliation">
          <BankReconciliation />
        </TabsContent>

        <TabsContent value="integration">
          <BankingIntegration />
        </TabsContent>

        <TabsContent value="forecasting">
          <CashFlowForecasting />
        </TabsContent>

        {/* New Rules & Automation Tab */}
        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bank Rules & Automation</CardTitle>
              <CardDescription>
                Set up rules to automatically categorize transactions and streamline your workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Bank Rules Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  Automatic transaction categorization and processing rules will be available here
                </p>
                <Button onClick={handleCreateBankRule}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create First Rule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AddTransactionDialog 
        open={isAddTransactionOpen}
        onOpenChange={setIsAddTransactionOpen}
        onSubmit={handleAddTransaction}
        bankAccounts={bankAccounts}
      />

      <BankAccountDialog 
        open={isAddAccountOpen}
        onOpenChange={setIsAddAccountOpen}
        onSubmit={handleAddBankAccount}
        account={editingAccount}
      />
    </div>
  );
};

export default Banking;
