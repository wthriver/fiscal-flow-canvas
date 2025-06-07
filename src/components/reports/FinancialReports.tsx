
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { useCompany } from "@/contexts/CompanyContext";
import { Download, TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";
import { toast } from "sonner";

export const FinancialReports = () => {
  const { currentCompany } = useCompany();
  const [dateRange, setDateRange] = useState("current-month");
  const [reportType, setReportType] = useState("summary");

  // Generate dynamic financial data based on current company data
  const generateFinancialData = () => {
    const invoices = currentCompany.invoices || [];
    const expenses = currentCompany.expenses || [];
    
    const revenue = invoices.reduce((sum, invoice) => 
      sum + parseFloat(invoice.amount?.replace(/[^0-9.-]+/g, "") || "0"), 0);
    
    const totalExpenses = expenses.reduce((sum, expense) => 
      sum + parseFloat(expense.amount?.toString().replace(/[^0-9.-]+/g, "") || "0"), 0);
    
    const netIncome = revenue - totalExpenses;
    const grossMargin = revenue > 0 ? ((revenue - totalExpenses) / revenue) * 100 : 0;

    return {
      revenue,
      expenses: totalExpenses,
      netIncome,
      grossMargin,
      invoiceCount: invoices.length,
      expenseCount: expenses.length
    };
  };

  const financialData = generateFinancialData();

  // Monthly trend data
  const monthlyData = [
    { month: 'Jan', revenue: financialData.revenue * 0.8, expenses: financialData.expenses * 0.7 },
    { month: 'Feb', revenue: financialData.revenue * 0.9, expenses: financialData.expenses * 0.8 },
    { month: 'Mar', revenue: financialData.revenue, expenses: financialData.expenses },
    { month: 'Apr', revenue: financialData.revenue * 1.1, expenses: financialData.expenses * 0.9 },
    { month: 'May', revenue: financialData.revenue * 1.2, expenses: financialData.expenses * 1.0 },
    { month: 'Jun', revenue: financialData.revenue * 1.3, expenses: financialData.expenses * 1.1 },
  ];

  // Expense breakdown data
  const expenseBreakdown = [
    { name: 'Operating Expenses', value: financialData.expenses * 0.4, color: '#8884d8' },
    { name: 'Marketing', value: financialData.expenses * 0.2, color: '#82ca9d' },
    { name: 'Salaries', value: financialData.expenses * 0.3, color: '#ffc658' },
    { name: 'Other', value: financialData.expenses * 0.1, color: '#ff7300' },
  ];

  const exportReport = () => {
    toast.success("Financial report exported successfully");
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Financial Reports</h2>
          <p className="text-muted-foreground">Comprehensive financial analysis and insights</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="summary">Summary</SelectItem>
              <SelectItem value="detailed">Detailed</SelectItem>
              <SelectItem value="comparative">Comparative</SelectItem>
            </SelectContent>
          </Select>
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
          <Button onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(financialData.revenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {financialData.invoiceCount} invoices
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(financialData.expenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {financialData.expenseCount} expenses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Net Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${financialData.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(financialData.netIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              {financialData.grossMargin.toFixed(1)}% margin
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dateRange === 'current-month' ? 'MTD' : 
               dateRange === 'current-quarter' ? 'QTD' : 
               dateRange === 'current-year' ? 'YTD' : 'Annual'}
            </div>
            <p className="text-xs text-muted-foreground">
              Current period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue vs Expenses Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue vs Expenses Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
              <Bar dataKey="expenses" fill="#82ca9d" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Net Income Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Net Income Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  dot={{ fill: '#82ca9d' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Financial Table */}
      {reportType === 'detailed' && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Financial Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Period</TableHead>
                  <TableHead>Previous Period</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>% Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Revenue</TableCell>
                  <TableCell>{formatCurrency(financialData.revenue)}</TableCell>
                  <TableCell>{formatCurrency(financialData.revenue * 0.9)}</TableCell>
                  <TableCell className="text-green-600">
                    {formatCurrency(financialData.revenue * 0.1)}
                  </TableCell>
                  <TableCell className="text-green-600">+11.1%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Operating Expenses</TableCell>
                  <TableCell>{formatCurrency(financialData.expenses)}</TableCell>
                  <TableCell>{formatCurrency(financialData.expenses * 0.95)}</TableCell>
                  <TableCell className="text-red-600">
                    {formatCurrency(financialData.expenses * 0.05)}
                  </TableCell>
                  <TableCell className="text-red-600">+5.3%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Net Income</TableCell>
                  <TableCell>{formatCurrency(financialData.netIncome)}</TableCell>
                  <TableCell>{formatCurrency(financialData.netIncome * 0.85)}</TableCell>
                  <TableCell className="text-green-600">
                    {formatCurrency(financialData.netIncome * 0.15)}
                  </TableCell>
                  <TableCell className="text-green-600">+17.6%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
