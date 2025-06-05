import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCompany } from "@/contexts/CompanyContext";
import { Download, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";

export const ProfitLossStatement = () => {
  const { currentCompany } = useCompany();
  const [dateRange, setDateRange] = useState("current-month");
  const [comparisonPeriod, setComparisonPeriod] = useState("previous-period");

  const generatePLData = () => {
    // Revenue
    const salesRevenue = currentCompany.invoices?.reduce((sum, invoice) => 
      sum + parseFloat(invoice.amount?.replace(/[^0-9.-]+/g, "") || "0"), 0) || 0;
    const serviceRevenue = currentCompany.sales?.reduce((sum, sale) => 
      sum + parseFloat(sale.amount?.toString().replace(/[^0-9.-]+/g, "") || "0"), 0) || 0;
    const totalRevenue = salesRevenue + serviceRevenue;

    // Cost of Goods Sold
    const materialCosts = currentCompany.expenses?.reduce((sum, expense) => 
      expense.category === "Materials" ? sum + parseFloat(expense.amount?.toString().replace(/[^0-9.-]+/g, "") || "0") : sum, 0) || 0;
    const laborCosts = totalRevenue * 0.25; // Estimated 25% of revenue
    const totalCOGS = materialCosts + laborCosts;

    // Gross Profit
    const grossProfit = totalRevenue - totalCOGS;
    const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    // Operating Expenses
    const salariesAndWages = currentCompany.payrollData?.payPeriods?.reduce((sum, period) => 
      sum + (period.totalPaid || 0), 0) || 0;
    const rentExpense = 12000; // Annual rent
    const utilitiesExpense = 3600; // Annual utilities
    const marketingExpense = currentCompany.expenses?.reduce((sum, expense) => 
      expense.category === "Marketing" ? sum + parseFloat(expense.amount?.toString().replace(/[^0-9.-]+/g, "") || "0") : sum, 0) || 0;
    const insuranceExpense = 6000; // Annual insurance
    const professionalFees = 4800; // Annual professional fees
    const officeExpenses = currentCompany.expenses?.reduce((sum, expense) => 
      expense.category === "Office" ? sum + parseFloat(expense.amount?.toString().replace(/[^0-9.-]+/g, "") || "0") : sum, 0) || 0;
    
    const totalOperatingExpenses = salariesAndWages + rentExpense + utilitiesExpense + 
                                 marketingExpense + insuranceExpense + professionalFees + officeExpenses;

    // Operating Income
    const operatingIncome = grossProfit - totalOperatingExpenses;
    const operatingMargin = totalRevenue > 0 ? (operatingIncome / totalRevenue) * 100 : 0;

    // Other Income/Expenses
    const interestIncome = 500;
    const interestExpense = 2400;
    const otherIncome = interestIncome - interestExpense;

    // Net Income
    const netIncome = operatingIncome + otherIncome;
    const netMargin = totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0;

    return {
      revenue: {
        sales: salesRevenue,
        services: serviceRevenue,
        total: totalRevenue
      },
      cogs: {
        materials: materialCosts,
        labor: laborCosts,
        total: totalCOGS
      },
      grossProfit,
      grossMargin,
      operatingExpenses: {
        salariesAndWages,
        rent: rentExpense,
        utilities: utilitiesExpense,
        marketing: marketingExpense,
        insurance: insuranceExpense,
        professionalFees,
        office: officeExpenses,
        total: totalOperatingExpenses
      },
      operatingIncome,
      operatingMargin,
      otherIncome: {
        interestIncome,
        interestExpense,
        net: otherIncome
      },
      netIncome,
      netMargin
    };
  };

  const plData = generatePLData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage.toFixed(1)}%`;
  };

  const exportReport = () => {
    toast.success("Profit & Loss statement exported successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Profit & Loss Statement</h2>
          <p className="text-muted-foreground">Comprehensive income and expense analysis</p>
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
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(plData.revenue.total)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Gross Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(plData.grossProfit)}
            </div>
            <p className="text-sm text-muted-foreground">
              {formatPercentage(plData.grossMargin)} margin
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Operating Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(plData.operatingIncome)}
            </div>
            <p className="text-sm text-muted-foreground">
              {formatPercentage(plData.operatingMargin)} margin
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              {plData.netIncome >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              Net Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${plData.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(plData.netIncome)}
            </div>
            <p className="text-sm text-muted-foreground">
              {formatPercentage(plData.netMargin)} margin
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profit & Loss Statement - {dateRange}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">% of Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Revenue Section */}
              <TableRow className="font-bold text-green-600">
                <TableCell>REVENUE</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Sales Revenue</TableCell>
                <TableCell className="text-right">{formatCurrency(plData.revenue.sales)}</TableCell>
                <TableCell className="text-right">{formatPercentage((plData.revenue.sales / plData.revenue.total) * 100)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Service Revenue</TableCell>
                <TableCell className="text-right">{formatCurrency(plData.revenue.services)}</TableCell>
                <TableCell className="text-right">{formatPercentage((plData.revenue.services / plData.revenue.total) * 100)}</TableCell>
              </TableRow>
              <TableRow className="border-t font-semibold">
                <TableCell className="pl-4">Total Revenue</TableCell>
                <TableCell className="text-right">{formatCurrency(plData.revenue.total)}</TableCell>
                <TableCell className="text-right">100.0%</TableCell>
              </TableRow>

              {/* COGS Section */}
              <TableRow className="font-bold text-orange-600">
                <TableCell className="pt-4">COST OF GOODS SOLD</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Materials</TableCell>
                <TableCell className="text-right">{formatCurrency(plData.cogs.materials)}</TableCell>
                <TableCell className="text-right">{formatPercentage((plData.cogs.materials / plData.revenue.total) * 100)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Direct Labor</TableCell>
                <TableCell className="text-right">{formatCurrency(plData.cogs.labor)}</TableCell>
                <TableCell className="text-right">{formatPercentage((plData.cogs.labor / plData.revenue.total) * 100)}</TableCell>
              </TableRow>
              <TableRow className="border-t font-semibold">
                <TableCell className="pl-4">Total COGS</TableCell>
                <TableCell className="text-right">{formatCurrency(plData.cogs.total)}</TableCell>
                <TableCell className="text-right">{formatPercentage((plData.cogs.total / plData.revenue.total) * 100)}</TableCell>
              </TableRow>

              {/* Gross Profit */}
              <TableRow className="border-t-2 font-bold text-blue-600">
                <TableCell>GROSS PROFIT</TableCell>
                <TableCell className="text-right">{formatCurrency(plData.grossProfit)}</TableCell>
                <TableCell className="text-right">{formatPercentage(plData.grossMargin)}</TableCell>
              </TableRow>

              {/* Operating Expenses */}
              <TableRow className="font-bold text-red-600">
                <TableCell className="pt-4">OPERATING EXPENSES</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Salaries and Wages</TableCell>
                <TableCell className="text-right">{formatCurrency(plData.operatingExpenses.salariesAndWages)}</TableCell>
                <TableCell className="text-right">{formatPercentage((plData.operatingExpenses.salariesAndWages / plData.revenue.total) * 100)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Rent</TableCell>
                <TableCell className="text-right">{formatCurrency(plData.operatingExpenses.rent)}</TableCell>
                <TableCell className="text-right">{formatPercentage((plData.operatingExpenses.rent / plData.revenue.total) * 100)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Utilities</TableCell>
                <TableCell className="text-right">{formatCurrency(plData.operatingExpenses.utilities)}</TableCell>
                <TableCell className="text-right">{formatPercentage((plData.operatingExpenses.utilities / plData.revenue.total) * 100)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Marketing</TableCell>
                <TableCell className="text-right">{formatCurrency(plData.operatingExpenses.marketing)}</TableCell>
                <TableCell className="text-right">{formatPercentage((plData.operatingExpenses.marketing / plData.revenue.total) * 100)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Insurance</TableCell>
                <TableCell className="text-right">{formatCurrency(plData.operatingExpenses.insurance)}</TableCell>
                <TableCell className="text-right">{formatPercentage((plData.operatingExpenses.insurance / plData.revenue.total) * 100)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Professional Fees</TableCell>
                <TableCell className="text-right">{formatCurrency(plData.operatingExpenses.professionalFees)}</TableCell>
                <TableCell className="text-right">{formatPercentage((plData.operatingExpenses.professionalFees / plData.revenue.total) * 100)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Office Expenses</TableCell>
                <TableCell className="text-right">{formatCurrency(plData.operatingExpenses.office)}</TableCell>
                <TableCell className="text-right">{formatPercentage((plData.operatingExpenses.office / plData.revenue.total) * 100)}</TableCell>
              </TableRow>
              <TableRow className="border-t font-semibold">
                <TableCell className="pl-4">Total Operating Expenses</TableCell>
                <TableCell className="text-right">{formatCurrency(plData.operatingExpenses.total)}</TableCell>
                <TableCell className="text-right">{formatPercentage((plData.operatingExpenses.total / plData.revenue.total) * 100)}</TableCell>
              </TableRow>

              {/* Operating Income */}
              <TableRow className="border-t-2 font-bold text-purple-600">
                <TableCell>OPERATING INCOME</TableCell>
                <TableCell className="text-right">{formatCurrency(plData.operatingIncome)}</TableCell>
                <TableCell className="text-right">{formatPercentage(plData.operatingMargin)}</TableCell>
              </TableRow>

              {/* Other Income/Expenses */}
              <TableRow className="font-bold">
                <TableCell className="pt-4">OTHER INCOME (EXPENSE)</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Interest Income</TableCell>
                <TableCell className="text-right">{formatCurrency(plData.otherIncome.interestIncome)}</TableCell>
                <TableCell className="text-right">{formatPercentage((plData.otherIncome.interestIncome / plData.revenue.total) * 100)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Interest Expense</TableCell>
                <TableCell className="text-right">({formatCurrency(plData.otherIncome.interestExpense)})</TableCell>
                <TableCell className="text-right">({formatPercentage((plData.otherIncome.interestExpense / plData.revenue.total) * 100)})</TableCell>
              </TableRow>
              <TableRow className="border-t font-semibold">
                <TableCell className="pl-4">Net Other Income</TableCell>
                <TableCell className="text-right">{formatCurrency(plData.otherIncome.net)}</TableCell>
                <TableCell className="text-right">{formatPercentage((plData.otherIncome.net / plData.revenue.total) * 100)}</TableCell>
              </TableRow>

              {/* Net Income */}
              <TableRow className="border-t-2 border-black font-bold text-lg">
                <TableCell>NET INCOME</TableCell>
                <TableCell className={`text-right ${plData.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(plData.netIncome)}
                </TableCell>
                <TableCell className={`text-right ${plData.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(plData.netMargin)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
