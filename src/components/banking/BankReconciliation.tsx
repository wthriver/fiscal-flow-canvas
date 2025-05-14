
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReconciliationHeader } from "./reconciliation/ReconciliationHeader";
import { ReconciliationContent } from "./reconciliation/ReconciliationContent";
import { AccountSummaryCards } from "./reconciliation/AccountSummaryCards";
import { FinishReconciliationDialog } from "./reconciliation/FinishReconciliationDialog";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";

// Sample bank transactions for demonstration
const BANK_TRANSACTIONS = [
  {
    id: "bank-tx-1",
    date: "2025-05-09",
    description: "Deposit: Client Payment",
    amount: "+$2,500.00",
    reconciled: false
  },
  {
    id: "bank-tx-2",
    date: "2025-05-08",
    description: "Withdrawal: Office Supplies",
    amount: "-$350.75",
    reconciled: false
  },
  {
    id: "bank-tx-3",
    date: "2025-05-05",
    description: "ACH Payment: Monthly Rent",
    amount: "-$2,000.00",
    reconciled: false
  },
  {
    id: "bank-tx-4",
    date: "2025-05-03",
    description: "Direct Deposit: Client Payment",
    amount: "+$3,750.00",
    reconciled: false
  },
  {
    id: "bank-tx-5",
    date: "2025-05-01",
    description: "Withdrawal: Utilities",
    amount: "-$425.50",
    reconciled: false
  }
];

// Sample book transactions
const BOOK_TRANSACTIONS = [
  {
    id: "book-tx-1",
    date: "2025-05-09",
    description: "Client Payment - ABC Corp",
    amount: "+$2,500.00",
    reconciled: false
  },
  {
    id: "book-tx-2",
    date: "2025-05-08",
    description: "Office Depot - Office Supplies",
    amount: "-$350.75",
    reconciled: false
  },
  {
    id: "book-tx-3",
    date: "2025-05-05",
    description: "Monthly Rent Payment",
    amount: "-$2,000.00",
    reconciled: false
  },
  {
    id: "book-tx-4",
    date: "2025-05-03",
    description: "XYZ Industries Payment",
    amount: "+$3,750.00",
    reconciled: false
  },
  {
    id: "book-tx-5",
    date: "2025-05-01",
    description: "Utility Bills Payment",
    amount: "-$425.50",
    reconciled: false
  },
  {
    id: "book-tx-6",
    date: "2025-05-12",
    description: "Staff Lunch Expense",
    amount: "-$125.30",
    reconciled: false
  }
];

export const BankReconciliation = () => {
  const { currentCompany } = useCompany();
  const [isReconciling, setIsReconciling] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [statementDate, setStatementDate] = useState("2025-05-15");
  const [openFinishDialog, setOpenFinishDialog] = useState(false);
  
  const accounts = currentCompany.bankAccounts || [];
  
  const handleStartReconciliation = () => {
    if (!selectedAccount) {
      toast.error("Please select an account to reconcile");
      return;
    }
    
    setIsReconciling(true);
    toast.success("Started bank reconciliation", {
      description: "Match your bank statement with your book records"
    });
  };
  
  const handleCancelReconciliation = () => {
    setIsReconciling(false);
    toast.info("Reconciliation canceled", {
      description: "Your progress has been saved as a draft"
    });
  };
  
  const handleFinishReconciliation = () => {
    setOpenFinishDialog(true);
  };
  
  const handleCompleteReconciliation = () => {
    setOpenFinishDialog(false);
    setIsReconciling(false);
    toast.success("Reconciliation completed", {
      description: "Your account has been successfully reconciled"
    });
  };
  
  return (
    <div className="space-y-6">
      <ReconciliationHeader 
        isReconciling={isReconciling}
        onStartReconciliation={handleStartReconciliation}
        onCancelReconciliation={handleCancelReconciliation}
        onFinishReconciliation={handleFinishReconciliation}
      />
      
      {!isReconciling ? (
        <Card>
          <CardHeader>
            <CardTitle>Start New Reconciliation</CardTitle>
            <CardDescription>
              Select the account and statement date to reconcile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="account" className="text-sm font-medium">
                  Select Account
                </label>
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                  <SelectTrigger id="account">
                    <SelectValue placeholder="Choose an account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} ({account.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="statement-date" className="text-sm font-medium">
                  Statement Date
                </label>
                <input
                  id="statement-date"
                  type="date"
                  value={statementDate}
                  onChange={(e) => setStatementDate(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="statement-ending-balance" className="text-sm font-medium">
                Statement Ending Balance
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted">$</span>
                <input
                  id="statement-ending-balance"
                  type="text"
                  className="w-full rounded-l-none rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button onClick={handleStartReconciliation} disabled={!selectedAccount}>
                Start Reconciliation
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <AccountSummaryCards 
            beginningBalance="$10,934.09"
            endingBalance="$15,243.89"
            clearedBalance="$15,243.89"
            difference="$0.00"
          />
          
          <Tabs defaultValue="transactions">
            <TabsList className="mb-4">
              <TabsTrigger value="transactions">Match Transactions</TabsTrigger>
              <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transactions">
              <ReconciliationContent 
                bankTransactions={BANK_TRANSACTIONS}
                bookTransactions={BOOK_TRANSACTIONS}
              />
            </TabsContent>
            
            <TabsContent value="adjustments">
              <Card>
                <CardHeader>
                  <CardTitle>Reconciliation Adjustments</CardTitle>
                  <CardDescription>Record adjustments for discrepancies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-[200px]">
                    <p className="text-muted-foreground text-center mb-4">
                      No adjustments needed. Your records match the bank statement.
                    </p>
                    <Button variant="outline">Add Adjustment</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Reconciliation History</CardTitle>
                  <CardDescription>Previous reconciliations for this account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative overflow-x-auto rounded-md border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-6 py-3 text-left">Statement Date</th>
                          <th className="px-6 py-3 text-left">Completed Date</th>
                          <th className="px-6 py-3 text-right">Beginning Balance</th>
                          <th className="px-6 py-3 text-right">Ending Balance</th>
                          <th className="px-6 py-3 text-right">Reconciled By</th>
                          <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-6 py-4">Apr 30, 2025</td>
                          <td className="px-6 py-4">May 5, 2025</td>
                          <td className="px-6 py-4 text-right">$8,235.45</td>
                          <td className="px-6 py-4 text-right">$10,934.09</td>
                          <td className="px-6 py-4 text-right">Admin User</td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="sm">View</Button>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-6 py-4">Mar 31, 2025</td>
                          <td className="px-6 py-4">Apr 3, 2025</td>
                          <td className="px-6 py-4 text-right">$5,120.33</td>
                          <td className="px-6 py-4 text-right">$8,235.45</td>
                          <td className="px-6 py-4 text-right">Admin User</td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="sm">View</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
      
      <FinishReconciliationDialog 
        open={openFinishDialog}
        onOpenChange={setOpenFinishDialog}
        onConfirm={handleCompleteReconciliation}
        beginningBalance="$10,934.09"
        endingBalance="$15,243.89"
        clearedDeposits="$6,250.00"
        clearedPayments="$1,940.20"
        difference="$0.00"
      />
    </div>
  );
};
