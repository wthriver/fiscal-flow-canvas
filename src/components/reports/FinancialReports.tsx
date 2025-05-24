
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCompany } from "@/contexts/CompanyContext";
import { FileText, Download, Calendar } from "lucide-react";
import { toast } from "sonner";

export const FinancialReports = () => {
  const { currentCompany } = useCompany();
  const [reportType, setReportType] = useState("profit-loss");
  const [dateRange, setDateRange] = useState("current-month");

  const generateProfitLossData = () => {
    const revenue = currentCompany.invoices?.reduce((sum, invoice) => 
      sum + parseFloat(invoice.amount?.replace(/[^0-9.-]+/g, "") || "0"), 0) || 0;
    const expenses = currentCompany.expenses?.reduce((sum, expense) => 
      sum + parseFloat(expense.amount?.toString().replace(/[^0-9.-]+/g, "") || "0"), 0) || 0;
    
    return {
      revenue,
      expenses,
      grossProfit: revenue - expenses,
      netIncome: revenue - expenses
    };
  };

  const generateBalanceSheetData = () => {
    const totalAssets = currentCompany.bankAccounts?.reduce((sum, account) => 
      sum + parseFloat(account.balance?.toString().replace(/[^0-9.-]+/g, "") || "0"), 0) || 0;
    const totalLiabilities = currentCompany.expenses?.reduce((sum, expense) => 
      expense.status === "Pending" ? sum + parseFloat(expense.amount?.toString().replace(/[^0-9.-]+/g, "") || "0") : sum, 0) || 0;
    
    return {
      assets: totalAssets,
      liabilities: totalLiabilities,
      equity: totalAssets - totalLiabilities
    };
  };

  const generateCashFlowData = () => {
    const operatingCash = currentCompany.transactions?.reduce((sum, transaction) => {
      const amount = parseFloat(transaction.amount.replace(/[^0-9.-]+/g, ""));
      return transaction.type === "Credit" ? sum + amount : sum - amount;
    }, 0) || 0;

    return {
      operatingActivities: operatingCash,
      investingActivities: 0,
      financingActivities: 0,
      netCashFlow: operatingCash
    };
  };

  const exportReport = () => {
    toast.success(`${reportType} report exported successfully`);
  };

  const renderProfitLoss = () => {
    const data = generateProfitLossData();
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Account</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="font-semibold">
            <TableCell>REVENUE</TableCell>
            <TableCell className="text-right">${data.revenue.toLocaleString()}</TableCell>
          </TableRow>
          <TableRow className="font-semibold">
            <TableCell>EXPENSES</TableCell>
            <TableCell className="text-right">${data.expenses.toLocaleString()}</TableCell>
          </TableRow>
          <TableRow className="font-bold border-t-2">
            <TableCell>NET INCOME</TableCell>
            <TableCell className="text-right">${data.netIncome.toLocaleString()}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  };

  const renderBalanceSheet = () => {
    const data = generateBalanceSheetData();
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Account</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="font-semibold">
            <TableCell>ASSETS</TableCell>
            <TableCell className="text-right">${data.assets.toLocaleString()}</TableCell>
          </TableRow>
          <TableRow className="font-semibold">
            <TableCell>LIABILITIES</TableCell>
            <TableCell className="text-right">${data.liabilities.toLocaleString()}</TableCell>
          </TableRow>
          <TableRow className="font-bold border-t-2">
            <TableCell>EQUITY</TableCell>
            <TableCell className="text-right">${data.equity.toLocaleString()}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  };

  const renderCashFlow = () => {
    const data = generateCashFlowData();
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Activity</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Operating Activities</TableCell>
            <TableCell className="text-right">${data.operatingActivities.toLocaleString()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Investing Activities</TableCell>
            <TableCell className="text-right">${data.investingActivities.toLocaleString()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Financing Activities</TableCell>
            <TableCell className="text-right">${data.financingActivities.toLocaleString()}</TableCell>
          </TableRow>
          <TableRow className="font-bold border-t-2">
            <TableCell>Net Cash Flow</TableCell>
            <TableCell className="text-right">${data.netCashFlow.toLocaleString()}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Financial Reports</h2>
          <p className="text-muted-foreground">Generate comprehensive financial reports</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="profit-loss">Profit & Loss</SelectItem>
              <SelectItem value="balance-sheet">Balance Sheet</SelectItem>
              <SelectItem value="cash-flow">Cash Flow</SelectItem>
              <SelectItem value="tax-summary">Tax Summary</SelectItem>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {reportType === "profit-loss" && "Profit & Loss Statement"}
            {reportType === "balance-sheet" && "Balance Sheet"}
            {reportType === "cash-flow" && "Cash Flow Statement"}
            {reportType === "tax-summary" && "Tax Summary Report"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reportType === "profit-loss" && renderProfitLoss()}
          {reportType === "balance-sheet" && renderBalanceSheet()}
          {reportType === "cash-flow" && renderCashFlow()}
          {reportType === "tax-summary" && (
            <div className="text-center py-8 text-muted-foreground">
              Tax summary report will be available after connecting to tax service
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
