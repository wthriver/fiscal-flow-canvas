
import React, { useState } from "react";
import { useCompany } from "@/contexts/CompanyContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileBarChart } from "lucide-react";
import { BankReconciliation } from "@/components/banking/BankReconciliation";
import { AddTransactionDialog } from "@/components/banking/AddTransactionDialog";
import { ReportsDialog } from "@/components/banking/ReportsDialog";
import { CashFlowForecasting } from "@/components/banking/CashFlowForecasting";

const Banking = () => {
  const { currentCompany, addBankAccount } = useCompany();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [selectedAccountName, setSelectedAccountName] = useState<string>("");
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("accounts");

  // Map through bank accounts and sum up the balances
  const totalBalance = currentCompany.bankAccounts.reduce(
    (sum, account) => {
      // Handle both string and number balance types
      let accountBalance = 0;
      if (typeof account.balance === 'string') {
        accountBalance = parseFloat(account.balance.replace(/[^0-9.-]+/g, "") || "0");
      } else if (typeof account.balance === 'number') {
        accountBalance = account.balance;
      }
      return sum + accountBalance;
    },
    0
  );

  // Handle account selection
  const handleAccountSelect = (accountId: string, accountName: string) => {
    setSelectedAccountId(accountId);
    setSelectedAccountName(accountName);
  };

  // Handle add new bank account
  const handleAddBankAccount = () => {
    const newAccount = {
      id: `account-${Date.now()}`,
      name: "New Bank Account",
      type: "Checking",
      balance: 0,
      transactions: []
    };

    addBankAccount(newAccount);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold">Banking</h1>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setIsAddTransactionOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Transaction
          </Button>
          <Button variant="outline" onClick={handleAddBankAccount}>
            <Plus className="mr-2 h-4 w-4" />
            Add Bank Account
          </Button>
          <Button variant="outline" onClick={() => setIsReportsOpen(true)}>
            <FileBarChart className="mr-2 h-4 w-4" />
            Reports
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{currentCompany.bankAccounts.length} connected accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentCompany.transactions?.length || 0}</div>
            <p className="text-xs text-muted-foreground">transactions this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Reconciliation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentCompany.transactions?.filter(t => !t.reconciled)?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">unreconciled transactions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-1 sm:grid-cols-3 mb-4">
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="forecasting">Cash Flow Forecasting</TabsTrigger>
        </TabsList>
        
        <TabsContent value="accounts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Bank Accounts</h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search accounts..." className="pl-8" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentCompany.bankAccounts.map((account) => (
              <Card 
                key={account.id} 
                className={`cursor-pointer hover:border-primary transition-all ${
                  selectedAccountId === account.id ? "border-primary" : ""
                }`}
                onClick={() => handleAccountSelect(account.id, account.name)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <span>{account.name}</span>
                    <span className="text-sm font-normal px-2 py-1 bg-muted rounded-md">
                      {account.type}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${typeof account.balance === 'number' 
                      ? account.balance.toLocaleString() 
                      : parseFloat(account.balance?.replace(/[^0-9.-]+/g, "") || "0").toLocaleString()}
                  </div>
                  <div className="flex justify-between items-center mt-4 text-sm">
                    <span className="text-muted-foreground">Last transaction:</span>
                    <span>{account.lastTransaction || "No transactions"}</span>
                  </div>
                  <div className="flex justify-between gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsAddTransactionOpen(true);
                      }}
                    >
                      Add Transaction
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsReportsOpen(true);
                      }}
                    >
                      View Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add Account Card */}
            <Card className="cursor-pointer border-dashed border-2 flex items-center justify-center h-[200px]" onClick={handleAddBankAccount}>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Plus className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium">Add Account</h3>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Connect a new bank account
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
            <div className="flex gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search transactions..." className="pl-8" />
              </div>
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentCompany.transactions && currentCompany.transactions.length > 0 ? (
                  currentCompany.transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{transaction.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{transaction.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{transaction.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{transaction.bankAccount}</td>
                      <td className={`px-6 py-4 whitespace-nowrap font-medium ${
                        transaction.type === "Credit" || transaction.type === "Deposit" ? "text-green-600" : "text-red-600"
                      }`}>
                        {transaction.type === "Credit" || transaction.type === "Deposit" ? "+" : "-"}{transaction.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          transaction.reconciled 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {transaction.reconciled ? "Reconciled" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="forecasting">
          <CashFlowForecasting />
        </TabsContent>
      </Tabs>

      {/* Add Transaction Dialog */}
      <AddTransactionDialog 
        open={isAddTransactionOpen} 
        onOpenChange={setIsAddTransactionOpen} 
      />

      {/* Reports Dialog */}
      <ReportsDialog 
        open={isReportsOpen} 
        onOpenChange={setIsReportsOpen} 
        accountId={selectedAccountId || ""} 
        accountName={selectedAccountName}
      />
    </div>
  );
};

export default Banking;
