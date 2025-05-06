
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, FileBarChart } from "lucide-react";
import { ChartOfAccounts } from "@/components/accounting/ChartOfAccounts";

const Accounting = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold">Accounting</h1>
        <div className="flex flex-wrap gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Journal Entry
          </Button>
          <Button variant="outline">
            <FileBarChart className="mr-2 h-4 w-4" />
            Financial Reports
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="chart-of-accounts">Chart of Accounts</TabsTrigger>
          <TabsTrigger value="journal-entries">Journal Entries</TabsTrigger>
          <TabsTrigger value="financial-reports">Financial Reports</TabsTrigger>
          <TabsTrigger value="tax-forms">Tax Forms</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Profit & Loss</CardTitle>
                <CardDescription>Current month</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">$15,750.00</p>
                <p className="text-xs text-muted-foreground">+8.2% from last month</p>
                <Button variant="link" className="p-0 h-auto mt-2 flex items-center">
                  View report <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Balance Sheet</CardTitle>
                <CardDescription>Total assets</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">$87,300.00</p>
                <p className="text-xs text-muted-foreground">As of today</p>
                <Button variant="link" className="p-0 h-auto mt-2 flex items-center">
                  View report <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Cash Flow</CardTitle>
                <CardDescription>Year to date</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">$32,150.00</p>
                <p className="text-xs text-muted-foreground">+15.3% from last year</p>
                <Button variant="link" className="p-0 h-auto mt-2 flex items-center">
                  View report <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Outstanding Taxes</CardTitle>
                <CardDescription>Due next quarter</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">$5,280.00</p>
                <p className="text-xs text-muted-foreground">Due in 32 days</p>
                <Button variant="link" className="p-0 h-auto mt-2 flex items-center">
                  View details <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue vs. Expenses</CardTitle>
                <CardDescription>Current fiscal year</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <p className="text-muted-foreground">Chart will be displayed here</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Financial Ratios</CardTitle>
                <CardDescription>Key business metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Current Ratio</span>
                    <span className="font-bold">1.8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Quick Ratio</span>
                    <span className="font-bold">1.2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Debt to Equity</span>
                    <span className="font-bold">0.45</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Gross Profit Margin</span>
                    <span className="font-bold">38.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Net Profit Margin</span>
                    <span className="font-bold">12.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Return on Assets</span>
                    <span className="font-bold">8.7%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Journal Entries</CardTitle>
              <CardDescription>Last 5 entries</CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left font-medium text-muted-foreground pb-3">Date</th>
                    <th className="text-left font-medium text-muted-foreground pb-3">Entry #</th>
                    <th className="text-left font-medium text-muted-foreground pb-3">Description</th>
                    <th className="text-right font-medium text-muted-foreground pb-3">Debit</th>
                    <th className="text-right font-medium text-muted-foreground pb-3">Credit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2">05/05/2023</td>
                    <td className="py-2">JE-2023-0125</td>
                    <td className="py-2">Monthly rent payment</td>
                    <td className="py-2 text-right">$4,000.00</td>
                    <td className="py-2 text-right">$4,000.00</td>
                  </tr>
                  <tr>
                    <td className="py-2">05/03/2023</td>
                    <td className="py-2">JE-2023-0124</td>
                    <td className="py-2">Inventory purchase</td>
                    <td className="py-2 text-right">$2,350.00</td>
                    <td className="py-2 text-right">$2,350.00</td>
                  </tr>
                  <tr>
                    <td className="py-2">05/02/2023</td>
                    <td className="py-2">JE-2023-0123</td>
                    <td className="py-2">Payroll processing</td>
                    <td className="py-2 text-right">$8,750.00</td>
                    <td className="py-2 text-right">$8,750.00</td>
                  </tr>
                  <tr>
                    <td className="py-2">05/01/2023</td>
                    <td className="py-2">JE-2023-0122</td>
                    <td className="py-2">Sales revenue recording</td>
                    <td className="py-2 text-right">$12,580.00</td>
                    <td className="py-2 text-right">$12,580.00</td>
                  </tr>
                  <tr>
                    <td className="py-2">04/30/2023</td>
                    <td className="py-2">JE-2023-0121</td>
                    <td className="py-2">Utility bills payment</td>
                    <td className="py-2 text-right">$875.00</td>
                    <td className="py-2 text-right">$875.00</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-4 flex justify-center">
                <Button variant="outline">View All Journal Entries</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="chart-of-accounts">
          <ChartOfAccounts />
        </TabsContent>
        
        <TabsContent value="journal-entries" className="border rounded-md p-4">
          <div className="flex items-center justify-center h-96">
            <p className="text-muted-foreground">Journal Entries will be displayed here.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="financial-reports" className="border rounded-md p-4">
          <div className="flex items-center justify-center h-96">
            <p className="text-muted-foreground">Financial Reports will be displayed here.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="tax-forms" className="border rounded-md p-4">
          <div className="flex items-center justify-center h-96">
            <p className="text-muted-foreground">Tax Forms will be displayed here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Accounting;
