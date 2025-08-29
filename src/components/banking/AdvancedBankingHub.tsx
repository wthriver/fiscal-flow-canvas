import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CreditCard, 
  TrendingUp, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  DollarSign,
  Calendar,
  FileText,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from "lucide-react";

export const AdvancedBankingHub = () => {
  const [selectedAccount, setSelectedAccount] = useState("main-checking");
  const [isReconciling, setIsReconciling] = useState(false);

  const bankAccounts = [
    { id: "main-checking", name: "Main Checking", balance: 45250.00, type: "Checking", status: "Connected" },
    { id: "savings", name: "Business Savings", balance: 125000.00, type: "Savings", status: "Connected" },
    { id: "credit-line", name: "Credit Line", balance: -15000.00, type: "Credit", status: "Pending" },
    { id: "payroll-account", name: "Payroll Account", balance: 75500.00, type: "Checking", status: "Connected" }
  ];

  const bankFeeds = [
    { bank: "Chase Business", lastSync: "5 minutes ago", status: "Active", transactionCount: 23 },
    { bank: "Wells Fargo", lastSync: "2 hours ago", status: "Active", transactionCount: 8 },
    { bank: "American Express", lastSync: "1 day ago", status: "Inactive", transactionCount: 0 }
  ];

  const cashFlowForecast = [
    { period: "This Week", incoming: 45000, outgoing: 32000, net: 13000 },
    { period: "Next Week", incoming: 38000, outgoing: 28000, net: 10000 },
    { period: "2 Weeks", incoming: 42000, outgoing: 35000, net: 7000 },
    { period: "1 Month", incoming: 165000, outgoing: 140000, net: 25000 }
  ];

  const reconciliationItems = [
    { id: 1, date: "2024-01-15", description: "Direct Deposit - Payroll", amount: 15000, status: "Matched" },
    { id: 2, date: "2024-01-16", description: "Office Supplies - Staples", amount: -245.67, status: "Unmatched" },
    { id: 3, date: "2024-01-17", description: "Client Payment - ABC Corp", amount: 8500, status: "Matched" },
    { id: 4, date: "2024-01-18", description: "Utilities - Electric", amount: -340.22, status: "Suggested" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Advanced Banking Hub</h2>
          <p className="text-muted-foreground">Bank feeds, reconciliation, and cash flow management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsReconciling(!isReconciling)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync All Banks
          </Button>
          <Button>
            <CreditCard className="h-4 w-4 mr-2" />
            Connect New Bank
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {bankAccounts.map((account) => (
          <Card key={account.id} className={`cursor-pointer transition-colors ${selectedAccount === account.id ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedAccount(account.id)}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm">{account.name}</CardTitle>
                <Badge variant={account.status === 'Connected' ? 'default' : 'destructive'}>
                  {account.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${Math.abs(account.balance).toLocaleString()}</div>
              <div className="flex items-center text-sm text-muted-foreground">
                {account.balance >= 0 ? (
                  <ArrowUpCircle className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <ArrowDownCircle className="h-3 w-3 mr-1 text-red-500" />
                )}
                {account.type}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="feeds" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="feeds">Bank Feeds</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="reports">Banking Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="feeds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Bank Feeds</CardTitle>
              <CardDescription>Automatic transaction import from your banks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bankFeeds.map((feed, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${feed.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <h4 className="font-medium">{feed.bank}</h4>
                        <p className="text-sm text-muted-foreground">Last sync: {feed.lastSync}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={feed.status === 'Active' ? 'default' : 'secondary'}>
                        {feed.transactionCount} new
                      </Badge>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reconciliation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bank Reconciliation Assistant</CardTitle>
              <CardDescription>AI-powered transaction matching and reconciliation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Label>Account:</Label>
                    <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {bankAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={() => setIsReconciling(true)}>
                    Start Reconciliation
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {reconciliationItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {item.status === 'Matched' && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {item.status === 'Unmatched' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                        {item.status === 'Suggested' && <RefreshCw className="h-5 w-5 text-blue-500" />}
                        <div>
                          <p className="font-medium">{item.description}</p>
                          <p className="text-sm text-muted-foreground">{item.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`font-medium ${item.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${Math.abs(item.amount).toLocaleString()}
                        </span>
                        <Badge variant={
                          item.status === 'Matched' ? 'default' : 
                          item.status === 'Suggested' ? 'secondary' : 'destructive'
                        }>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Forecasting</CardTitle>
              <CardDescription>Predict future cash positions based on trends and scheduled transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cashFlowForecast.map((period, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{period.period}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">Incoming:</span>
                        <span className="font-medium">${period.incoming.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-red-600">Outgoing:</span>
                        <span className="font-medium">${period.outgoing.toLocaleString()}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-medium">
                          <span>Net:</span>
                          <span className={period.net > 0 ? 'text-green-600' : 'text-red-600'}>
                            ${period.net.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Cash Flow Insights</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Strong positive cash flow projected for the next month</li>
                  <li>• Major client payment expected next week ($25,000)</li>
                  <li>• Quarterly tax payment due in 3 weeks ($12,000)</li>
                  <li>• Consider investing excess cash in short-term instruments</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Bank Statement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Detailed transaction history with reconciliation status
                </p>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Cash Flow Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Historical and projected cash flow patterns
                </p>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Banking Fees Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Analysis of bank fees and optimization recommendations
                </p>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};