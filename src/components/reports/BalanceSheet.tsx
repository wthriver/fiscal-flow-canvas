
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCompany } from "@/contexts/CompanyContext";
import { Download, Calendar } from "lucide-react";
import { toast } from "sonner";

export const BalanceSheet = () => {
  const { currentCompany } = useCompany();
  const [dateRange, setDateRange] = useState("current-month");

  const generateBalanceSheetData = () => {
    // Assets
    const cashAndEquivalents = currentCompany.bankAccounts?.reduce((sum, account) => 
      sum + parseFloat(account.balance?.toString().replace(/[^0-9.-]+/g, "") || "0"), 0) || 0;
    
    const accountsReceivable = currentCompany.invoices?.reduce((sum, invoice) => 
      invoice.status !== "Paid" ? sum + invoice.total : sum, 0) || 0;
    
    const inventory = currentCompany.inventory?.items?.reduce((sum, item) => 
      sum + (parseFloat(item.cost?.toString().replace(/[^0-9.-]+/g, "") || "0") * item.quantity), 0) || 0;
    
    const fixedAssets = 150000; // Equipment, property, etc.
    const totalAssets = cashAndEquivalents + accountsReceivable + inventory + fixedAssets;

    // Liabilities
    const accountsPayable = currentCompany.expenses?.reduce((sum, expense) => 
      expense.status === "Pending" ? sum + parseFloat(expense.amount?.toString().replace(/[^0-9.-]+/g, "") || "0") : sum, 0) || 0;
    
    const shortTermDebt = 25000;
    const longTermDebt = 75000;
    const totalLiabilities = accountsPayable + shortTermDebt + longTermDebt;

    // Equity
    const retainedEarnings = 50000;
    const ownerEquity = 100000;
    const totalEquity = retainedEarnings + ownerEquity;

    return {
      assets: {
        current: {
          cash: cashAndEquivalents,
          accountsReceivable,
          inventory,
          total: cashAndEquivalents + accountsReceivable + inventory
        },
        fixed: {
          equipment: fixedAssets,
          total: fixedAssets
        },
        total: totalAssets
      },
      liabilities: {
        current: {
          accountsPayable,
          shortTermDebt,
          total: accountsPayable + shortTermDebt
        },
        longTerm: {
          longTermDebt,
          total: longTermDebt
        },
        total: totalLiabilities
      },
      equity: {
        ownerEquity,
        retainedEarnings,
        total: totalEquity
      }
    };
  };

  const balanceSheetData = generateBalanceSheetData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const exportReport = () => {
    toast.success("Balance sheet exported successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Balance Sheet</h2>
          <p className="text-muted-foreground">Assets, liabilities, and equity statement</p>
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
            Balance Sheet - {dateRange}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Assets Section */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-600">ASSETS</h3>
              <Table>
                <TableBody>
                  <TableRow className="font-semibold">
                    <TableCell colSpan={2}>Current Assets</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">Cash and Cash Equivalents</TableCell>
                    <TableCell className="text-right">{formatCurrency(balanceSheetData.assets.current.cash)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">Accounts Receivable</TableCell>
                    <TableCell className="text-right">{formatCurrency(balanceSheetData.assets.current.accountsReceivable)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">Inventory</TableCell>
                    <TableCell className="text-right">{formatCurrency(balanceSheetData.assets.current.inventory)}</TableCell>
                  </TableRow>
                  <TableRow className="border-t">
                    <TableCell className="pl-4 font-medium">Total Current Assets</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(balanceSheetData.assets.current.total)}</TableCell>
                  </TableRow>
                  
                  <TableRow className="font-semibold">
                    <TableCell colSpan={2} className="pt-4">Fixed Assets</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">Equipment and Property</TableCell>
                    <TableCell className="text-right">{formatCurrency(balanceSheetData.assets.fixed.equipment)}</TableCell>
                  </TableRow>
                  <TableRow className="border-t">
                    <TableCell className="pl-4 font-medium">Total Fixed Assets</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(balanceSheetData.assets.fixed.total)}</TableCell>
                  </TableRow>
                  
                  <TableRow className="border-t-2 border-gray-400 font-bold text-lg">
                    <TableCell>TOTAL ASSETS</TableCell>
                    <TableCell className="text-right">{formatCurrency(balanceSheetData.assets.total)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Liabilities Section */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-red-600">LIABILITIES</h3>
              <Table>
                <TableBody>
                  <TableRow className="font-semibold">
                    <TableCell colSpan={2}>Current Liabilities</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">Accounts Payable</TableCell>
                    <TableCell className="text-right">{formatCurrency(balanceSheetData.liabilities.current.accountsPayable)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">Short-term Debt</TableCell>
                    <TableCell className="text-right">{formatCurrency(balanceSheetData.liabilities.current.shortTermDebt)}</TableCell>
                  </TableRow>
                  <TableRow className="border-t">
                    <TableCell className="pl-4 font-medium">Total Current Liabilities</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(balanceSheetData.liabilities.current.total)}</TableCell>
                  </TableRow>
                  
                  <TableRow className="font-semibold">
                    <TableCell colSpan={2} className="pt-4">Long-term Liabilities</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">Long-term Debt</TableCell>
                    <TableCell className="text-right">{formatCurrency(balanceSheetData.liabilities.longTerm.longTermDebt)}</TableCell>
                  </TableRow>
                  <TableRow className="border-t">
                    <TableCell className="pl-4 font-medium">Total Long-term Liabilities</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(balanceSheetData.liabilities.longTerm.total)}</TableCell>
                  </TableRow>
                  
                  <TableRow className="border-t-2 border-gray-400 font-bold">
                    <TableCell>TOTAL LIABILITIES</TableCell>
                    <TableCell className="text-right">{formatCurrency(balanceSheetData.liabilities.total)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Equity Section */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-green-600">EQUITY</h3>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="pl-8">Owner's Equity</TableCell>
                    <TableCell className="text-right">{formatCurrency(balanceSheetData.equity.ownerEquity)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">Retained Earnings</TableCell>
                    <TableCell className="text-right">{formatCurrency(balanceSheetData.equity.retainedEarnings)}</TableCell>
                  </TableRow>
                  <TableRow className="border-t-2 border-gray-400 font-bold">
                    <TableCell>TOTAL EQUITY</TableCell>
                    <TableCell className="text-right">{formatCurrency(balanceSheetData.equity.total)}</TableCell>
                  </TableRow>
                  
                  <TableRow className="border-t-2 border-black font-bold text-lg">
                    <TableCell>TOTAL LIABILITIES + EQUITY</TableCell>
                    <TableCell className="text-right">{formatCurrency(balanceSheetData.liabilities.total + balanceSheetData.equity.total)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
