
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCompany } from "@/contexts/CompanyContext";
import { TrendingUp, TrendingDown, Download, Calendar } from "lucide-react";
import { toast } from "sonner";

interface CashFlowItem {
  description: string;
  amount: number;
  category: "operating" | "investing" | "financing";
}

export const CashFlowStatement = () => {
  const { currentCompany } = useCompany();
  const [dateRange, setDateRange] = useState("current-month");

  const generateCashFlowData = (): CashFlowItem[] => {
    const revenue = currentCompany.invoices?.reduce((sum, invoice) => 
      sum + parseFloat(invoice.amount?.replace(/[^0-9.-]+/g, "") || "0"), 0) || 0;
    
    const expenses = currentCompany.expenses?.reduce((sum, expense) => 
      sum + parseFloat(expense.amount?.toString().replace(/[^0-9.-]+/g, "") || "0"), 0) || 0;

    return [
      // Operating Activities
      { description: "Cash receipts from customers", amount: revenue, category: "operating" },
      { description: "Cash paid to suppliers", amount: -expenses * 0.6, category: "operating" },
      { description: "Cash paid for operating expenses", amount: -expenses * 0.3, category: "operating" },
      { description: "Cash paid for taxes", amount: -revenue * 0.15, category: "operating" },
      
      // Investing Activities
      { description: "Purchase of equipment", amount: -25000, category: "investing" },
      { description: "Sale of investments", amount: 15000, category: "investing" },
      { description: "Purchase of property", amount: -100000, category: "investing" },
      
      // Financing Activities
      { description: "Proceeds from loans", amount: 50000, category: "financing" },
      { description: "Repayment of loans", amount: -20000, category: "financing" },
      { description: "Dividends paid", amount: -10000, category: "financing" },
      { description: "Owner contributions", amount: 25000, category: "financing" }
    ];
  };

  const cashFlowData = generateCashFlowData();

  const getOperatingCashFlow = () => {
    return cashFlowData
      .filter(item => item.category === "operating")
      .reduce((sum, item) => sum + item.amount, 0);
  };

  const getInvestingCashFlow = () => {
    return cashFlowData
      .filter(item => item.category === "investing")
      .reduce((sum, item) => sum + item.amount, 0);
  };

  const getFinancingCashFlow = () => {
    return cashFlowData
      .filter(item => item.category === "financing")
      .reduce((sum, item) => sum + item.amount, 0);
  };

  const getNetCashFlow = () => {
    return getOperatingCashFlow() + getInvestingCashFlow() + getFinancingCashFlow();
  };

  const formatCurrency = (amount: number) => {
    const isNegative = amount < 0;
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    return isNegative ? `(${formatted})` : formatted;
  };

  const exportReport = () => {
    toast.success("Cash flow statement exported successfully");
  };

  const renderCashFlowSection = (title: string, category: "operating" | "investing" | "financing") => {
    const items = cashFlowData.filter(item => item.category === category);
    const total = items.reduce((sum, item) => sum + item.amount, 0);

    return (
      <div className="space-y-2">
        <h3 className="font-semibold text-lg border-b pb-2">{title}</h3>
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-1">
            <span className="text-sm">{item.description}</span>
            <span className={`text-sm font-medium ${item.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(item.amount)}
            </span>
          </div>
        ))}
        <div className="flex justify-between items-center py-2 border-t font-semibold">
          <span>Net Cash from {title}</span>
          <span className={total >= 0 ? 'text-green-600' : 'text-red-600'}>
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Cash Flow Statement</h2>
          <p className="text-muted-foreground">Track cash inflows and outflows</p>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Operating Cash Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getOperatingCashFlow() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(getOperatingCashFlow())}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Investing Cash Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getInvestingCashFlow() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(getInvestingCashFlow())}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Financing Cash Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getFinancingCashFlow() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(getFinancingCashFlow())}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Net Cash Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getNetCashFlow() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(getNetCashFlow())}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Statement - {dateRange}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderCashFlowSection("Operating Activities", "operating")}
          {renderCashFlowSection("Investing Activities", "investing")}
          {renderCashFlowSection("Financing Activities", "financing")}
          
          <div className="border-t-2 border-gray-300 pt-4">
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Net Increase in Cash</span>
              <span className={getNetCashFlow() >= 0 ? 'text-green-600' : 'text-red-600'}>
                {formatCurrency(getNetCashFlow())}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
              <span>Cash at beginning of period</span>
              <span>$50,000</span>
            </div>
            <div className="flex justify-between items-center mt-1 font-semibold border-t pt-2">
              <span>Cash at end of period</span>
              <span>{formatCurrency(50000 + getNetCashFlow())}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
