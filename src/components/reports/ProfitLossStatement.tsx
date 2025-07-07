import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCompany } from "@/contexts/CompanyContext";
import { safeNumberParse } from "@/utils/typeHelpers";
import { Download, Calendar } from "lucide-react";
import { exportToCSV } from "@/utils/exportUtils";
import { toast } from "sonner";

const ProfitLossStatement: React.FC = () => {
  const { currentCompany } = useCompany();
  const [dateRange, setDateRange] = useState("current-month");
  
  // Calculate revenue breakdown
  const calculateRevenue = () => {
    const invoices = currentCompany?.invoices || [];
    const paidInvoices = invoices.filter(inv => inv.status === 'Paid');
    const pendingInvoices = invoices.filter(inv => inv.status !== 'Paid');
    
    const salesRevenue = paidInvoices.reduce((total, invoice) => 
      total + safeNumberParse(invoice.total), 0);
    
    const serviceRevenue = salesRevenue * 0.3; // Mock service revenue
    const otherRevenue = salesRevenue * 0.1; // Mock other revenue
    
    return {
      sales: salesRevenue,
      services: serviceRevenue,
      other: otherRevenue,
      total: salesRevenue + serviceRevenue + otherRevenue,
      pending: pendingInvoices.reduce((total, invoice) => 
        total + safeNumberParse(invoice.total), 0)
    };
  };
  
  // Calculate expense breakdown
  const calculateExpenses = () => {
    const expenses = currentCompany?.expenses || [];
    
    const operatingExpenses = expenses.reduce((total, expense) => 
      total + safeNumberParse(expense.amount), 0);
    
    const salariesExpenses = operatingExpenses * 0.4; // Mock salaries
    const rentExpenses = operatingExpenses * 0.2; // Mock rent
    const marketingExpenses = operatingExpenses * 0.15; // Mock marketing
    const utilitiesExpenses = operatingExpenses * 0.1; // Mock utilities
    const otherExpenses = operatingExpenses * 0.15; // Mock other
    
    return {
      operating: operatingExpenses,
      salaries: salariesExpenses,
      rent: rentExpenses,
      marketing: marketingExpenses,
      utilities: utilitiesExpenses,
      other: otherExpenses,
      total: operatingExpenses + salariesExpenses + rentExpenses + marketingExpenses + utilitiesExpenses + otherExpenses
    };
  };
  
  const revenue = calculateRevenue();
  const expenses = calculateExpenses();
  const grossProfit = revenue.total - (expenses.total * 0.3); // COGS approximation
  const netIncome = revenue.total - expenses.total;
  const grossMargin = revenue.total > 0 ? (grossProfit / revenue.total) * 100 : 0;
  const netMargin = revenue.total > 0 ? (netIncome / revenue.total) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const exportReport = () => {
    const exportData = [
      { Category: 'REVENUE', Account: '', Amount: '' },
      { Category: 'Revenue', Account: 'Sales Revenue', Amount: revenue.sales },
      { Category: 'Revenue', Account: 'Service Revenue', Amount: revenue.services },
      { Category: 'Revenue', Account: 'Other Revenue', Amount: revenue.other },
      { Category: 'TOTAL REVENUE', Account: '', Amount: revenue.total },
      { Category: '', Account: '', Amount: '' },
      { Category: 'COST OF GOODS SOLD', Account: '', Amount: '' },
      { Category: 'COGS', Account: 'Direct Costs', Amount: expenses.total * 0.3 },
      { Category: 'GROSS PROFIT', Account: '', Amount: grossProfit },
      { Category: '', Account: '', Amount: '' },
      { Category: 'OPERATING EXPENSES', Account: '', Amount: '' },
      { Category: 'Expenses', Account: 'Salaries & Benefits', Amount: expenses.salaries },
      { Category: 'Expenses', Account: 'Rent & Facilities', Amount: expenses.rent },
      { Category: 'Expenses', Account: 'Marketing & Advertising', Amount: expenses.marketing },
      { Category: 'Expenses', Account: 'Utilities', Amount: expenses.utilities },
      { Category: 'Expenses', Account: 'Other Operating Expenses', Amount: expenses.other },
      { Category: 'TOTAL OPERATING EXPENSES', Account: '', Amount: expenses.total },
      { Category: '', Account: '', Amount: '' },
      { Category: 'NET INCOME', Account: '', Amount: netIncome }
    ];

    exportToCSV(exportData, `profit_loss_statement_${dateRange}`);
    toast.success("P&L Statement exported successfully");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Profit & Loss Statement</h2>
          <p className="text-muted-foreground">Income and expense statement</p>
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
          <Button onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Profit & Loss Statement - {dateRange}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <Table>
              <TableBody>
                {/* Revenue Section */}
                <TableRow className="font-bold text-lg border-b-2">
                  <TableCell>REVENUE</TableCell>
                  <TableCell className="text-right"></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8">Sales Revenue</TableCell>
                  <TableCell className="text-right">{formatCurrency(revenue.sales)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8">Service Revenue</TableCell>
                  <TableCell className="text-right">{formatCurrency(revenue.services)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8">Other Revenue</TableCell>
                  <TableCell className="text-right">{formatCurrency(revenue.other)}</TableCell>
                </TableRow>
                <TableRow className="font-bold border-t">
                  <TableCell>TOTAL REVENUE</TableCell>
                  <TableCell className="text-right">{formatCurrency(revenue.total)}</TableCell>
                </TableRow>

                {/* Spacer */}
                <TableRow>
                  <TableCell colSpan={2} className="py-2"></TableCell>
                </TableRow>

                {/* Cost of Goods Sold */}
                <TableRow className="font-bold text-lg border-b-2">
                  <TableCell>COST OF GOODS SOLD</TableCell>
                  <TableCell className="text-right"></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8">Direct Costs</TableCell>
                  <TableCell className="text-right">{formatCurrency(expenses.total * 0.3)}</TableCell>
                </TableRow>
                <TableRow className="font-bold border-t text-green-600">
                  <TableCell>GROSS PROFIT</TableCell>
                  <TableCell className="text-right">{formatCurrency(grossProfit)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8 text-sm text-muted-foreground">
                    Gross Margin: {grossMargin.toFixed(1)}%
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>

                {/* Spacer */}
                <TableRow>
                  <TableCell colSpan={2} className="py-2"></TableCell>
                </TableRow>

                {/* Operating Expenses */}
                <TableRow className="font-bold text-lg border-b-2">
                  <TableCell>OPERATING EXPENSES</TableCell>
                  <TableCell className="text-right"></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8">Salaries & Benefits</TableCell>
                  <TableCell className="text-right">{formatCurrency(expenses.salaries)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8">Rent & Facilities</TableCell>
                  <TableCell className="text-right">{formatCurrency(expenses.rent)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8">Marketing & Advertising</TableCell>
                  <TableCell className="text-right">{formatCurrency(expenses.marketing)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8">Utilities</TableCell>
                  <TableCell className="text-right">{formatCurrency(expenses.utilities)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8">Other Operating Expenses</TableCell>
                  <TableCell className="text-right">{formatCurrency(expenses.other)}</TableCell>
                </TableRow>
                <TableRow className="font-bold border-t">
                  <TableCell>TOTAL OPERATING EXPENSES</TableCell>
                  <TableCell className="text-right">{formatCurrency(expenses.total)}</TableCell>
                </TableRow>

                {/* Spacer */}
                <TableRow>
                  <TableCell colSpan={2} className="py-4"></TableCell>
                </TableRow>

                {/* Net Income */}
                <TableRow className={`font-bold text-xl border-t-2 ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <TableCell>NET INCOME</TableCell>
                  <TableCell className="text-right">{formatCurrency(netIncome)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8 text-sm text-muted-foreground">
                    Net Margin: {netMargin.toFixed(1)}%
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(revenue.total)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Gross Profit</p>
            <p className="text-xl font-bold text-blue-600">{formatCurrency(grossProfit)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-xl font-bold text-red-600">{formatCurrency(expenses.total)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Net Income</p>
            <p className={`text-xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netIncome)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfitLossStatement;
