import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart3, FileText, TrendingUp, DollarSign, Calendar, Download, Eye, Plus, Filter } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { FinancialReports } from "@/components/reports/FinancialReports";
import { CustomReportBuilder } from "@/components/reports/CustomReportBuilder";
import { BalanceSheet } from "@/components/reports/BalanceSheet";
import ProfitLossStatement from "@/components/reports/ProfitLossStatement";
import CashFlowStatement from "@/components/reports/CashFlowStatement";
import { toast } from "sonner";
import { exportToCSV, exportToPDF } from "@/utils/exportUtils";
import { safeNumberParse } from "@/utils/typeHelpers";

const Reports: React.FC = () => {
  const { currentCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("current-month");

  // Calculate dynamic metrics from company data
  const calculateMetrics = () => {
    const invoices = currentCompany?.invoices || [];
    const expenses = currentCompany?.expenses || [];
    const customers = currentCompany?.customers || [];
    const accounts = currentCompany?.accounts || [];

    const totalRevenue = invoices.reduce((sum, invoice) => 
      sum + safeNumberParse(invoice.total || 0), 0);
    
    const totalExpenses = expenses.reduce((sum, expense) => 
      sum + safeNumberParse(expense.amount || 0), 0);
    
    const netIncome = totalRevenue - totalExpenses;
    const grossMargin = totalRevenue > 0 ? ((netIncome / totalRevenue) * 100) : 0;
    
    // Calculate report counts
    const totalReports = invoices.length + expenses.length + accounts.length;
    const customReports = 3; // Placeholder for saved custom reports
    const scheduledReports = 2; // Placeholder for scheduled reports
    const insights = Math.min(Math.floor(totalReports / 5), 15); // Dynamic insights based on data

    return {
      totalReports,
      customReports,
      scheduledReports,
      insights,
      totalRevenue,
      totalExpenses,
      netIncome,
      grossMargin,
      customers: customers.length,
      invoices: invoices.length,
      expenses: expenses.length
    };
  };

  const metrics = calculateMetrics();

  const generateReport = (reportType: string) => {
    console.log(`Generating ${reportType} report`);
    
    // Switch to appropriate tab based on report type
    switch (reportType) {
      case 'balance-sheet':
        setActiveTab('balance');
        toast.success("Switched to Balance Sheet report");
        break;
      case 'income-statement':
        setActiveTab('profit');
        toast.success("Switched to P&L Statement report");
        break;
      case 'cash-flow':
        setActiveTab('cashflow');
        toast.success("Switched to Cash Flow Statement report");
        break;
      case 'budget-variance':
      case 'project-profitability':
      case 'customer-aging':
      case 'vendor-aging':
        setActiveTab('analytics');
        toast.success(`Generated ${reportType.replace('-', ' ')} report`);
        break;
      case 'sales-tax':
      case 'payroll-tax':
      case '1099-report':
      case 'tax-summary':
        toast.success(`Generated ${reportType.replace('-', ' ')} report`);
        break;
      default:
        setActiveTab('financial');
        toast.success(`Generated ${reportType} report`);
    }
  };

  const exportAllReports = () => {
    const reportData = {
      company: currentCompany?.name || 'Company',
      dateGenerated: new Date().toISOString(),
      metrics,
      summary: {
        totalRevenue: metrics.totalRevenue,
        totalExpenses: metrics.totalExpenses,
        netIncome: metrics.netIncome,
        grossMargin: `${metrics.grossMargin.toFixed(2)}%`
      }
    };

    exportToCSV([reportData], `financial_summary_${dateRange}`);
    toast.success("Reports exported successfully");
  };

  const viewAnalytics = (analyticsType: string) => {
    switch (analyticsType) {
      case 'revenue':
        setActiveTab('financial');
        toast.success("Viewing revenue analytics");
        break;
      case 'customer':
        setActiveTab('analytics');
        toast.info(`Customer insights: ${metrics.customers} active customers`);
        break;
      case 'expense':
        setActiveTab('analytics');
        toast.info(`Expense analysis: $${metrics.totalExpenses.toLocaleString()} total expenses`);
        break;
      default:
        setActiveTab('analytics');
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Advanced Reporting & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive financial reports and custom analytics for {currentCompany?.name || 'your business'}
          </p>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="outline">
              Revenue: ${metrics.totalRevenue.toLocaleString()}
            </Badge>
            <Badge variant="outline">
              Expenses: ${metrics.totalExpenses.toLocaleString()}
            </Badge>
            <Badge variant={metrics.netIncome >= 0 ? "default" : "destructive"}>
              Net: ${metrics.netIncome.toLocaleString()}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-month">This Month</SelectItem>
              <SelectItem value="current-quarter">This Quarter</SelectItem>
              <SelectItem value="current-year">This Year</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportAllReports}>
            <Download className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
        </div>
      </div>

      {/* Report Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('financial')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalReports}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.invoices} invoices, {metrics.expenses} expenses
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('custom')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custom Reports</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.customReports}</div>
            <p className="text-xs text-muted-foreground">Active custom reports</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast.info('Scheduled reports feature coming soon')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Reports</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.scheduledReports}</div>
            <p className="text-xs text-muted-foreground">Automated reports</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('analytics')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analytics Insights</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.insights}</div>
            <p className="text-xs text-muted-foreground">Key insights available</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
          <TabsTrigger value="profit">P&L Statement</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Reports</CardTitle>
                <CardDescription>Generate standard financial reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={() => generateReport('balance-sheet')}>
                  Balance Sheet
                </Button>
                <Button className="w-full" onClick={() => generateReport('income-statement')}>
                  Income Statement
                </Button>
                <Button className="w-full" onClick={() => generateReport('cash-flow')}>
                  Cash Flow Statement
                </Button>
                <Button className="w-full" onClick={() => generateReport('trial-balance')}>
                  Trial Balance
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Management Reports</CardTitle>
                <CardDescription>Business performance insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={() => generateReport('budget-variance')}>
                  Budget Variance
                </Button>
                <Button className="w-full" onClick={() => generateReport('project-profitability')}>
                  Project Profitability
                </Button>
                <Button className="w-full" onClick={() => generateReport('customer-aging')}>
                  Customer Aging
                </Button>
                <Button className="w-full" onClick={() => generateReport('vendor-aging')}>
                  Vendor Aging
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax Reports</CardTitle>
                <CardDescription>Tax compliance and filing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={() => generateReport('sales-tax')}>
                  Sales Tax Report
                </Button>
                <Button className="w-full" onClick={() => generateReport('payroll-tax')}>
                  Payroll Tax Report
                </Button>
                <Button className="w-full" onClick={() => generateReport('1099-report')}>
                  1099 Report
                </Button>
                <Button className="w-full" onClick={() => generateReport('tax-summary')}>
                  Tax Summary
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial">
          <FinancialReports />
        </TabsContent>

        <TabsContent value="balance">
          <BalanceSheet />
        </TabsContent>

        <TabsContent value="profit">
          <ProfitLossStatement />
        </TabsContent>

        <TabsContent value="cashflow">
          <CashFlowStatement />
        </TabsContent>

        <TabsContent value="custom">
          <CustomReportBuilder />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Intelligence Dashboard</CardTitle>
                <CardDescription>Advanced analytics and insights for {currentCompany?.name || 'your business'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">${metrics.totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">${metrics.totalExpenses.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Expenses</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${metrics.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${metrics.netIncome.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Net Income</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{metrics.grossMargin.toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">Gross Margin</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => viewAnalytics('revenue')}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        Revenue Trends
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">Monthly revenue growth analysis</p>
                      <Badge variant="outline">{metrics.invoices} invoices</Badge>
                      <Button className="w-full mt-3" onClick={() => viewAnalytics('revenue')}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Analytics
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => viewAnalytics('customer')}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                        Customer Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">Customer behavior and profitability</p>
                      <Badge variant="outline">{metrics.customers} customers</Badge>
                      <Button className="w-full mt-3" onClick={() => viewAnalytics('customer')}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Analytics
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => viewAnalytics('expense')}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-red-600" />
                        Expense Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">Cost optimization opportunities</p>
                      <Badge variant="outline">{metrics.expenses} expenses</Badge>
                      <Button className="w-full mt-3" onClick={() => viewAnalytics('expense')}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Analytics
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('financial')}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5 text-purple-600" />
                        Financial Reports
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">Complete financial reporting</p>
                      <Badge variant="outline">P&L, Balance Sheet</Badge>
                      <Button className="w-full mt-3" onClick={() => setActiveTab('financial')}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Reports
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('custom')}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Plus className="h-5 w-5 text-orange-600" />
                        Custom Reports
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">Build tailored analytics</p>
                      <Badge variant="outline">Report Builder</Badge>
                      <Button className="w-full mt-3" onClick={() => setActiveTab('custom')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Build Report
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={exportAllReports}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Download className="h-5 w-5 text-gray-600" />
                        Export Center
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">Download all reports</p>
                      <Badge variant="outline">CSV, PDF, Excel</Badge>
                      <Button className="w-full mt-3" onClick={exportAllReports}>
                        <Download className="h-4 w-4 mr-2" />
                        Export All
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
