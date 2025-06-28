import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calculator, FileText, TrendingUp, DollarSign, Building, Users, PlusCircle } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { AdvancedJournalEntry } from "@/components/journal/AdvancedJournalEntry";
import { FixedAssetsManager } from "@/components/fixedassets/FixedAssetsManager";
import { ReportTabs } from "@/components/banking/reports/ReportTabs";
import { ChartOfAccountsComponent } from "@/components/accounting/ChartOfAccountsComponent";
import { FinancialReports } from "@/components/accounting/FinancialReports";
import { GeneralLedger } from "@/components/accounting/GeneralLedger";
import { safeNumberParse } from "@/utils/typeHelpers";

const Accounting: React.FC = () => {
  const { currentCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("overview");

  const accounts = currentCompany?.accounts || [];
  const transactions = currentCompany?.transactions || [];
  const expenses = currentCompany?.expenses || [];
  const revenue = currentCompany?.revenue || { current: 0, previous: 0, percentChange: 0 };

  // Calculate key metrics with safe number parsing
  const totalAssets = accounts
    .filter(acc => acc.type === 'Asset')
    .reduce((sum, acc) => sum + safeNumberParse(acc.balance || 0), 0);

  const totalLiabilities = accounts
    .filter(acc => acc.type === 'Liability')
    .reduce((sum, acc) => sum + safeNumberParse(acc.balance || 0), 0);

  const totalEquity = accounts
    .filter(acc => acc.type === 'Equity')
    .reduce((sum, acc) => sum + safeNumberParse(acc.balance || 0), 0);

  const netIncome = revenue.current - expenses.reduce((sum, exp) => sum + safeNumberParse(exp.amount || 0), 0);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Accounting</h1>
          <p className="text-muted-foreground">Complete accounting management with advanced features</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Entry
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAssets.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current book value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Liabilities</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalLiabilities.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Outstanding obligations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEquity.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Owner's equity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${netIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This period</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
          <TabsTrigger value="chart">Chart of Accounts</TabsTrigger>
          <TabsTrigger value="ledger">General Ledger</TabsTrigger>
          <TabsTrigger value="assets">Fixed Assets</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Chart of Accounts</CardTitle>
                <CardDescription>Overview of all account balances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'].map(type => {
                    const typeAccounts = accounts.filter(acc => acc.type === type);
                    const typeTotal = typeAccounts.reduce((sum, acc) => sum + safeNumberParse(acc.balance || 0), 0);
                    return (
                      <div key={type}>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{type} Accounts</h4>
                          <span className="font-semibold">${typeTotal.toLocaleString()}</span>
                        </div>
                        <div className="space-y-1">
                          {typeAccounts.slice(0, 3).map(account => (
                            <div key={account.id} className="flex justify-between text-sm">
                              <span>{account.name}</span>
                              <span>${safeNumberParse(account.balance || 0).toLocaleString()}</span>
                            </div>
                          ))}
                          {typeAccounts.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              +{typeAccounts.length - 3} more accounts
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest accounting activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.slice(0, 5).map(transaction => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{transaction.amount}</p>
                        <Badge variant="outline" className="text-xs">{transaction.category}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="journal">
          <AdvancedJournalEntry />
        </TabsContent>

        <TabsContent value="chart">
          <ChartOfAccountsComponent />
        </TabsContent>

        <TabsContent value="ledger">
          <GeneralLedger />
        </TabsContent>

        <TabsContent value="assets">
          <FixedAssetsManager />
        </TabsContent>

        <TabsContent value="reconciliation">
          <ReportTabs accountId="bank-1" />
        </TabsContent>

        <TabsContent value="reports">
          <FinancialReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Accounting;
