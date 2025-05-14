
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, Printer, ChevronDown, FileText } from "lucide-react";
import { toast } from "sonner";

export const FinancialReports: React.FC = () => {
  const [period, setPeriod] = useState("current-month");
  const [compareWith, setCompareWith] = useState("previous-year");
  
  const handleExportPDF = () => {
    toast.success("Exporting report to PDF", {
      description: "Your report will be downloaded shortly"
    });
  };
  
  const handlePrintReport = () => {
    toast.info("Preparing report for printing", {
      description: "Your browser print dialog will open shortly"
    });
    setTimeout(() => window.print(), 500);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Financial Reports</h2>
          <p className="text-muted-foreground">Generate and view your business financial reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrintReport}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-month">Current Month</SelectItem>
              <SelectItem value="current-quarter">Current Quarter</SelectItem>
              <SelectItem value="year-to-date">Year to Date</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={compareWith} onValueChange={setCompareWith}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Compare with" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Comparison</SelectItem>
              <SelectItem value="previous-period">Previous Period</SelectItem>
              <SelectItem value="previous-year">Previous Year</SelectItem>
              <SelectItem value="budget">Budget</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span>May 1, 2025 - May 31, 2025</span>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="profit-loss">
        <TabsList className="mb-6">
          <TabsTrigger value="profit-loss">Profit & Loss</TabsTrigger>
          <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
          <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
          <TabsTrigger value="accounts-receivable">Accounts Receivable</TabsTrigger>
          <TabsTrigger value="accounts-payable">Accounts Payable</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profit-loss">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <CardTitle>Profit & Loss Statement</CardTitle>
                  <CardDescription>
                    May 1, 2025 - May 31, 2025 | Compared to Previous Year
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6">
              <div className="space-y-6">
                <div className="rounded-md overflow-hidden border">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left py-2 px-4 font-medium">Account</th>
                        <th className="text-right py-2 px-4 font-medium">Current Period</th>
                        <th className="text-right py-2 px-4 font-medium">Previous Year</th>
                        <th className="text-right py-2 px-4 font-medium">% Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="font-bold bg-muted/30">
                        <td className="py-2 px-4">Revenue</td>
                        <td className="text-right py-2 px-4"></td>
                        <td className="text-right py-2 px-4"></td>
                        <td className="text-right py-2 px-4"></td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 pl-8">Sales Revenue</td>
                        <td className="text-right py-2 px-4">$54,250.00</td>
                        <td className="text-right py-2 px-4">$48,320.00</td>
                        <td className="text-right py-2 px-4 text-green-600">+12.3%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 pl-8">Service Revenue</td>
                        <td className="text-right py-2 px-4">$12,800.00</td>
                        <td className="text-right py-2 px-4">$10,550.00</td>
                        <td className="text-right py-2 px-4 text-green-600">+21.3%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 pl-8">Other Revenue</td>
                        <td className="text-right py-2 px-4">$2,150.00</td>
                        <td className="text-right py-2 px-4">$2,850.00</td>
                        <td className="text-right py-2 px-4 text-red-600">-24.6%</td>
                      </tr>
                      <tr className="border-t font-bold">
                        <td className="py-2 px-4">Total Revenue</td>
                        <td className="text-right py-2 px-4">$69,200.00</td>
                        <td className="text-right py-2 px-4">$61,720.00</td>
                        <td className="text-right py-2 px-4 text-green-600">+12.1%</td>
                      </tr>
                      
                      <tr className="font-bold bg-muted/30">
                        <td className="py-2 px-4">Cost of Sales</td>
                        <td className="text-right py-2 px-4"></td>
                        <td className="text-right py-2 px-4"></td>
                        <td className="text-right py-2 px-4"></td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 pl-8">Cost of Goods Sold</td>
                        <td className="text-right py-2 px-4">$30,450.00</td>
                        <td className="text-right py-2 px-4">$28,350.00</td>
                        <td className="text-right py-2 px-4 text-red-600">+7.4%</td>
                      </tr>
                      <tr className="border-t font-bold">
                        <td className="py-2 px-4">Gross Profit</td>
                        <td className="text-right py-2 px-4">$38,750.00</td>
                        <td className="text-right py-2 px-4">$33,370.00</td>
                        <td className="text-right py-2 px-4 text-green-600">+16.1%</td>
                      </tr>
                      
                      <tr className="font-bold bg-muted/30">
                        <td className="py-2 px-4">Operating Expenses</td>
                        <td className="text-right py-2 px-4"></td>
                        <td className="text-right py-2 px-4"></td>
                        <td className="text-right py-2 px-4"></td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 pl-8">Salary Expenses</td>
                        <td className="text-right py-2 px-4">$18,350.00</td>
                        <td className="text-right py-2 px-4">$17,200.00</td>
                        <td className="text-right py-2 px-4 text-red-600">+6.7%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 pl-8">Rent Expense</td>
                        <td className="text-right py-2 px-4">$4,000.00</td>
                        <td className="text-right py-2 px-4">$4,000.00</td>
                        <td className="text-right py-2 px-4">0.0%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 pl-8">Utilities Expense</td>
                        <td className="text-right py-2 px-4">$875.00</td>
                        <td className="text-right py-2 px-4">$780.00</td>
                        <td className="text-right py-2 px-4 text-red-600">+12.2%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 pl-8">Office Supplies</td>
                        <td className="text-right py-2 px-4">$550.00</td>
                        <td className="text-right py-2 px-4">$620.00</td>
                        <td className="text-right py-2 px-4 text-green-600">-11.3%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 pl-8">Marketing Expense</td>
                        <td className="text-right py-2 px-4">$2,350.00</td>
                        <td className="text-right py-2 px-4">$1,850.00</td>
                        <td className="text-right py-2 px-4 text-red-600">+27.0%</td>
                      </tr>
                      <tr className="border-t font-bold">
                        <td className="py-2 px-4">Total Operating Expenses</td>
                        <td className="text-right py-2 px-4">$26,125.00</td>
                        <td className="text-right py-2 px-4">$24,450.00</td>
                        <td className="text-right py-2 px-4 text-red-600">+6.9%</td>
                      </tr>
                      
                      <tr className="border-t font-bold text-lg">
                        <td className="py-3 px-4">Net Income</td>
                        <td className="text-right py-3 px-4">$12,625.00</td>
                        <td className="text-right py-3 px-4">$8,920.00</td>
                        <td className="text-right py-3 px-4 text-green-600">+41.5%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="balance-sheet">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <CardTitle>Balance Sheet</CardTitle>
                  <CardDescription>
                    As of May 31, 2025 | Compared to Previous Year
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6">
              <div className="space-y-6">
                <div className="rounded-md overflow-hidden border">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left py-2 px-4 font-medium">Account</th>
                        <th className="text-right py-2 px-4 font-medium">Current Period</th>
                        <th className="text-right py-2 px-4 font-medium">Previous Year</th>
                        <th className="text-right py-2 px-4 font-medium">% Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="font-bold bg-muted/30">
                        <td className="py-2 px-4">Assets</td>
                        <td className="text-right py-2 px-4"></td>
                        <td className="text-right py-2 px-4"></td>
                        <td className="text-right py-2 px-4"></td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 pl-8">Cash and Cash Equivalents</td>
                        <td className="text-right py-2 px-4">$35,250.00</td>
                        <td className="text-right py-2 px-4">$28,750.00</td>
                        <td className="text-right py-2 px-4 text-green-600">+22.6%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 pl-8">Accounts Receivable</td>
                        <td className="text-right py-2 px-4">$18,750.00</td>
                        <td className="text-right py-2 px-4">$22,350.00</td>
                        <td className="text-right py-2 px-4 text-green-600">-16.1%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 pl-8">Inventory</td>
                        <td className="text-right py-2 px-4">$24,500.00</td>
                        <td className="text-right py-2 px-4">$18,750.00</td>
                        <td className="text-right py-2 px-4 text-red-600">+30.7%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 pl-8">Fixed Assets</td>
                        <td className="text-right py-2 px-4">$75,800.00</td>
                        <td className="text-right py-2 px-4">$78,250.00</td>
                        <td className="text-right py-2 px-4 text-red-600">-3.1%</td>
                      </tr>
                      <tr className="border-t font-bold">
                        <td className="py-2 px-4">Total Assets</td>
                        <td className="text-right py-2 px-4">$154,300.00</td>
                        <td className="text-right py-2 px-4">$148,100.00</td>
                        <td className="text-right py-2 px-4 text-green-600">+4.2%</td>
                      </tr>
                      
                      <tr className="font-bold bg-muted/30">
                        <td className="py-2 px-4">Liabilities</td>
                        <td className="text-right py-2 px-4"></td>
                        <td className="text-right py-2 px-4"></td>
                        <td className="text-right py-2 px-4"></td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 pl-8">Accounts Payable</td>
                        <td className="text-right py-2 px-4">$12,450.00</td>
                        <td className="text-right py-2 px-4">$14,200.00</td>
                        <td className="text-right py-2 px-4 text-green-600">-12.3%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 pl-8">Short-term Debt</td>
                        <td className="text-right py-2 px-4">$5,800.00</td>
                        <td className="text-right py-2 px-4">$12,350.00</td>
                        <td className="text-right py-2 px-4 text-green-600">-53.0%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 pl-8">Long-term Debt</td>
                        <td className="text-right py-2 px-4">$45,200.00</td>
                        <td className="text-right py-2 px-4">$50,000.00</td>
                        <td className="text-right py-2 px-4 text-green-600">-9.6%</td>
                      </tr>
                      <tr className="border-t font-bold">
                        <td className="py-2 px-4">Total Liabilities</td>
                        <td className="text-right py-2 px-4">$63,450.00</td>
                        <td className="text-right py-2 px-4">$76,550.00</td>
                        <td className="text-right py-2 px-4 text-green-600">-17.1%</td>
                      </tr>
                      
                      <tr className="font-bold bg-muted/30">
                        <td className="py-2 px-4">Equity</td>
                        <td className="text-right py-2 px-4"></td>
                        <td className="text-right py-2 px-4"></td>
                        <td className="text-right py-2 px-4"></td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 pl-8">Owner's Capital</td>
                        <td className="text-right py-2 px-4">$75,000.00</td>
                        <td className="text-right py-2 px-4">$75,000.00</td>
                        <td className="text-right py-2 px-4">0.0%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 pl-8">Retained Earnings</td>
                        <td className="text-right py-2 px-4">$15,850.00</td>
                        <td className="text-right py-2 px-4">($3,450.00)</td>
                        <td className="text-right py-2 px-4 text-green-600">+559.4%</td>
                      </tr>
                      <tr className="border-t font-bold">
                        <td className="py-2 px-4">Total Equity</td>
                        <td className="text-right py-2 px-4">$90,850.00</td>
                        <td className="text-right py-2 px-4">$71,550.00</td>
                        <td className="text-right py-2 px-4 text-green-600">+27.0%</td>
                      </tr>
                      
                      <tr className="border-t font-bold text-lg">
                        <td className="py-3 px-4">Total Liabilities and Equity</td>
                        <td className="text-right py-3 px-4">$154,300.00</td>
                        <td className="text-right py-3 px-4">$148,100.00</td>
                        <td className="text-right py-3 px-4 text-green-600">+4.2%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cash-flow">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <CardTitle>Cash Flow Statement</CardTitle>
                  <CardDescription>
                    May 1, 2025 - May 31, 2025 | Compared to Previous Year
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6">
              <div className="space-y-6">
                <div className="rounded-md overflow-hidden border">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left py-2 px-4 font-medium">Activities</th>
                        <th className="text-right py-2 px-4 font-medium">Current Period</th>
                        <th className="text-right py-2 px-4 font-medium">Previous Year</th>
                        <th className="text-right py-2 px-4 font-medium">% Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="font-bold">
                        <td className="py-2 px-4">Beginning Cash Balance</td>
                        <td className="text-right py-2 px-4">$28,750.00</td>
                        <td className="text-right py-2 px-4">$25,350.00</td>
                        <td className="text-right py-2 px-4 text-green-600">+13.4%</td>
                      </tr>
                      
                      <tr className="font-bold bg-muted/30">
                        <td className="py-2 px-4">Operating Activities</td>
                        <td className="text-right py-2 px-4"></td>
                        <td className="text-right py-2 px-4"></td>
                        <td className="text-right py-2 px-4"></td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 pl-8">Net Income</td>
                        <td className="text-right py-2 px-4">$12,625.00</td>
                        <td className="text-right py-2 px-4">$8,920.00</td>
                        <td className="text-right py-2 px-4 text-green-600">+41.5%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 pl-8">Depreciation</td>
                        <td className="text-right py-2 px-4">$1,250.00</td>
                        <td className="text-right py-2 px-4">$1,250.00</td>
                        <td className="text-right py-2 px-4">0.0%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 pl-8">Decrease in Accounts Receivable</td>
                        <td className="text-right py-2 px-4">$3,600.00</td>
                        <td className="text-right py-2 px-4">$1,250.00</td>
                        <td className="text-right py-2 px-4 text-green-600">+188.0%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 pl-8">Increase in Inventory</td>
                        <td className="text-right py-2 px-4">($5,750.00)</td>
                        <td className="text-right py-2 px-4">($2,350.00)</td>
                        <td className="text-right py-2 px-4 text-red-600">+144.7%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 pl-8">Decrease in Accounts Payable</td>
                        <td className="text-right py-2 px-4">($1,750.00)</td>
                        <td className="text-right py-2 px-4">($850.00)</td>
                        <td className="text-right py-2 px-4 text-red-600">+105.9%</td>
                      </tr>
                      <tr className="border-t">
                        <td className="py-2 px-4">Net Cash from Operating Activities</td>
                        <td className="text-right py-2 px-4">$9,975.00</td>
                        <td className="text-right py-2 px-4">$8,220.00</td>
                        <td className="text-right py-2 px-4 text-green-600">+21.4%</td>
                      </tr>
                      
                      <tr className="font-bold bg-muted/30">
                        <td className="py-2 px-4">Investing Activities</td>
                        <td className="text-right py-2 px-4"></td>
                        <td className="text-right py-2 px-4"></td>
                        <td className="text-right py-2 px-4"></td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 pl-8">Purchase of Equipment</td>
                        <td className="text-right py-2 px-4">($1,200.00)</td>
                        <td className="text-right py-2 px-4">($4,500.00)</td>
                        <td className="text-right py-2 px-4 text-green-600">-73.3%</td>
                      </tr>
                      <tr className="border-t">
                        <td className="py-2 px-4">Net Cash from Investing Activities</td>
                        <td className="text-right py-2 px-4">($1,200.00)</td>
                        <td className="text-right py-2 px-4">($4,500.00)</td>
                        <td className="text-right py-2 px-4 text-green-600">-73.3%</td>
                      </tr>
                      
                      <tr className="font-bold bg-muted/30">
                        <td className="py-2 px-4">Financing Activities</td>
                        <td className="text-right py-2 px-4"></td>
                        <td className="text-right py-2 px-4"></td>
                        <td className="text-right py-2 px-4"></td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 pl-8">Loan Repayment</td>
                        <td className="text-right py-2 px-4">($2,275.00)</td>
                        <td className="text-right py-2 px-4">($2,275.00)</td>
                        <td className="text-right py-2 px-4">0.0%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 pl-8">Owner's Draw</td>
                        <td className="text-right py-2 px-4">$0.00</td>
                        <td className="text-right py-2 px-4">($2,000.00)</td>
                        <td className="text-right py-2 px-4 text-green-600">-100.0%</td>
                      </tr>
                      <tr className="border-t">
                        <td className="py-2 px-4">Net Cash from Financing Activities</td>
                        <td className="text-right py-2 px-4">($2,275.00)</td>
                        <td className="text-right py-2 px-4">($4,275.00)</td>
                        <td className="text-right py-2 px-4 text-green-600">-46.8%</td>
                      </tr>
                      
                      <tr className="border-t font-bold">
                        <td className="py-2 px-4">Net Change in Cash</td>
                        <td className="text-right py-2 px-4">$6,500.00</td>
                        <td className="text-right py-2 px-4">($555.00)</td>
                        <td className="text-right py-2 px-4 text-green-600">+1271.2%</td>
                      </tr>
                      
                      <tr className="border-t font-bold text-lg">
                        <td className="py-3 px-4">Ending Cash Balance</td>
                        <td className="text-right py-3 px-4">$35,250.00</td>
                        <td className="text-right py-3 px-4">$24,795.00</td>
                        <td className="text-right py-3 px-4 text-green-600">+42.2%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="accounts-receivable">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <CardTitle>Accounts Receivable Aging</CardTitle>
                  <CardDescription>
                    As of May 31, 2025
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="text-xs text-green-600 font-medium mb-1">Current</div>
                      <div className="text-2xl font-bold text-green-700">$10,350.00</div>
                      <div className="text-xs text-green-600 mt-1">55.2% of total</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-4">
                      <div className="text-xs text-yellow-600 font-medium mb-1">1-30 Days</div>
                      <div className="text-2xl font-bold text-yellow-700">$4,850.00</div>
                      <div className="text-xs text-yellow-600 mt-1">25.9% of total</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="p-4">
                      <div className="text-xs text-orange-600 font-medium mb-1">31-60 Days</div>
                      <div className="text-2xl font-bold text-orange-700">$2,350.00</div>
                      <div className="text-xs text-orange-600 mt-1">12.5% of total</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-red-50 border-red-200">
                    <CardContent className="p-4">
                      <div className="text-xs text-red-600 font-medium mb-1">61-90 Days</div>
                      <div className="text-2xl font-bold text-red-700">$750.00</div>
                      <div className="text-xs text-red-600 mt-1">4.0% of total</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-red-100 border-red-300">
                    <CardContent className="p-4">
                      <div className="text-xs text-red-700 font-medium mb-1">Over 90 Days</div>
                      <div className="text-2xl font-bold text-red-800">$450.00</div>
                      <div className="text-xs text-red-700 mt-1">2.4% of total</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="rounded-md overflow-hidden border">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left py-2 px-4 font-medium">Customer</th>
                        <th className="text-right py-2 px-4 font-medium">Current</th>
                        <th className="text-right py-2 px-4 font-medium">1-30 Days</th>
                        <th className="text-right py-2 px-4 font-medium">31-60 Days</th>
                        <th className="text-right py-2 px-4 font-medium">61-90 Days</th>
                        <th className="text-right py-2 px-4 font-medium">Over 90 Days</th>
                        <th className="text-right py-2 px-4 font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4">ABC Corp</td>
                        <td className="text-right py-2 px-4">$2,500.00</td>
                        <td className="text-right py-2 px-4">$1,250.00</td>
                        <td className="text-right py-2 px-4">$0.00</td>
                        <td className="text-right py-2 px-4">$0.00</td>
                        <td className="text-right py-2 px-4">$0.00</td>
                        <td className="text-right py-2 px-4 font-medium">$3,750.00</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4">XYZ Industries</td>
                        <td className="text-right py-2 px-4">$3,850.00</td>
                        <td className="text-right py-2 px-4">$1,500.00</td>
                        <td className="text-right py-2 px-4">$750.00</td>
                        <td className="text-right py-2 px-4">$0.00</td>
                        <td className="text-right py-2 px-4">$0.00</td>
                        <td className="text-right py-2 px-4 font-medium">$6,100.00</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4">Acme Enterprises</td>
                        <td className="text-right py-2 px-4">$1,750.00</td>
                        <td className="text-right py-2 px-4">$850.00</td>
                        <td className="text-right py-2 px-4">$1,100.00</td>
                        <td className="text-right py-2 px-4">$300.00</td>
                        <td className="text-right py-2 px-4">$0.00</td>
                        <td className="text-right py-2 px-4 font-medium">$4,000.00</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4">Smith & Co.</td>
                        <td className="text-right py-2 px-4">$1,500.00</td>
                        <td className="text-right py-2 px-4">$750.00</td>
                        <td className="text-right py-2 px-4">$0.00</td>
                        <td className="text-right py-2 px-4">$0.00</td>
                        <td className="text-right py-2 px-4">$0.00</td>
                        <td className="text-right py-2 px-4 font-medium">$2,250.00</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4">Global Ventures</td>
                        <td className="text-right py-2 px-4">$750.00</td>
                        <td className="text-right py-2 px-4">$500.00</td>
                        <td className="text-right py-2 px-4">$500.00</td>
                        <td className="text-right py-2 px-4">$450.00</td>
                        <td className="text-right py-2 px-4">$450.00</td>
                        <td className="text-right py-2 px-4 font-medium">$2,650.00</td>
                      </tr>
                      <tr className="border-t font-bold">
                        <td className="py-2 px-4">Total</td>
                        <td className="text-right py-2 px-4">$10,350.00</td>
                        <td className="text-right py-2 px-4">$4,850.00</td>
                        <td className="text-right py-2 px-4">$2,350.00</td>
                        <td className="text-right py-2 px-4">$750.00</td>
                        <td className="text-right py-2 px-4">$450.00</td>
                        <td className="text-right py-2 px-4">$18,750.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="accounts-payable">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <CardTitle>Accounts Payable Aging</CardTitle>
                  <CardDescription>
                    As of May 31, 2025
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="text-xs text-green-600 font-medium mb-1">Current</div>
                      <div className="text-2xl font-bold text-green-700">$6,350.00</div>
                      <div className="text-xs text-green-600 mt-1">51.0% of total</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-4">
                      <div className="text-xs text-yellow-600 font-medium mb-1">1-30 Days</div>
                      <div className="text-2xl font-bold text-yellow-700">$3,450.00</div>
                      <div className="text-xs text-yellow-600 mt-1">27.7% of total</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="p-4">
                      <div className="text-xs text-orange-600 font-medium mb-1">31-60 Days</div>
                      <div className="text-2xl font-bold text-orange-700">$1,850.00</div>
                      <div className="text-xs text-orange-600 mt-1">14.9% of total</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-red-50 border-red-200">
                    <CardContent className="p-4">
                      <div className="text-xs text-red-600 font-medium mb-1">61-90 Days</div>
                      <div className="text-2xl font-bold text-red-700">$650.00</div>
                      <div className="text-xs text-red-600 mt-1">5.2% of total</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-red-100 border-red-300">
                    <CardContent className="p-4">
                      <div className="text-xs text-red-700 font-medium mb-1">Over 90 Days</div>
                      <div className="text-2xl font-bold text-red-800">$150.00</div>
                      <div className="text-xs text-red-700 mt-1">1.2% of total</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="rounded-md overflow-hidden border">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left py-2 px-4 font-medium">Vendor</th>
                        <th className="text-right py-2 px-4 font-medium">Current</th>
                        <th className="text-right py-2 px-4 font-medium">1-30 Days</th>
                        <th className="text-right py-2 px-4 font-medium">31-60 Days</th>
                        <th className="text-right py-2 px-4 font-medium">61-90 Days</th>
                        <th className="text-right py-2 px-4 font-medium">Over 90 Days</th>
                        <th className="text-right py-2 px-4 font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4">Office Supply Co.</td>
                        <td className="text-right py-2 px-4">$1,350.00</td>
                        <td className="text-right py-2 px-4">$750.00</td>
                        <td className="text-right py-2 px-4">$0.00</td>
                        <td className="text-right py-2 px-4">$0.00</td>
                        <td className="text-right py-2 px-4">$0.00</td>
                        <td className="text-right py-2 px-4 font-medium">$2,100.00</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4">Tech Distributors Inc.</td>
                        <td className="text-right py-2 px-4">$2,850.00</td>
                        <td className="text-right py-2 px-4">$1,250.00</td>
                        <td className="text-right py-2 px-4">$850.00</td>
                        <td className="text-right py-2 px-4">$0.00</td>
                        <td className="text-right py-2 px-4">$0.00</td>
                        <td className="text-right py-2 px-4 font-medium">$4,950.00</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4">Facilities Management</td>
                        <td className="text-right py-2 px-4">$1,000.00</td>
                        <td className="text-right py-2 px-4">$750.00</td>
                        <td className="text-right py-2 px-4">$500.00</td>
                        <td className="text-right py-2 px-4">$350.00</td>
                        <td className="text-right py-2 px-4">$0.00</td>
                        <td className="text-right py-2 px-4 font-medium">$2,600.00</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4">Shipping Services</td>
                        <td className="text-right py-2 px-4">$650.00</td>
                        <td className="text-right py-2 px-4">$350.00</td>
                        <td className="text-right py-2 px-4">$250.00</td>
                        <td className="text-right py-2 px-4">$0.00</td>
                        <td className="text-right py-2 px-4">$0.00</td>
                        <td className="text-right py-2 px-4 font-medium">$1,250.00</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4">Consulting Group</td>
                        <td className="text-right py-2 px-4">$500.00</td>
                        <td className="text-right py-2 px-4">$350.00</td>
                        <td className="text-right py-2 px-4">$250.00</td>
                        <td className="text-right py-2 px-4">$300.00</td>
                        <td className="text-right py-2 px-4">$150.00</td>
                        <td className="text-right py-2 px-4 font-medium">$1,550.00</td>
                      </tr>
                      <tr className="border-t font-bold">
                        <td className="py-2 px-4">Total</td>
                        <td className="text-right py-2 px-4">$6,350.00</td>
                        <td className="text-right py-2 px-4">$3,450.00</td>
                        <td className="text-right py-2 px-4">$1,850.00</td>
                        <td className="text-right py-2 px-4">$650.00</td>
                        <td className="text-right py-2 px-4">$150.00</td>
                        <td className="text-right py-2 px-4">$12,450.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
