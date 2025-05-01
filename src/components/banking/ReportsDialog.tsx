
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCompany } from "@/contexts/CompanyContext";
import { DateRangeDialog } from "@/components/invoices/DateRangeDialog";
import { Download, Calendar, FileText } from "lucide-react";
import { TransactionHistoryTab } from "./reports/TransactionHistoryTab";
import { AccountStatementTab } from "./reports/AccountStatementTab";
import { IncomeExpensesTab } from "./reports/IncomeExpensesTab";
import { ReconciliationTab } from "./reports/ReconciliationTab";
import { format } from "date-fns";
import { toast } from "sonner";

interface ReportsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: string;
  accountName: string;
}

export const ReportsDialog: React.FC<ReportsDialogProps> = ({
  open,
  onOpenChange,
  accountId,
  accountName,
}) => {
  const { currentCompany } = useCompany();
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [activeTab, setActiveTab] = useState("transaction-history");

  // Filter transactions for the specific account
  const accountTransactions = currentCompany.transactions.filter(
    (transaction) => transaction.account === accountName
  );

  // Filter transactions by date range if it's set
  const filteredTransactions = accountTransactions.filter((transaction) => {
    if (!dateRange.from && !dateRange.to) return true;
    
    const transactionDate = new Date(transaction.date);
    
    if (dateRange.from && !dateRange.to) {
      return transactionDate >= dateRange.from;
    }
    
    if (!dateRange.from && dateRange.to) {
      return transactionDate <= dateRange.to;
    }
    
    if (dateRange.from && dateRange.to) {
      return transactionDate >= dateRange.from && transactionDate <= dateRange.to;
    }
    
    return true;
  });

  // Calculate income and expenses data for chart
  const incomeExpenseData = accountTransactions.reduce((acc: any[], transaction) => {
    const date = transaction.date.substring(0, 7); // Get YYYY-MM format
    const amount = parseFloat(transaction.amount.replace(/[^0-9.-]+/g, ""));
    const isIncome = transaction.amount.startsWith("+");
    
    const existingEntry = acc.find((entry) => entry.month === date);
    
    if (existingEntry) {
      if (isIncome) {
        existingEntry.income += amount;
      } else {
        existingEntry.expenses += amount;
      }
      existingEntry.balance = existingEntry.income - existingEntry.expenses;
    } else {
      acc.push({
        month: date,
        income: isIncome ? amount : 0,
        expenses: isIncome ? 0 : amount,
        balance: isIncome ? amount : -amount,
      });
    }
    
    return acc;
  }, []).sort((a, b) => a.month.localeCompare(b.month));

  // Create reconciliation status data
  const reconciliationData = {
    reconciled: accountTransactions.filter(t => t.reconciled).length,
    unreconciled: accountTransactions.filter(t => !t.reconciled).length
  };

  // Calculate account balance over time
  const balanceHistory = accountTransactions
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc: any[], transaction) => {
      const date = transaction.date;
      const amount = parseFloat(transaction.amount.replace(/[^0-9.-]+/g, ""));
      const isIncome = transaction.amount.startsWith("+");
      
      const lastBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0;
      const newBalance = isIncome ? lastBalance + amount : lastBalance - amount;
      
      acc.push({
        date,
        amount: isIncome ? amount : -amount,
        balance: newBalance,
      });
      
      return acc;
    }, []);

  const handleApplyDateRange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
    setDateRangeOpen(false);
    toast.success("Date range applied to reports", {
      description: "Your reports have been filtered by the selected date range"
    });
  };

  const handlePrintReport = () => {
    toast.info("Preparing to print report", {
      description: "Getting your report ready for printing..."
    });
    setTimeout(() => window.print(), 1000);
  };

  const handleDownloadCSV = () => {
    const headers = ["Date", "Description", "Category", "Amount", "Reconciled"];
    const csvRows = [headers.join(",")];

    filteredTransactions.forEach((transaction) => {
      const row = [
        transaction.date,
        `"${transaction.description.replace(/"/g, '""')}"`,
        `"${transaction.category.replace(/"/g, '""')}"`,
        transaction.amount,
        transaction.reconciled ? "Yes" : "No"
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${accountName.replace(/\s+/g, "-")}-Transactions.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("CSV exported successfully", {
      description: `${accountName} transactions have been downloaded as CSV`
    });
  };

  const handleExportPDF = () => {
    toast.success("Exporting report to PDF", {
      description: "Your report will be downloaded shortly"
    });
    
    // Simulate PDF download after a short delay
    setTimeout(() => {
      const link = document.createElement("a");
      link.href = "#";
      link.download = `${accountName.replace(/\s+/g, "-")}-Report.pdf`;
      link.click();
    }, 1500);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{accountName} Reports</DialogTitle>
            <DialogDescription>
              View detailed reports and analytics for your {accountName}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-wrap justify-between items-center gap-2 pb-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={() => setDateRangeOpen(true)}
            >
              <Calendar className="h-4 w-4" />
              <span>
                {dateRange.from || dateRange.to ? (
                  <>
                    {dateRange.from ? format(dateRange.from, "MMM d, yyyy") : "Any"} - {dateRange.to ? format(dateRange.to, "MMM d, yyyy") : "Any"}
                  </>
                ) : (
                  "Date Range"
                )}
              </span>
            </Button>
            <div className="flex flex-wrap gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={handlePrintReport}
              >
                Print
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={handleDownloadCSV}
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={handleExportPDF}
              >
                <FileText className="h-4 w-4" />
                <span>Export PDF</span>
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4 w-full">
              <TabsTrigger value="transaction-history">Transaction History</TabsTrigger>
              <TabsTrigger value="account-statement">Account Statement</TabsTrigger>
              <TabsTrigger value="income-expenses">Income & Expenses</TabsTrigger>
              <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transaction-history" className="max-h-[60vh] overflow-auto">
              <TransactionHistoryTab transactions={filteredTransactions} />
            </TabsContent>
            
            <TabsContent value="account-statement">
              <AccountStatementTab 
                balanceHistory={balanceHistory}
                accountName={accountName}
                transactions={accountTransactions}
              />
            </TabsContent>
            
            <TabsContent value="income-expenses">
              <IncomeExpensesTab incomeExpenseData={incomeExpenseData} />
            </TabsContent>
            
            <TabsContent value="reconciliation">
              <ReconciliationTab 
                reconciliationData={reconciliationData}
                transactions={accountTransactions}
              />
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <DateRangeDialog
        open={dateRangeOpen}
        onOpenChange={setDateRangeOpen}
        onApplyDateRange={handleApplyDateRange}
        currentDateRange={dateRange}
      />
    </>
  );
};
