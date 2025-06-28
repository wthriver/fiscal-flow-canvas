
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { FileText, Download, TrendingUp, DollarSign, Calendar, Target, Users } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { CustomReportBuilder } from "@/components/reports/CustomReportBuilder";
import { ForecastingDashboard } from "@/components/budgeting/ForecastingDashboard";
import { FinancialReports } from "@/components/reports/FinancialReports";

const Reports: React.FC = () => {
  const { currentCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("12months");
  const [reportType, setReportType] = useState("summary");

  const transactions = currentCompany?.transactions || [];
  const invoices = currentCompany?.invoices || [];
  const expenses = currentCompany?.expenses || [];
  const revenue = currentCompany?.revenue || { current: 0, previous: 0, percentChange: 0 };

  // Sample data for charts
  const monthlyData = [
    { month: 'Jan', revenue: 85000, expenses: 65000, profit: 20000 },
    { month: 'Feb', revenue: 92000, expenses: 68000, profit: 24000 },
    { month: 'Mar', revenue: 88000, expenses: 70000, profit: 18000 },
    { month: 'Apr', revenue: 95000, expenses: 72000, profit: 23000 },
    { month: 'May', revenue: 98000, expenses: 74000, profit: 24000 },
    { month: 'Jun', revenue: 102000, expenses: 76000, profit: 26000 }
  ];

  const totalRevenue = monthlyData.reduce((sum, month) => sum + month.revenue, 0);
  const totalExpenses = monthlyData.reduce((sum, month) => sum + month.expenses, 0);
  const totalProfit = monthlyData.reduce((sum, month) => sum + month.profit, 0);
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue * 100) : 0;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive financial reporting with forecasting and custom analytics</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="12months">12 Months</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12.3% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8.1% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalProfit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+23.5% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profitMargin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Industry average: 18%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Expenses</CardTitle>
                <CardDescription>Monthly comparison over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                    <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} />
                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Profit</CardTitle>
                <CardDescription>Net profit by month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                    <Bar dataKey="profit" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Reports</CardTitle>
              <CardDescription>Generate commonly used reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">P&L Statement</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">Balance Sheet</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">Cash Flow</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">Tax Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial">
          <FinancialReports />
        </TabsContent>

        <TabsContent value="custom">
          <CustomReportBuilder />
        </TabsContent>

        <TabsContent value="forecasting">
          <ForecastingDashboard />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Intelligence</CardTitle>
                <CardDescription>Advanced analytics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Key Performance Indicators</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Customer Acquisition Cost</span>
                        <span className="text-sm font-medium">${(totalExpenses / 12).toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Average Order Value</span>
                        <span className="text-sm font-medium">${(totalRevenue / invoices.length || 0).toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Monthly Recurring Revenue</span>
                        <span className="text-sm font-medium">${(totalRevenue / 6).toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold">Operational Metrics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Cash Conversion Cycle</span>
                        <span className="text-sm font-medium">42 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Working Capital Ratio</span>
                        <span className="text-sm font-medium">2.1:1</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Inventory Turnover</span>
                        <span className="text-sm font-medium">8.5x</span>
                      </div>
                    </div>
                  </div>
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
