
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Search, Download, FileBarChart, FileText, Users, DollarSign } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";

const Reports = () => {
  const { currentCompany } = useCompany();
  const [reportPeriod, setReportPeriod] = useState("month");

  // Helper function to count items in arrays safely
  const countItems = (items: any[] | undefined) => {
    return items?.length || 0;
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="flex gap-2">
          <Select defaultValue={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">${currentCompany.revenue?.current?.toLocaleString() || 0}</p>
                <p className="text-xs text-green-500">↑ {currentCompany.revenue?.percentChange || 0}% from last month</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full text-green-600">
                <DollarSign size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expenses</p>
                <p className="text-2xl font-bold">${(countItems(currentCompany.expenses) * 500).toLocaleString()}</p>
                <p className="text-xs text-red-500">↑ 3.2% from last month</p>
              </div>
              <div className="bg-red-100 p-2 rounded-full text-red-600">
                <FileText size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Invoices</p>
                <p className="text-2xl font-bold">{countItems(currentCompany.invoices)}</p>
                <p className="text-xs text-green-500">↑ 12% from last month</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                <FileBarChart size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Customers</p>
                <p className="text-2xl font-bold">{countItems(currentCompany.customers)}</p>
                <p className="text-xs text-yellow-500">→ No change from last month</p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-full text-yellow-600">
                <Users size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="financials" className="space-y-6">
        <TabsList>
          <TabsTrigger value="financials">Financial Reports</TabsTrigger>
          <TabsTrigger value="sales">Sales Reports</TabsTrigger>
          <TabsTrigger value="expenses">Expense Reports</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="financials" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle>Profit & Loss Statement</CardTitle>
                <CardDescription>Summary of income, expenses, and profit</CardDescription>
              </div>
              <div className="flex gap-2">
                <Select defaultValue="month">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Revenue</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Sales Revenue</span>
                      <span>$54,250.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Service Revenue</span>
                      <span>$12,800.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Other Revenue</span>
                      <span>$2,150.00</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Total Revenue</span>
                      <span>$69,200.00</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Expenses</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Cost of Goods Sold</span>
                      <span>$30,450.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Operating Expenses</span>
                      <span>$14,200.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Payroll Expenses</span>
                      <span>$8,350.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Taxes</span>
                      <span>$4,200.00</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Total Expenses</span>
                      <span>$57,200.00</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between font-bold text-lg border-t pt-3">
                  <span>Net Profit</span>
                  <span>$12,000.00</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle>Balance Sheet</CardTitle>
                <CardDescription>Summary of assets, liabilities, and equity</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">As of May 11, 2025</span>
                </div>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Assets</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Cash and Cash Equivalents</span>
                      <span>$35,250.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Accounts Receivable</span>
                      <span>$18,750.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Inventory</span>
                      <span>$24,500.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Fixed Assets</span>
                      <span>$75,800.00</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Total Assets</span>
                      <span>$154,300.00</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Liabilities</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Accounts Payable</span>
                      <span>$12,450.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Short-term Debt</span>
                      <span>$5,800.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Long-term Debt</span>
                      <span>$45,200.00</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Total Liabilities</span>
                      <span>$63,450.00</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Equity</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Owner's Capital</span>
                      <span>$75,000.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Retained Earnings</span>
                      <span>$15,850.00</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Total Equity</span>
                      <span>$90,850.00</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between font-bold text-lg border-t pt-3">
                  <span>Total Liabilities and Equity</span>
                  <span>$154,300.00</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Customer</CardTitle>
              <CardDescription>Overview of revenue generated per customer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left">Customer Name</th>
                      <th scope="col" className="px-6 py-3 text-right">Invoiced</th>
                      <th scope="col" className="px-6 py-3 text-right">Paid</th>
                      <th scope="col" className="px-6 py-3 text-right">Outstanding</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCompany.customers?.slice(0, 5).map((customer, index) => (
                      <tr key={customer.id || index} className="border-b">
                        <td className="px-6 py-4">{customer.name}</td>
                        <td className="px-6 py-4 text-right">${(Math.random() * 10000).toFixed(2)}</td>
                        <td className="px-6 py-4 text-right">${(Math.random() * 8000).toFixed(2)}</td>
                        <td className="px-6 py-4 text-right">${(Math.random() * 2000).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expenses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Categories</CardTitle>
              <CardDescription>Breakdown of expenses by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left">Category</th>
                      <th scope="col" className="px-6 py-3 text-right">Amount</th>
                      <th scope="col" className="px-6 py-3 text-right">% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-6 py-4">Office Supplies</td>
                      <td className="px-6 py-4 text-right">$2,345.67</td>
                      <td className="px-6 py-4 text-right">12%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-6 py-4">Rent</td>
                      <td className="px-6 py-4 text-right">$5,000.00</td>
                      <td className="px-6 py-4 text-right">25%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-6 py-4">Utilities</td>
                      <td className="px-6 py-4 text-right">$1,200.00</td>
                      <td className="px-6 py-4 text-right">6%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-6 py-4">Salaries</td>
                      <td className="px-6 py-4 text-right">$9,500.00</td>
                      <td className="px-6 py-4 text-right">47%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-6 py-4">Marketing</td>
                      <td className="px-6 py-4 text-right">$2,100.00</td>
                      <td className="px-6 py-4 text-right">10%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Valuation</CardTitle>
              <CardDescription>Current value of inventory on hand</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left">Item</th>
                      <th scope="col" className="px-6 py-3 text-right">Quantity</th>
                      <th scope="col" className="px-6 py-3 text-right">Unit Cost</th>
                      <th scope="col" className="px-6 py-3 text-right">Total Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(currentCompany.inventory?.items || []).slice(0, 5).map((item, index) => (
                      <tr key={item.id || index} className="border-b">
                        <td className="px-6 py-4">{item.name}</td>
                        <td className="px-6 py-4 text-right">{item.quantity}</td>
                        <td className="px-6 py-4 text-right">{item.cost}</td>
                        <td className="px-6 py-4 text-right">${(parseFloat(item.cost.replace(/[^0-9.-]+/g, "") || "0") * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
