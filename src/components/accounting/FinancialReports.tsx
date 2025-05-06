
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, FileText, Mail, Printer } from "lucide-react";
import { format } from "date-fns";
import { useCompany } from "@/contexts/CompanyContext";

export const FinancialReports = () => {
  const { currentCompany } = useCompany();
  
  const [activeReport, setActiveReport] = useState("profitLoss");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date(new Date().setMonth(new Date().getMonth() + 1))
  });
  const [reportPeriod, setReportPeriod] = useState("month");
  
  // Sample profit and loss data
  const profitLossData = {
    revenue: [
      { account: "Sales Revenue", amount: 45800 },
      { account: "Service Revenue", amount: 32500 },
      { account: "Other Income", amount: 1250 }
    ],
    expenses: [
      { account: "Cost of Goods Sold", amount: 28500 },
      { account: "Salaries and Wages", amount: 18250 },
      { account: "Rent", amount: 4000 },
      { account: "Utilities", amount: 1250 },
      { account: "Marketing", amount: 3500 },
      { account: "Insurance", amount: 1200 },
      { account: "Office Supplies", amount: 850 },
      { account: "Depreciation", amount: 2300 },
      { account: "Other Expenses", amount: 1150 }
    ]
  };
  
  // Sample balance sheet data
  const balanceSheetData = {
    assets: [
      { account: "Cash", amount: 24500 },
      { account: "Accounts Receivable", amount: 12250 },
      { account: "Inventory", amount: 34750 },
      { account: "Prepaid Expenses", amount: 2500 },
      { account: "Fixed Assets", amount: 85000 },
      { account: "Accumulated Depreciation", amount: -15000 }
    ],
    liabilities: [
      { account: "Accounts Payable", amount: 8350 },
      { account: "Accrued Expenses", amount: 3500 },
      { account: "Short-term Loan", amount: 15000 },
      { account: "Long-term Loan", amount: 75000 }
    ],
    equity: [
      { account: "Common Stock", amount: 50000 },
      { account: "Retained Earnings", amount: 23750 },
      { account: "Current Year Earnings", amount: 18500 }
    ]
  };
  
  // Calculate totals
  const totalRevenue = profitLossData.revenue.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = profitLossData.expenses.reduce((sum, item) => sum + item.amount, 0);
  const netIncome = totalRevenue - totalExpenses;
  
  const totalAssets = balanceSheetData.assets.reduce((sum, item) => sum + item.amount, 0);
  const totalLiabilities = balanceSheetData.liabilities.reduce((sum, item) => sum + item.amount, 0);
  const totalEquity = balanceSheetData.equity.reduce((sum, item) => sum + item.amount, 0);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Financial Reports</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Current Month</SelectItem>
              <SelectItem value="quarter">Current Quarter</SelectItem>
              <SelectItem value="year">Current Year</SelectItem>
              <SelectItem value="custom">Custom Date Range</SelectItem>
            </SelectContent>
          </Select>
          
          {reportPeriod === "custom" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="range"
                  selected={{
                    from: dateRange.from,
                    to: dateRange.to,
                  }}
                  onSelect={(range) => {
                    if (range) {
                      setDateRange({
                        from: range.from || new Date(),
                        to: range.to || new Date()
                      });
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Mail className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs value={activeReport} onValueChange={setActiveReport}>
        <TabsList>
          <TabsTrigger value="profitLoss">Profit & Loss</TabsTrigger>
          <TabsTrigger value="balanceSheet">Balance Sheet</TabsTrigger>
          <TabsTrigger value="cashFlow">Cash Flow</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profitLoss" className="pt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <CardTitle>Profit & Loss Statement</CardTitle>
                  <CardDescription>
                    {reportPeriod === "month" ? "For the Month Ending " : 
                     reportPeriod === "quarter" ? "For the Quarter Ending " : 
                     reportPeriod === "year" ? "For the Year Ending " : 
                     "For the Period "} 
                    {date ? format(date, "MMMM d, yyyy") : ""}
                  </CardDescription>
                </div>
                <div className="text-right mt-2 md:mt-0">
                  <p className="text-sm font-medium">{currentCompany.name}</p>
                  <p className="text-xs text-muted-foreground">{currentCompany.address}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td colSpan={2} className="py-2 font-medium">Revenue</td>
                  </tr>
                  
                  {profitLossData.revenue.map((item, index) => (
                    <tr key={`revenue-${index}`}>
                      <td className="py-1 pl-4">{item.account}</td>
                      <td className="py-1 text-right">${item.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  
                  <tr className="border-t">
                    <td className="py-2 font-medium">Total Revenue</td>
                    <td className="py-2 text-right font-medium">${totalRevenue.toLocaleString()}</td>
                  </tr>
                  
                  <tr className="border-b border-t">
                    <td colSpan={2} className="py-2 font-medium">Expenses</td>
                  </tr>
                  
                  {profitLossData.expenses.map((item, index) => (
                    <tr key={`expense-${index}`}>
                      <td className="py-1 pl-4">{item.account}</td>
                      <td className="py-1 text-right">${item.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  
                  <tr className="border-t">
                    <td className="py-2 font-medium">Total Expenses</td>
                    <td className="py-2 text-right font-medium">${totalExpenses.toLocaleString()}</td>
                  </tr>
                  
                  <tr className="border-t-2 font-medium">
                    <td className="py-3">Net Income</td>
                    <td className={`py-3 text-right ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${netIncome.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
          
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>By source</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <p className="text-muted-foreground">Revenue chart will be displayed here</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>By category</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <p className="text-muted-foreground">Expense chart will be displayed here</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="balanceSheet" className="pt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <CardTitle>Balance Sheet</CardTitle>
                  <CardDescription>
                    As of {date ? format(date, "MMMM d, yyyy") : ""}
                  </CardDescription>
                </div>
                <div className="text-right mt-2 md:mt-0">
                  <p className="text-sm font-medium">{currentCompany.name}</p>
                  <p className="text-xs text-muted-foreground">{currentCompany.address}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td colSpan={2} className="py-2 font-medium">Assets</td>
                  </tr>
                  
                  {balanceSheetData.assets.map((item, index) => (
                    <tr key={`asset-${index}`}>
                      <td className="py-1 pl-4">{item.account}</td>
                      <td className="py-1 text-right">${item.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  
                  <tr className="border-t">
                    <td className="py-2 font-medium">Total Assets</td>
                    <td className="py-2 text-right font-medium">${totalAssets.toLocaleString()}</td>
                  </tr>
                  
                  <tr className="border-b border-t">
                    <td colSpan={2} className="py-2 font-medium">Liabilities</td>
                  </tr>
                  
                  {balanceSheetData.liabilities.map((item, index) => (
                    <tr key={`liability-${index}`}>
                      <td className="py-1 pl-4">{item.account}</td>
                      <td className="py-1 text-right">${item.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  
                  <tr className="border-t">
                    <td className="py-2 font-medium">Total Liabilities</td>
                    <td className="py-2 text-right font-medium">${totalLiabilities.toLocaleString()}</td>
                  </tr>
                  
                  <tr className="border-b border-t">
                    <td colSpan={2} className="py-2 font-medium">Equity</td>
                  </tr>
                  
                  {balanceSheetData.equity.map((item, index) => (
                    <tr key={`equity-${index}`}>
                      <td className="py-1 pl-4">{item.account}</td>
                      <td className="py-1 text-right">${item.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  
                  <tr className="border-t">
                    <td className="py-2 font-medium">Total Equity</td>
                    <td className="py-2 text-right font-medium">${totalEquity.toLocaleString()}</td>
                  </tr>
                  
                  <tr className="border-t-2 font-medium">
                    <td className="py-3">Total Liabilities & Equity</td>
                    <td className="py-3 text-right">
                      ${(totalLiabilities + totalEquity).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
          
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Composition</CardTitle>
                <CardDescription>By category</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <p className="text-muted-foreground">Asset chart will be displayed here</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Liability & Equity Structure</CardTitle>
                <CardDescription>Financing sources</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <p className="text-muted-foreground">Liability & Equity chart will be displayed here</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="cashFlow" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Statement</CardTitle>
              <CardDescription>
                {reportPeriod === "month" ? "For the Month Ending " : 
                 reportPeriod === "quarter" ? "For the Quarter Ending " : 
                 reportPeriod === "year" ? "For the Year Ending " : 
                 "For the Period "} 
                {date ? format(date, "MMMM d, yyyy") : ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Cash Flow Statement will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="custom" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
              <CardDescription>Create and customize your own financial reports</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex flex-col items-center justify-center gap-4">
              <FileText className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Select a template or create a custom report</p>
              <Button>Create Custom Report</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
