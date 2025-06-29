import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, TrendingUp, DollarSign, Calendar, Download } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { FinancialReports } from "@/components/reports/FinancialReports";
import { CustomReportBuilder } from "@/components/reports/CustomReportBuilder";
import { BalanceSheet } from "@/components/reports/BalanceSheet";
import ProfitLossStatement from "@/components/reports/ProfitLossStatement";
import CashFlowStatement from "@/components/reports/CashFlowStatement";

const Reports: React.FC = () => {
  const { currentCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("overview");

  const generateReport = (reportType: string) => {
    console.log(`Generating ${reportType} report`);
    // Implementation for report generation
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Advanced Reporting & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive financial reports and custom analytics</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Reports
        </Button>
      </div>

      {/* Report Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Generated this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custom Reports</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Active custom reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Reports</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Automated reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analytics Insights</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
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
                <CardDescription>Advanced analytics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Revenue Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Monthly revenue growth analysis</p>
                      <Button className="w-full mt-3">View Analytics</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Customer Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Customer behavior and profitability</p>
                      <Button className="w-full mt-3">View Analytics</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Expense Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Cost optimization opportunities</p>
                      <Button className="w-full mt-3">View Analytics</Button>
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
