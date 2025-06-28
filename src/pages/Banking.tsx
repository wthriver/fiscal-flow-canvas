
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Download, Upload } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { BankingIntegration } from "@/components/banking/BankingIntegration";
import { BankReconciliation } from "@/components/banking/BankReconciliation";
import { CashFlowForecasting } from "@/components/banking/CashFlowForecasting";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddTransactionDialog } from "@/components/banking/AddTransactionDialog";
import { safeStringReplace, safeNumberParse } from "@/utils/typeHelpers";

const Banking: React.FC = () => {
  const { currentCompany, addTransaction } = useCompany();
  const [activeTab, setActiveTab] = useState("accounts");
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const bankAccounts = currentCompany?.bankAccounts || [];
  const transactions = currentCompany?.transactions || [];

  // Get all transactions from all bank accounts
  const allTransactions = bankAccounts.flatMap(account => 
    (account.transactions || []).map(transaction => ({
      ...transaction,
      accountName: account.name
    }))
  );

  // Filter transactions based on search term
  const filteredTransactions = allTransactions.filter(transaction => {
    const searchLower = searchTerm.toLowerCase();
    const amountStr = typeof transaction.amount === 'string' 
      ? transaction.amount 
      : transaction.amount.toString();
    
    return (
      transaction.description.toLowerCase().includes(searchLower) ||
      transaction.category.toLowerCase().includes(searchLower) ||
      safeStringReplace(amountStr, /[^0-9.-]/g, '').includes(searchTerm) ||
      transaction.accountName.toLowerCase().includes(searchLower)
    );
  });

  // Calculate totals
  const totalBalance = bankAccounts.reduce((sum, account) => {
    const balance = typeof account.balance === 'string' 
      ? safeNumberParse(account.balance)
      : account.balance;
    return sum + balance;
  }, 0);

  const monthlyIncome = allTransactions
    .filter(t => t.type === 'Credit' || t.type === 'Deposit')
    .reduce((sum, transaction) => {
      const amount = safeNumberParse(transaction.amount);
      return sum + amount;
    }, 0);

  const monthlyExpenses = allTransactions
    .filter(t => t.type === 'Debit' || t.type === 'Withdrawal')
    .reduce((sum, transaction) => {
      const amount = safeNumberParse(transaction.amount);
      return sum + Math.abs(amount);
    }, 0);

  const handleAddTransaction = (transactionData: any) => {
    addTransaction(transactionData);
    setIsAddTransactionOpen(false);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Banking</h1>
          <p className="text-muted-foreground">Manage your bank accounts and transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsAddTransactionOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across {bankAccounts.length} accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${monthlyIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${monthlyExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">Bank Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bankAccounts.map((account) => (
              <Card key={account.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{account.name}</CardTitle>
                      <CardDescription>
                        {account.bankName} • {account.type}
                      </CardDescription>
                    </div>
                    <Badge variant={account.isActive ? "default" : "secondary"}>
                      {account.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Balance</span>
                      <span className="font-medium">
                        ${typeof account.balance === 'string' 
                          ? safeNumberParse(account.balance).toLocaleString()
                          : account.balance.toLocaleString()
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Account Number</span>
                      <span className="font-mono text-sm">
                        ****{account.accountNumber.slice(-4)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Transactions</span>
                      <span className="text-sm">
                        {account.transactions?.length || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <div className="flex justify-between items-center">
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <div className="text-sm text-muted-foreground">
              {filteredTransactions.length} transactions
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredTransactions.slice(0, 10).map((transaction) => {
                  const amount = safeNumberParse(transaction.amount);
                  const isPositive = amount >= 0;
                  const transactionType = transaction.type;
                  const shouldShowPositive = transactionType === 'Credit' || transactionType === 'Deposit';
                  const displayAmount = shouldShowPositive ? Math.abs(amount) : -Math.abs(amount);
                  
                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{transaction.description}</p>
                          <Badge variant="outline" className="text-xs">
                            {transaction.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{transaction.date}</span>
                          <span>{transaction.category}</span>
                          <span>{transaction.accountName}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          shouldShowPositive ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ${Math.abs(displayAmount).toLocaleString()}
                        </p>
                        {transaction.reconciled && (
                          <Badge variant="outline" className="text-xs">
                            Reconciled
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reconciliation">
          <BankReconciliation />
        </TabsContent>

        <TabsContent value="integration">
          <BankingIntegration />
        </TabsContent>

        <TabsContent value="forecasting">
          <CashFlowForecasting />
        </TabsContent>
      </Tabs>

      <AddTransactionDialog 
        open={isAddTransactionOpen}
        onOpenChange={setIsAddTransactionOpen}
        onSubmit={handleAddTransaction}
        bankAccounts={bankAccounts}
      />
    </div>
  );
};

export default Banking;
